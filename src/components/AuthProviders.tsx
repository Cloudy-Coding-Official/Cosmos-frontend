import { Wallet } from "lucide-react";
import { useStellarWallet } from "../context/StellarWalletContext";

const btnBase =
  "w-full flex items-center justify-center gap-3 px-4 py-3.5 font-medium rounded-lg border border-cosmos-border bg-cosmos-surface-elevated text-cosmos-text hover:border-cosmos-accent hover:bg-cosmos-surface-hover transition-colors cursor-pointer";

/** Ícono G de Google (una sola tonalidad para dark) */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 1 1 0-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0 0 12 2C6.477 2 2 6.477 2 12s4.477 10 10 10c8.18 0 10-7.273 10-10 0-.835-.086-1.467-.19-2.032H12.545z"
      />
    </svg>
  );
}

export function AuthProviders({
  mode,
  onGoogle,
  googleLoading,
  onStellarLogin,
  stellarLoginLoading
}: {
  mode: "login" | "register";
  onGoogle?: () => void;
  googleLoading?: boolean;
  onStellarLogin?: () => Promise<void>;
  stellarLoginLoading?: boolean;
}) {
  const googleLabel = mode === "login" ? "Continuar con Google" : "Registrarse con Google";
  const stellar = useStellarWallet();

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        className={btnBase}
        onClick={onGoogle}
        disabled={!onGoogle || googleLoading}
      >
        <GoogleIcon className="shrink-0 w-5 h-5" />
        {googleLoading ? "Iniciando sesión…" : googleLabel}
      </button>
      
      {stellar.address ? (
        <div className="flex flex-col gap-2 p-3 rounded-lg border border-cosmos-border bg-cosmos-surface-elevated">
          <p className="text-xs text-cosmos-muted m-0">
            Wallet Stellar conectada
          </p>
          <p className="font-mono text-sm text-cosmos-text truncate m-0" title={stellar.address}>
            {stellar.address.slice(0, 8)}…{stellar.address.slice(-6)}
          </p>
          <div className="flex flex-wrap gap-2 items-center">
            {mode === "login" && onStellarLogin && (
              <button
                type="button"
                onClick={onStellarLogin}
                disabled={stellarLoginLoading}
                className="px-3 py-1.5 text-sm font-medium bg-cosmos-accent text-cosmos-bg rounded-lg hover:bg-cosmos-accent-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {stellarLoginLoading ? "Iniciando sesión…" : "Iniciar sesión con esta wallet"}
              </button>
            )}
            <button
              type="button"
              onClick={stellar.disconnect}
              className="text-xs font-medium text-cosmos-muted hover:text-cosmos-accent transition-colors"
            >
              Desconectar
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className={btnBase}
          onClick={stellar.connect}
          disabled={stellar.isConnecting}
        >
          <Wallet size={20} className="shrink-0" />
          {stellar.isConnecting ? "Conectando…" : "Conectar wallet Stellar"}
        </button>
      )}
      {stellar.error && (
        <p className="text-xs text-red-400 m-0">{stellar.error}</p>
      )}
    </div>
  );
}
