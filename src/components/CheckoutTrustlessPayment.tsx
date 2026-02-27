import { useState, useEffect } from "react";
import { Wallet, Loader2, CheckCircle, ArrowRight } from "lucide-react";
import { useStellarWallet } from "../context/StellarWalletContext";
import {
  useInitializeEscrow,
  useSendTransaction,
  useFundEscrow,
} from "@trustless-work/escrow/hooks";
import type { InitializeSingleReleaseEscrowPayload } from "@trustless-work/escrow";
import {
  getOrderEscrowConfig,
  registerEscrowDeployed,
  registerEscrowFunded,
  type EscrowConfig,
} from "../api/orders";
import { getErrorMessage, refreshAccessToken } from "../api/client";

const STELLAR_TESTNET_PASSPHRASE = "Test SDF Network ; September 2015";
const IS_DEV = import.meta.env.DEV;

function validateDeployPayload(p: Record<string, unknown>): string | null {
  const required = ["signer", "engagementId", "title", "description", "amount", "platformFee", "milestones", "roles", "trustline"];
  for (const key of required) {
    if (!(key in p) || p[key] == null) return `Falta campo requerido: ${key}`;
  }
  const roles = p.roles;
  if (Array.isArray(roles)) {
    if (roles.length < 6) return "roles debe tener 6 elementos";
    const roleKeys = ["approver", "serviceProvider", "platformAddress", "releaseSigner", "disputeResolver", "receiver"];
    for (let i = 0; i < roleKeys.length; i++) {
      const item = roles[i] as Record<string, unknown>;
      const addr = item?.[roleKeys[i]];
      if (typeof addr !== "string" || addr.length < 56) return `roles[${i}] (${roleKeys[i]}) debe ser dirección Stellar (G...)`;
    }
  } else if (roles && typeof roles === "object" && !Array.isArray(roles)) {
    const ro = roles as Record<string, unknown>;
    const platformKey = "plataformAddress" in ro ? "plataformAddress" : "platformAddress";
    const roleKeys = ["approver", "serviceProvider", platformKey, "releaseSigner", "disputeResolver", "receiver"];
    for (const k of roleKeys) {
      if (typeof ro[k] !== "string" || (ro[k] as string).length < 56) return `roles.${k} debe ser una dirección Stellar (G...)`;
    }
  } else {
    return "roles requerido (objeto o array)";
  }
  const tl = p.trustline;
  if (Array.isArray(tl)) {
    if (tl.length === 0) return "trustline debe tener al menos un elemento";
    const first = tl[0] as Record<string, unknown>;
    if (!first || typeof first.address !== "string" || typeof first.symbol !== "string") return "trustline[0] debe tener address y symbol";
  } else if (tl && typeof tl === "object") {
    const t = tl as Record<string, unknown>;
    if (typeof t.address !== "string" || typeof t.symbol !== "string") return "trustline debe tener address y symbol";
  } else {
    return "trustline requerido";
  }
  const milestones = p.milestones as unknown[];
  if (!Array.isArray(milestones) || milestones.length === 0) return "milestones debe ser un array con al menos un elemento";
  if (typeof p.amount !== "number" || p.amount <= 0) return "amount debe ser un número positivo";
  return null;
}

function validateFundPayload(p: { contractId: string; amount: number; signer: string }): string | null {
  if (!p.contractId?.trim()) return "contractId requerido";
  if (typeof p.amount !== "number" || p.amount <= 0) return "amount debe ser un número positivo";
  if (!p.signer?.trim() || !p.signer.startsWith("G")) return "signer debe ser una dirección Stellar (G...)";
  return null;
}

type Step = "connect" | "deploy" | "fund" | "done" | "error";

export function   CheckoutTrustlessPayment({
  orderId,
  onSuccess,
  onBack,
}: {
  orderId: string;
  onSuccess: () => void;
  onBack: () => void;
}) {
  const { address, connect, isConnecting, signTransaction } = useStellarWallet();
  const { deployEscrow } = useInitializeEscrow();
  const { sendTransaction } = useSendTransaction();
  const { fundEscrow } = useFundEscrow();
  const [step, setStep] = useState<Step>("connect");
  const [config, setConfig] = useState<EscrowConfig | null>(null);
  const [contractId, setContractId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (address && step === "connect") setStep("deploy");
  }, [address, step]);

  const handleConnect = async () => {
    setError(null);
    try {
      await connect();
      setStep("deploy");
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo conectar la wallet"));
    }
  };

  const handleDeploy = async () => {
    if (!address) return;
    const apiKey = import.meta.env.VITE_TRUSTLESSWORK_API_KEY?.trim();
    if (!apiKey) {
      setError("Falta la API key de Trustless. Configurá VITE_TRUSTLESSWORK_API_KEY en el .env del frontend.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const escrowConfig = await getOrderEscrowConfig(orderId);
      setConfig(escrowConfig);
      // Usar los roles del backend tal cual: approver = plataforma para que al confirmar
      // recepción el backend pueda firmar approve-milestone y release-funds.
      const rolesForApi = {
        approver: escrowConfig.roles.approver,
        serviceProvider: escrowConfig.roles.serviceProvider,
        platformAddress: escrowConfig.roles.platformAddress ?? "",
        releaseSigner: escrowConfig.roles.releaseSigner,
        disputeResolver: escrowConfig.roles.disputeResolver,
        receiver: escrowConfig.roles.receiver,
      };
      const trustlineAddress = escrowConfig.trustline?.address?.trim();
      if (!trustlineAddress || trustlineAddress.length < 56) {
        throw new Error("Falta la dirección del trustline USDC (STELLAR_USDC_TRUSTLINE_ADDRESS en el backend).");
      }
      const trustlineForApi = { symbol: escrowConfig.trustline.symbol, address: trustlineAddress };
      const amountForApi = Number(escrowConfig.amount);
      const invalidRole = Object.entries(rolesForApi).find(([, v]) => !v || typeof v !== "string" || !v.startsWith("G") || v.length < 56);
      if (invalidRole) {
        throw new Error(`La dirección de ${invalidRole[0]} no es válida. Revisá COSMOS_PLATFORM_STELLAR_ADDRESS en el backend.`);
      }
      const payload = {
        ...escrowConfig,
        signer: address,
        roles: rolesForApi,
        amount: amountForApi,
        trustline: trustlineForApi,
      } as unknown as InitializeSingleReleaseEscrowPayload;
      const validationError = validateDeployPayload(payload as Record<string, unknown>);
      if (validationError) throw new Error(validationError);
      if (IS_DEV) {
        console.log("[Trustless] Deploy payload:", {
          engagementId: payload.engagementId,
          title: payload.title,
          amount: payload.amount,
          platformFee: payload.platformFee,
          roles: Object.keys(payload.roles || {}),
          trustline: payload.trustline,
          milestonesCount: (payload.milestones || []).length,
        });
      }
      const deployResponse = await deployEscrow(payload, "single-release");
      const { unsignedTransaction } = deployResponse;
      if (IS_DEV) {
        console.log("[Trustless] Deploy response:", {
          hasUnsignedTransaction: !!unsignedTransaction,
          fullResponseKeys: Object.keys(deployResponse || {}),
        });
      }
      if (!unsignedTransaction) {
        throw new Error("No se recibió la transacción para firmar. Revisá la consola (F12) para más detalle.");
      }
      const signedXdr = await signTransaction(unsignedTransaction, {
        networkPassphrase: STELLAR_TESTNET_PASSPHRASE,
      });
      if (!signedXdr) throw new Error("No se pudo firmar la transacción");
      const response = await sendTransaction(signedXdr);
      const status = (response as { status?: string }).status;
      if (status === "FAILED") {
        const msg = (response as { message?: string }).message;
        throw new Error(msg ?? "Error al desplegar el escrow");
      }
      const contractIdFromResponse = (response as { contractId?: string }).contractId;
      if (!contractIdFromResponse) throw new Error("No se recibió el ID del contrato");
      setContractId(contractIdFromResponse);
      await registerEscrowDeployed(orderId, contractIdFromResponse);
      setStep("fund");
    } catch (err) {
      const res = (err as { response?: { status?: number; data?: unknown } })?.response;
      const axiosData = res?.data;
      if (IS_DEV && res?.status === 400 && axiosData != null) {
        console.error("[Trustless] 400 response body:", axiosData);
      }
      let apiMsg: string | null = null;
      if (axiosData != null && typeof axiosData === "object") {
        const d = axiosData as Record<string, unknown>;
        if (typeof d.message === "string") apiMsg = d.message;
        else if (Array.isArray(d.message)) apiMsg = d.message.map(String).join(". ");
        else if (Array.isArray(d.errors)) apiMsg = (d.errors as unknown[]).map((e: unknown) => typeof e === "object" && e != null && "message" in e ? String((e as { message: unknown }).message) : String(e)).join(". ");
      }
      let message = apiMsg && apiMsg.length > 0 ? apiMsg : getErrorMessage(err, "Error al desplegar el escrow");
      if (message.toLowerCase().includes("issuer cannot be null")) {
        message += " Revisá: (1) VITE_TRUSTLESSWORK_API_KEY en .env del frontend, (2) STELLAR_USDC_TRUSTLINE_ADDRESS en el backend.";
      }
      setError(message);
      setStep("error");
    } finally {
      setLoading(false);
    }
  };

  const handleFund = async () => {
    if (!address || !contractId || !config) return;
    setError(null);
    setLoading(true);
    try {
      const amountForFund = Number(config.amount);
      const fundPayload = { contractId, amount: amountForFund, signer: address };
      const validationError = validateFundPayload(fundPayload);
      if (validationError) throw new Error(validationError);
      if (IS_DEV) {
        console.log("[Trustless] Fund payload:", { contractId, amount: amountForFund, signer: address?.slice(0, 8) + "…" });
      }
      const fundResponse = await fundEscrow(fundPayload, "single-release");
      const { unsignedTransaction } = fundResponse;
      if (!unsignedTransaction) {
        throw new Error("No se recibió la transacción para fondear. Revisá la consola (F12) para más detalle.");
      }
      const signedXdr = await signTransaction(unsignedTransaction, {
        networkPassphrase: STELLAR_TESTNET_PASSPHRASE,
      });
      if (!signedXdr) throw new Error("No se pudo firmar la transacción");
      const response = await sendTransaction(signedXdr);
      const status = (response as { status?: string }).status;
      if (status === "FAILED") {
        const msg = (response as { message?: string }).message;
        throw new Error(msg ?? "Error al fondear el escrow");
      }
      // Refrescar token por si expiró mientras la wallet estaba abierta
      await refreshAccessToken();
      await registerEscrowFunded(orderId);
      setStep("done");
      onSuccess();
    } catch (err) {
      const errStatus = (err as { status?: number })?.status;
      let msg = getErrorMessage(err, "Error al fondear el escrow");
      if (errStatus === 401) {
        msg = "Tu sesión expiró. Volvé a iniciar sesión y, si ya enviaste el pago, el pedido debería actualizarse al refrescar la página.";
      } else {
        const hint =
          /trustline|cannot hold|insufficient|balance/i.test(msg) || msg.includes("op_status_bad_auth")
            ? " Asegurate de tener la trustline de USDC (testnet) en tu wallet y saldo suficiente."
            : "";
        msg = msg + hint;
      }
      setError(msg);
      setStep("error");
    } finally {
      setLoading(false);
    }
  };

  if (step === "done") {
    return (
      <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-4">
        <CheckCircle size={32} className="text-emerald-400 shrink-0" />
        <div>
          <p className="font-semibold text-cosmos-text m-0">Pago completado</p>
          <p className="text-sm text-cosmos-muted m-0">Redirigiendo a tu pedido…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-cosmos-surface border border-cosmos-border rounded-xl space-y-4">
      <h2 className="font-semibold text-cosmos-text text-lg m-0">Pago con Trustless (Stellar)</h2>
      <p className="text-sm text-cosmos-muted">
        Tus fondos quedan en depósito hasta que confirmes la recepción. El proveedor recibe el pago cuando marques el pedido como recibido.
      </p>
      {error && (
        <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">
          {error}
        </div>
      )}
      {step === "connect" && (
        <div className="space-y-3">
          {!address ? (
            <button
              type="button"
              onClick={handleConnect}
              disabled={isConnecting}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 font-medium bg-cosmos-accent text-cosmos-bg rounded-xl hover:bg-cosmos-accent-hover disabled:opacity-50"
            >
              {isConnecting ? <Loader2 size={20} className="animate-spin" /> : <Wallet size={20} />}
              {isConnecting ? "Conectando…" : "Conectar wallet Stellar"}
            </button>
          ) : (
            <p className="text-sm text-cosmos-muted m-0">Wallet conectada. Redirigiendo al pago…</p>
          )}
        </div>
      )}
      {step === "deploy" && address && (
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-cosmos-surface-elevated">
            <span className="text-sm text-cosmos-muted">Tu wallet</span>
            <span className="text-sm font-mono text-cosmos-text truncate max-w-[200px]">
              {address.slice(0, 6)}…{address.slice(-4)}
            </span>
          </div>
          <p className="text-sm text-cosmos-muted">
            <strong className="text-cosmos-text">Paso 1 de 2:</strong> Desplegar el contrato de depósito en Stellar. Tu wallet pedirá firmar una transacción.
          </p>
          <button
            type="button"
            onClick={handleDeploy}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 font-medium bg-cosmos-accent text-cosmos-bg rounded-xl hover:bg-cosmos-accent-hover disabled:opacity-50"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <ArrowRight size={20} />}
            {loading ? "Desplegando…" : "Desplegar depósito y continuar"}
          </button>
          <button type="button" onClick={onBack} className="w-full py-2 text-sm text-cosmos-muted hover:text-cosmos-text">
            Cancelar y volver
          </button>
        </div>
      )}
      {step === "fund" && (
        <div className="space-y-4">
          <p className="text-sm text-cosmos-muted">
            <strong className="text-cosmos-text">Paso 2 de 2:</strong> Enviar USDC al depósito. Tu wallet pedirá firmar de nuevo; al confirmar se completará el pago.
          </p>
          <button
            type="button"
            onClick={handleFund}
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 font-medium bg-cosmos-accent text-cosmos-bg rounded-xl hover:bg-cosmos-accent-hover disabled:opacity-50"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : null}
            {loading ? "Enviando…" : "Fondear con USDC"}
          </button>
        </div>
      )}
      {step === "error" && (
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-2.5 font-medium border border-cosmos-border rounded-lg text-cosmos-text hover:border-cosmos-accent"
          >
            Volver
          </button>
          {address && (
            <button
              type="button"
              onClick={() => { setStep("deploy"); setError(null); }}
              className="flex-1 py-2.5 font-medium bg-cosmos-accent text-cosmos-bg rounded-lg hover:bg-cosmos-accent-hover"
            >
              Reintentar
            </button>
          )}
        </div>
      )}
    </div>
  );
}
