import { Link } from "react-router-dom";
import { useState } from "react";
import { AuthProviders } from "../components/AuthProviders";

export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"buyer" | "seller" | "both">("buyer");

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
        <h1 className="font-display text-[1.75rem] text-cosmos-text m-0 mb-1">Crear cuenta</h1>
        <p className="text-[0.9375rem] text-cosmos-muted m-0 mb-6">Únete a Cosmos y empieza a operar</p>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wider text-cosmos-muted">Nombre completo</span>
            <input
              type="text"
              className="w-full px-4 py-3 font-sans text-base border border-cosmos-border bg-cosmos-surface-elevated text-cosmos-text placeholder:text-cosmos-muted focus:outline-none focus:border-cosmos-accent focus:ring-1 focus:ring-cosmos-accent rounded-lg transition-colors"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              required
            />
          </label>
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
              placeholder="Mínimo 8 caracteres"
              required
              minLength={8}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium uppercase tracking-wider text-cosmos-muted">Quiero usar Cosmos como</span>
            <select
              className="w-full px-4 py-3 font-sans text-base border border-cosmos-border bg-cosmos-surface-elevated text-cosmos-text focus:outline-none focus:border-cosmos-accent focus:ring-1 focus:ring-cosmos-accent rounded-lg transition-colors"
              value={role}
              onChange={(e) => setRole(e.target.value as "buyer" | "seller" | "both")}
            >
              <option value="buyer">Solo comprar</option>
              <option value="seller">Vender (retailer)</option>
              <option value="both">Comprar y vender</option>
            </select>
          </label>
          <button type="submit" className="px-6 py-3.5 font-medium bg-cosmos-accent text-cosmos-bg border-0 rounded-lg hover:bg-cosmos-accent-hover transition-colors cursor-pointer shadow-lg">
            Crear cuenta
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <span className="flex-1 h-px bg-cosmos-border" />
          <span className="text-xs font-medium uppercase tracking-wider text-cosmos-muted">o regístrate con</span>
          <span className="flex-1 h-px bg-cosmos-border" />
        </div>

        <AuthProviders mode="register" onGoogle={handleGoogle} onWallet={handleWallet} />

        <p className="mt-6 pt-6 border-t border-cosmos-border text-[0.9375rem] text-cosmos-muted text-center m-0">
          ¿Ya tienes cuenta? <Link to="/login" className="text-cosmos-accent font-medium hover:text-cosmos-accent-hover">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
