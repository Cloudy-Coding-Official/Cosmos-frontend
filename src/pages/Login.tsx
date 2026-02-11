import { Link } from "react-router-dom";
import { useState } from "react";
import { AuthProviders } from "../components/AuthProviders";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleGoogle = () => {
    // TODO: integrar OAuth Google
  };

  const handleWallet = () => {
    // TODO: integrar conexión wallet
  };

  return (
    <div className="min-h-[calc(100vh-72px-200px)] flex items-center justify-center py-12 px-6 bg-cosmos-bg">
      <div className="w-full max-w-[420px] p-10 bg-cosmos-surface border border-cosmos-border rounded-xl shadow-xl">
        <h1 className="font-display text-[1.75rem] text-cosmos-text m-0 mb-1">Iniciar sesión</h1>
        <p className="text-[0.9375rem] text-cosmos-muted m-0 mb-6">Accede a tu cuenta de Cosmos</p>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wider text-cosmos-muted">Correo electrónico</span>
            <input
              type="email"
              className="w-full px-4 py-3 font-sans text-base border border-cosmos-border bg-cosmos-surface-elevated text-cosmos-text placeholder:text-cosmos-muted focus:outline-none focus:border-cosmos-accent focus:ring-1 focus:ring-cosmos-accent rounded-lg transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wider text-cosmos-muted">Contraseña</span>
            <input
              type="password"
              className="w-full px-4 py-3 font-sans text-base border border-cosmos-border bg-cosmos-surface-elevated text-cosmos-text placeholder:text-cosmos-muted focus:outline-none focus:border-cosmos-accent focus:ring-1 focus:ring-cosmos-accent rounded-lg transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="flex items-center gap-2 text-sm text-cosmos-muted cursor-pointer">
              <input type="checkbox" className="rounded border-cosmos-border bg-cosmos-surface-elevated text-cosmos-accent focus:ring-cosmos-accent" /> Recordarme
            </label>
            <Link to="/restablecer-contraseña" className="text-sm text-cosmos-accent font-medium hover:text-cosmos-accent-hover">¿Olvidaste tu contraseña?</Link>
          </div>
          <button type="submit" className="w-full mt-2 px-6 py-3.5 font-medium bg-cosmos-accent text-cosmos-bg border-0 rounded-lg hover:bg-cosmos-accent-hover transition-colors cursor-pointer shadow-lg">
            Entrar
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <span className="flex-1 h-px bg-cosmos-border" />
          <span className="text-xs font-medium uppercase tracking-wider text-cosmos-muted">o continúa con</span>
          <span className="flex-1 h-px bg-cosmos-border" />
        </div>

        <AuthProviders mode="login" onGoogle={handleGoogle} onWallet={handleWallet} />

        <p className="mt-6 pt-6 border-t border-cosmos-border text-[0.9375rem] text-cosmos-muted text-center m-0">
          ¿No tienes cuenta? <Link to="/registro" className="text-cosmos-accent font-medium hover:text-cosmos-accent-hover">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}
