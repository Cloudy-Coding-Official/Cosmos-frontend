import { useState } from "react";
import { Link } from "react-router-dom";
import { Wallet, ArrowLeft, RefreshCw } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useStellarWallet } from "../context/StellarWalletContext";
import * as authApi from "../api/auth";
import { getErrorMessage } from "../api/client";

function formatAddress(addr: string): string {
  if (addr.length <= 16) return addr;
  return `${addr.slice(0, 8)}…${addr.slice(-8)}`;
}

export function ProfileWallet() {
  const { user, refreshUser } = useAuth();
  const stellar = useStellarWallet();
  const [linking, setLinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const walletAddress = user?.walletAddresses?.[0] ?? null;
  const hasWallet = !!walletAddress;

  const handleSyncWallet = async () => {
    setError(null);
    setSuccess(null);
    setLinking(true);
    try {
      let address = stellar.address;
      if (!address) {
        await stellar.connect();
        address = stellar.address;
      }
      if (!address) {
        setError("No se pudo obtener la dirección de la wallet. Conectá e intentá de nuevo.");
        return;
      }
      const { message } = await authApi.getWalletNonce(address);
      const signature = await stellar.signMessage(message);
      if (!signature) {
        setError("Tu wallet no permitió firmar. Confirmá en el popup (Freighter u otra).");
        return;
      }
      const res = await authApi.linkWallet({ address, signature });
      const alreadyLinked = /ya está vinculada a tu cuenta/i.test(res.message ?? "");
      if (alreadyLinked) {
        setSuccess("La wallet ingresada ya se encuentra vinculada a la cuenta.");
      } else {
        await refreshUser();
        setSuccess(hasWallet ? "Wallet reemplazada correctamente." : "Wallet vinculada correctamente.");
      }
    } catch (err) {
      const msg = getErrorMessage(err, "Error al vincular la wallet");
      if (/rejected|rechazad|cancel/i.test(msg)) {
        setError("La wallet canceló la firma. Probá de nuevo y tocá «Confirm» en el popup.");
      } else {
        setError(msg);
      }
    } finally {
      setLinking(false);
    }
  };

  return (
    <div className="py-8 bg-cosmos-bg min-h-[calc(100vh-72px-200px)]">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <Link
            to="/perfil"
            className="flex items-center gap-2 text-cosmos-muted hover:text-cosmos-accent text-sm transition-colors"
          >
            <ArrowLeft size={18} />
            Perfil
          </Link>
          <span className="text-cosmos-muted">/</span>
          <h1 className="font-display font-semibold text-cosmos-text text-2xl m-0">Mi wallet</h1>
        </div>

        <div className="bg-cosmos-surface border border-cosmos-border rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-cosmos-accent-soft flex items-center justify-center shrink-0">
              <Wallet size={24} className="text-cosmos-accent" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-cosmos-text text-lg m-0">
                {hasWallet ? "Wallet vinculada" : "Sincronizar wallet Stellar"}
              </h2>
              <p className="text-sm text-cosmos-muted m-0">
                {hasWallet
                  ? "Solo podés tener una wallet vinculada. Podés reemplazarla por otra de Stellar (Freighter, xBull, etc.)."
                  : "Vinculá tu wallet de Stellar para usarla en Cosmos. Solo se permite una wallet por cuenta."}
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/30 text-sm text-green-400">
              {success}
            </div>
          )}

          {hasWallet ? (
            <div className="space-y-4">
              <div className="p-4 bg-cosmos-surface-elevated rounded-xl border border-cosmos-border">
                <p className="text-xs font-medium uppercase tracking-wider text-cosmos-muted mb-1">Dirección Stellar</p>
                <p className="font-mono text-cosmos-text break-all" title={walletAddress}>
                  {walletAddress}
                </p>
                <p className="text-xs text-cosmos-muted mt-2">Formato corto: {formatAddress(walletAddress)}</p>
              </div>
              <button
                type="button"
                onClick={handleSyncWallet}
                disabled={linking}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-cosmos-accent hover:text-cosmos-accent-hover border border-cosmos-accent/50 rounded-xl hover:bg-cosmos-accent-soft transition-colors disabled:opacity-60"
              >
                <RefreshCw size={18} className={linking ? "animate-spin" : undefined} />
                {linking ? "Vinculando…" : "Reemplazar por otra wallet Stellar"}
              </button>
            </div>
          ) : (
            <div>
              <p className="text-sm text-cosmos-muted mb-4">
                Conectá tu wallet (Freighter, xBull u otra compatible) y firmá un mensaje para vincularla a tu cuenta. Es el mismo proceso que para iniciar sesión con wallet.
              </p>
              <button
                type="button"
                onClick={handleSyncWallet}
                disabled={linking || stellar.isConnecting}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 font-medium bg-cosmos-accent text-cosmos-bg rounded-xl hover:bg-cosmos-accent-hover transition-colors disabled:opacity-60"
              >
                {(linking || stellar.isConnecting) ? (
                  "Conectando y vinculando…"
                ) : (
                  "Conectar y vincular mi wallet Stellar"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
