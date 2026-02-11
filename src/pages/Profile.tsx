import { Link } from "react-router-dom";
import { User, Mail, Shield, Store, LogOut, Key, ShoppingBag } from "lucide-react";
import { WalletSummary } from "../components/WalletSummary";
import { useState } from "react";

// Datos mock hasta integrar backend
const MOCK_USER = {
  name: "María García",
  email: "maria@ejemplo.com",
  role: "both" as "buyer" | "seller" | "both",
  memberSince: "Marzo 2025",
};

export function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(MOCK_USER.name);
  const [email, setEmail] = useState(MOCK_USER.email);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
  };

  return (
    <div className="py-8 bg-cosmos-bg min-h-[calc(100vh-72px-200px)]">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <h1 className="font-display font-semibold text-cosmos-text text-2xl md:text-3xl m-0 mb-8">Mi perfil</h1>

        <section className="mb-8 p-6 md:p-8 bg-cosmos-surface border border-cosmos-border rounded-xl">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-20 h-20 shrink-0 rounded-xl bg-cosmos-surface-elevated flex items-center justify-center border border-cosmos-border">
              <User size={36} className="text-cosmos-muted" />
            </div>
            <div className="flex-1 min-w-0">
              {!isEditing ? (
                <>
                  <h2 className="font-display font-semibold text-cosmos-text text-xl m-0 mb-1">{name}</h2>
                  <p className="text-cosmos-muted text-sm m-0 mb-4 flex items-center gap-2">
                    <Mail size={16} className="shrink-0" />
                    {email}
                  </p>
                  <p className="text-xs text-cosmos-muted m-0">Miembro desde {MOCK_USER.memberSince}</p>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="mt-4 px-4 py-2 text-sm font-medium text-cosmos-accent hover:text-cosmos-accent-hover border border-cosmos-accent/50 rounded-lg hover:bg-cosmos-accent-soft transition-colors"
                  >
                    Editar perfil
                  </button>
                </>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <label className="block">
                    <span className="text-xs font-medium uppercase tracking-wider text-cosmos-muted block mb-1.5">Nombre</span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 border border-cosmos-border bg-cosmos-surface-elevated text-cosmos-text rounded-lg focus:outline-none focus:border-cosmos-accent focus:ring-1 focus:ring-cosmos-accent"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-medium uppercase tracking-wider text-cosmos-muted block mb-1.5">Correo</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-cosmos-border bg-cosmos-surface-elevated text-cosmos-text rounded-lg focus:outline-none focus:border-cosmos-accent focus:ring-1 focus:ring-cosmos-accent"
                    />
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="px-4 py-2.5 font-medium bg-cosmos-accent text-cosmos-bg rounded-lg hover:bg-cosmos-accent-hover transition-colors"
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      onClick={() => { setIsEditing(false); setName(MOCK_USER.name); setEmail(MOCK_USER.email); }}
                      className="px-4 py-2.5 font-medium text-cosmos-muted border border-cosmos-border rounded-lg hover:bg-cosmos-surface-elevated transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>

        <section className="mb-8">
          <WalletSummary
            viewDetails={true}
            estimatedUsdt={1250.5}
            walletsCount={2}
            loadingBalances={false}
            loadingWallets={false}
          />
        </section>

        <section className="mb-8 p-6 bg-cosmos-surface border border-cosmos-border rounded-xl">
          <h3 className="font-display font-semibold text-cosmos-text text-lg m-0 mb-4 flex items-center gap-2">
            <ShoppingBag size={20} className="text-cosmos-accent" />
            Cuenta
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {(MOCK_USER.role === "buyer" || MOCK_USER.role === "both") && (
              <span className="px-3 py-1.5 text-xs font-medium bg-cosmos-accent-soft text-cosmos-accent rounded-lg border border-cosmos-accent/20">
                Comprador
              </span>
            )}
            {(MOCK_USER.role === "seller" || MOCK_USER.role === "both") && (
              <span className="px-3 py-1.5 text-xs font-medium bg-cosmos-accent-soft text-cosmos-accent rounded-lg border border-cosmos-accent/20">
                Vendedor
              </span>
            )}
          </div>
          {(MOCK_USER.role === "seller" || MOCK_USER.role === "both") && (
            <Link
              to="/retailer"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-cosmos-text border border-cosmos-border rounded-lg hover:border-cosmos-accent hover:text-cosmos-accent transition-colors"
            >
              <Store size={18} />
              Ir a mi tienda
            </Link>
          )}
        </section>

        <section className="mb-8 p-6 bg-cosmos-surface border border-cosmos-border rounded-xl">
          <h3 className="font-display font-semibold text-cosmos-text text-lg m-0 mb-4 flex items-center gap-2">
            <Shield size={20} className="text-cosmos-accent" />
            Seguridad
          </h3>
          <Link
            to="/restablecer-contraseña"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-cosmos-text border border-cosmos-border rounded-lg hover:border-cosmos-accent hover:text-cosmos-accent transition-colors"
          >
            <Key size={18} />
            Cambiar contraseña
          </Link>
        </section>

        <div className="pt-4 border-t border-cosmos-border">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-cosmos-muted hover:text-red-400 transition-colors"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
