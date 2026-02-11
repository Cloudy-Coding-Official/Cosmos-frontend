import { Wallet } from "lucide-react";

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
  onWallet,
}: {
  mode: "login" | "register";
  onGoogle?: () => void;
  onWallet?: () => void;
}) {
  const googleLabel = mode === "login" ? "Continuar con Google" : "Registrarse con Google";
  const walletLabel = mode === "login" ? "Conectar wallet" : "Conectar wallet";

  return (
    <div className="flex flex-col gap-3">
      <button type="button" className={btnBase} onClick={onGoogle}>
        <GoogleIcon className="shrink-0 w-5 h-5" />
        {googleLabel}
      </button>
      <button type="button" className={btnBase} onClick={onWallet}>
        <Wallet size={20} className="shrink-0" />
        {walletLabel}
      </button>
    </div>
  );
}
