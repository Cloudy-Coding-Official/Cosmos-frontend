import { Link } from "react-router-dom";
import { useState } from "react";
import { AuthLayout } from "../components/AuthLayout";

export function ResetPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <AuthLayout>
      <div className="p-10 bg-cosmos-surface border border-cosmos-border rounded-xl shadow-xl">
        <h1 className="font-display text-[1.75rem] text-cosmos-text m-0 mb-1">Restablecer contraseña</h1>
        <p className="text-[0.9375rem] text-cosmos-muted m-0 mb-6">
          Ingresa tu correo y te enviaremos un enlace para crear una nueva contraseña.
        </p>

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
          <button type="submit" className="px-6 py-3.5 font-medium bg-cosmos-accent text-cosmos-bg border-0 rounded-lg hover:bg-cosmos-accent-hover transition-colors shadow-lg disabled:opacity-60 disabled:cursor-not-allowed">
            Enviar enlace
          </button>
        </form>

        <p className="mt-6 pt-6 border-t border-cosmos-border text-[0.9375rem] text-cosmos-muted text-center m-0">
          <Link to="/login" className="text-cosmos-accent font-medium hover:text-cosmos-accent-hover">Volver a iniciar sesión</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
