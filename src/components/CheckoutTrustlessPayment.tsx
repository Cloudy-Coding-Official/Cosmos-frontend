import { useState, useEffect, useCallback } from "react";
import { Wallet, Loader2, CheckCircle, ArrowRight, X, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

function toFriendlyErrorMessage(raw: string): string {
  if (raw.includes("sesión expiró")) return raw;
  if (/issuer cannot be null|trustline|STELLAR_USDC|platform.*address/i.test(raw)) {
    return "No pudimos completar el pago en este momento. Por favor intentá de nuevo más tarde o contactá soporte.";
  }
  if (/trustline|cannot hold|insufficient|balance|op_status_bad_auth/i.test(raw)) {
    return "Revisá que en tu billetera tengas el monto en USDC y que hayas aceptado el activo USDC. Luego intentá de nuevo.";
  }
  if (/no se recibió la transacción|no se pudo firmar/i.test(raw)) {
    return "Tu billetera no pudo completar la operación. Asegurate de aprobar las solicitudes que te aparezcan e intentá de nuevo.";
  }
  if (/API key|VITE_TRUSTLESS|configurá.*\.env/i.test(raw)) {
    return "El pago no está disponible en este momento. Por favor intentá más tarde.";
  }
  if (raw.length > 200 || /payload|contractId|XDR|signer|roles\./i.test(raw)) {
    return "Ocurrió un error al procesar el pago. Intentá de nuevo o contactá soporte si el problema sigue.";
  }
  return raw;
}

type Step = "connect" | "deploy" | "done" | "error";


export function CheckoutTrustlessPayment({
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
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (address && step === "connect") setStep("deploy");
  }, [address, step]);

  const handleClose = useCallback(() => {
    if (loading) return;
    onBack();
  }, [loading, onBack]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleClose]);

  const handleConnect = async () => {
    setError(null);
    try {
      await connect();
      setStep("deploy");
    } catch (err) {
      setError(getErrorMessage(err, "No pudimos conectar tu billetera. Revisá que esté desbloqueada e intentá de nuevo."));
    }
  };

  const handleDeploy = async () => {
    if (!address) return;
    const apiKey = import.meta.env.VITE_TRUSTLESSWORK_API_KEY?.trim();
    if (!apiKey) {
      setError("El pago no está disponible en este momento. Por favor intentá más tarde.");
      return;
    }
    setError(null);
    setLoading(true);
    setLoadingMessage("Preparando tu pago seguro…");
    try {
      setLoadingMessage("Un momento…");
      const escrowConfig = await getOrderEscrowConfig(orderId);
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
      setLoadingMessage("Abrí tu billetera y confirmá la operación");
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
      setLoadingMessage("Procesando…");
      const response = await sendTransaction(signedXdr);
      const status = (response as { status?: string }).status;
      if (status === "FAILED") {
        const msg = (response as { message?: string }).message;
        throw new Error(msg ?? "Error al desplegar el escrow");
      }
      const contractIdFromResponse = (response as { contractId?: string }).contractId;
      if (!contractIdFromResponse) throw new Error("No se recibió el ID del contrato");
      setLoadingMessage("Un momento…");
      await registerEscrowDeployed(orderId, contractIdFromResponse);

      // Paso 2 en el mismo flujo: fondear (sin otro clic; el usuario firma 2.ª vez en la wallet)
      const amountForFund = amountForApi;
      const fundPayload = { contractId: contractIdFromResponse, amount: amountForFund, signer: address };
      const fundValidationError = validateFundPayload(fundPayload);
      if (fundValidationError) throw new Error(fundValidationError);
      if (IS_DEV) {
        console.log("[Trustless] Fund payload:", { contractId: contractIdFromResponse, amount: amountForFund, signer: address?.slice(0, 8) + "…" });
      }
      setLoadingMessage("Confirmá el pago en tu billetera");
      const fundResponse = await fundEscrow(fundPayload, "single-release");
      const fundUnsigned = fundResponse.unsignedTransaction;
      if (!fundUnsigned) {
        throw new Error("No se recibió la transacción para fondear. Revisá la consola (F12) para más detalle.");
      }
      const fundSignedXdr = await signTransaction(fundUnsigned, {
        networkPassphrase: STELLAR_TESTNET_PASSPHRASE,
      });
      if (!fundSignedXdr) throw new Error("No se pudo firmar la transacción de pago");
      setLoadingMessage("Procesando el pago…");
      const fundTxResponse = await sendTransaction(fundSignedXdr);
      const fundStatus = (fundTxResponse as { status?: string }).status;
      if (fundStatus === "FAILED") {
        const msg = (fundTxResponse as { message?: string }).message;
        throw new Error(msg ?? "Error al fondear el escrow");
      }
      setLoadingMessage("Casi listo…");
      await refreshAccessToken();
      await registerEscrowFunded(orderId);
      setStep("done");
      onSuccess();
    } catch (err) {
      const res = (err as { response?: { status?: number; data?: unknown } })?.response;
      const axiosData = res?.data;
      if (IS_DEV && res?.status === 400 && axiosData != null) {
        console.error("[Trustless] 400 response body:", axiosData);
      }
      let message: string;
      const errStatus = (err as { status?: number })?.status;
      if (errStatus === 401) {
        message = "Tu sesión expiró. Volvé a iniciar sesión y, si ya enviaste el pago, el pedido debería actualizarse al refrescar la página.";
      } else if (axiosData != null && typeof axiosData === "object") {
        const d = axiosData as Record<string, unknown>;
        if (typeof d.message === "string") message = d.message;
        else if (Array.isArray(d.message)) message = d.message.map(String).join(". ");
        else if (Array.isArray(d.errors)) message = (d.errors as unknown[]).map((e: unknown) => typeof e === "object" && e != null && "message" in e ? String((e as { message: unknown }).message) : String(e)).join(". ");
        else message = getErrorMessage(err, "Error al procesar el pago");
      } else {
        message = getErrorMessage(err, "Error al procesar el pago");
      }
      message = toFriendlyErrorMessage(message);
      setError(message);
      setStep("error");
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  // Fase fund = ya pasamos deploy y estamos en el pago (loading) o terminamos
  const isFundPhase = step === "done" || (loading && /Confirmá el pago|Procesando el pago|Casi listo/.test(loadingMessage));
  const step3Done = isFundPhase;
  const step4Done = step === "done";
  const currentStepIndex = step4Done ? 3 : step3Done ? 3 : 2;
  const stepsForStepper = [
    { key: "data", label: "Tus datos", done: true },
    { key: "order", label: "Tu órden", done: true },
    { key: "contract", label: "Contrato", done: step3Done },
    { key: "fund", label: "Pago", done: step4Done },
  ];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={handleClose}
        role="dialog"
        aria-modal="true" 
        aria-labelledby="cosmos-pay-title"
      >
        <motion.div
          className="w-full max-w-md rounded-2xl bg-cosmos-surface border border-cosmos-border shadow-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 4 }}
          transition={{ type: "spring", damping: 28, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-cosmos-border bg-cosmos-surface-elevated/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cosmos-accent/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-cosmos-accent" />
              </div>
              <div>
                <h2 id="cosmos-pay-title" className="font-semibold text-cosmos-text text-lg m-0 leading-tight">
                  Cosmos Pay
                </h2>
                <p className="text-xs text-cosmos-muted m-0">Pago protegido hasta que recibas tu pedido</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="p-2 rounded-lg text-cosmos-muted hover:text-cosmos-text hover:bg-cosmos-surface transition-colors disabled:opacity-50"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>
          </div>

          {/* Stepper: 4 pasos — [celda][línea][celda][línea][celda][línea][celda] para espaciado uniforme */}
          {step !== "done" && step !== "error" && (
            <div className="px-4 pt-5 pb-4">
              <div className="flex items-center">
                {stepsForStepper.flatMap((s, i) => {
                  const isActive = currentStepIndex === i;
                  const stepEl = (
                    <div key={s.key} className="flex flex-1 flex-col items-center min-w-0">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${s.done ? "bg-emerald-500/25 text-emerald-400" : isActive ? "bg-cosmos-accent text-white ring-2 ring-cosmos-accent/40" : "bg-cosmos-surface-elevated text-cosmos-muted"}`}>{s.done ? "✓" : i + 1}</div>
                      <span className={`mt-1.5 block text-center text-[10px] font-medium leading-tight ${s.done ? "text-emerald-400/90" : isActive ? "text-cosmos-text" : "text-cosmos-muted"}`}>{s.label}</span>
                    </div>
                  );
                  return i === 0
                    ? [stepEl]
                    : [
                        <div key={`line-${i}`} className="w-4 shrink-0 flex items-center justify-center" aria-hidden>
                          <div className={`h-[2px] w-2 rounded-full ${stepsForStepper[i - 1]?.done ? "bg-emerald-500/50" : "bg-cosmos-border"}`} />
                        </div>,
                        stepEl,
                      ];
                })}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="px-6 pb-6 pt-2">
            {loading && loadingMessage ? (
              <div className="py-8 flex flex-col items-center justify-center gap-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                  className="w-14 h-14 rounded-full border-2 border-cosmos-border border-t-cosmos-accent"
                />
                <p className="text-sm font-medium text-cosmos-text m-0">{loadingMessage}</p>
                <p className="text-xs text-cosmos-muted m-0">No cierres ni recargues la página</p>
              </div>
            ) : step === "done" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", damping: 20 }}
                className="py-8 flex flex-col items-center justify-center gap-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 14, delay: 0.1 }}
                  className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center"
                >
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </motion.div>
                <div className="text-center">
                  <p className="font-semibold text-cosmos-text text-lg m-0">¡Listo!</p>
                  <p className="text-sm text-cosmos-muted mt-1 m-0">Tu pago está confirmado. Te llevamos a tu pedido…</p>
                </div>
              </motion.div>
            ) : (
              <>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300"
                  >
                    <p className="m-0 leading-relaxed">{error}</p>
                  </motion.div>
                )}

                {step === "connect" && (
                  <motion.div
                    key="connect"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <p className="text-sm text-cosmos-muted">
                      Conectá tu billetera para pagar con seguridad. El dinero queda protegido hasta que confirmes que recibiste el pedido.
                    </p>
                    {!address ? (
                      <button
                        type="button"
                        onClick={handleConnect}
                        disabled={isConnecting}
                        className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 font-medium bg-cosmos-accent text-white rounded-xl hover:bg-cosmos-accent-hover disabled:opacity-50 transition-colors"
                      >
                        {isConnecting ? <Loader2 size={20} className="animate-spin" /> : <Wallet size={20} />}
                        {isConnecting ? "Conectando…" : "Conectar billetera"}
                      </button>
                    ) : (
                      <p className="text-sm text-emerald-400/90 m-0">Billetera conectada</p>
                    )}
                  </motion.div>
                )}

                {step === "deploy" && address && (
                  <motion.div
                    key="deploy"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-cosmos-surface-elevated border border-cosmos-border">
                      <span className="text-xs text-cosmos-muted">Billetera conectada</span>
                      <span className="text-sm font-mono text-cosmos-text truncate max-w-[180px]">
                        {address.slice(0, 6)}…{address.slice(-4)}
                      </span>
                    </div>
                    <p className="text-sm text-cosmos-muted">
                      Tu billetera te va a pedir que confirmes <strong className="text-cosmos-text">dos veces</strong>: primero para reservar el pago y después para enviar el monto. Es normal y tarda unos segundos.
                    </p>
                    <button
                      type="button"
                      onClick={handleDeploy}
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 font-medium bg-cosmos-accent text-white rounded-xl hover:bg-cosmos-accent-hover disabled:opacity-50 transition-colors"
                    >
                      <ArrowRight size={20} />
                      Pagar ahora
                    </button>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="w-full py-2.5 text-sm text-cosmos-muted hover:text-cosmos-text transition-colors"
                    >
                      Cancelar y volver
                    </button>
                  </motion.div>
                )}

                {step === "error" && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3 pt-2"
                  >
                    <button
                      type="button"
                      onClick={handleClose}
                      className="flex-1 py-3 font-medium border border-cosmos-border rounded-xl text-cosmos-text hover:border-cosmos-accent transition-colors"
                    >
                      Volver
                    </button>
                    {address && (
                      <button
                        type="button"
                        onClick={() => {
                          setStep("deploy");
                          setError(null);
                        }}
                        className="flex-1 py-3 font-medium bg-cosmos-accent text-white rounded-xl hover:bg-cosmos-accent-hover transition-colors"
                      >
                        Reintentar
                      </button>
                    )}
                  </motion.div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
