import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Shield, Store, LogOut, Key, ShoppingBag, Sparkles, LayoutDashboard, Package, TrendingUp, Wallet, ShoppingCart } from "lucide-react";
import { WalletSummary } from "../components/WalletSummary";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getOrders } from "../data/orders";

function MisCompras() {
  const orders = getOrders();
  if (orders.length === 0) {
    return (
      <p className="text-cosmos-muted text-sm m-0 mb-4">
        Aún no tenés compras. <Link to="/tienda" className="text-cosmos-accent hover:underline">Explorar tienda</Link>
      </p>
    );
  }
  const estadoLabels: Record<string, string> = {
    comprado: "Comprado",
    en_camino: "En camino",
    confirmado: "Confirmado",
  };
  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <Link
          key={o.id}
          to={"/perfil/compras/" + o.id}
          className="block p-4 rounded-xl border border-cosmos-border hover:border-cosmos-accent/40 hover:bg-cosmos-surface-elevated transition-all"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-medium text-cosmos-text">{o.id}</span>
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-lg ${
                o.estado === "confirmado"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : o.estado === "en_camino"
                  ? "bg-amber-500/20 text-amber-400"
                  : "bg-cosmos-accent-soft text-cosmos-accent"
              }`}
            >
              {estadoLabels[o.estado]}
            </span>
          </div>
          <p className="text-sm text-cosmos-muted m-0 mt-1">
            {new Date(o.fecha).toLocaleDateString("es-AR", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}{" "}
            · US$ {o.monto.toFixed(2)} · {o.tienda}
          </p>
          <p className="text-xs text-cosmos-accent mt-2 m-0">Ver seguimiento →</p>
        </Link>
      ))}
    </div>
  );
}

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
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[calc(100vh-72px-200px)] bg-cosmos-bg py-8 md:py-12">
        <div className="w-full max-w-[600px] mx-auto px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-cosmos-accent-soft flex items-center justify-center mx-auto mb-6">
            <User size={32} className="text-cosmos-accent" />
          </div>
          <h1 className="font-display font-semibold text-cosmos-text text-2xl m-0 mb-4">Inicia sesión para ver tu perfil</h1>
          <p className="text-cosmos-muted mb-8">Accede a tu cuenta para gestionar tu perfil, wallet y dashboards.</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 font-medium bg-cosmos-accent text-cosmos-bg rounded-xl hover:bg-cosmos-accent-hover transition-colors"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-72px-200px)] bg-cosmos-bg py-8 md:py-12">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-xl bg-cosmos-accent-soft flex items-center justify-center">
            <Sparkles size={24} className="text-cosmos-accent" />
          </div>
          <h1 className="font-display font-semibold text-cosmos-text text-2xl md:text-3xl m-0">
            Mi perfil
          </h1>
        </div>

        <section className="mb-8 p-6 md:p-8 bg-cosmos-surface border border-cosmos-border rounded-2xl hover:border-cosmos-border-strong transition-colors">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-24 h-24 shrink-0 rounded-2xl bg-gradient-to-br from-cosmos-surface-elevated to-cosmos-surface flex items-center justify-center border border-cosmos-border">
              <User size={40} className="text-cosmos-muted" />
            </div>
            <div className="flex-1 min-w-0">
              {!isEditing ? (
                <>
                  <h2 className="font-display font-semibold text-cosmos-text text-xl m-0 mb-1">
                    {name}
                  </h2>
                  <p className="text-cosmos-muted text-sm m-0 mb-4 flex items-center gap-2">
                    <Mail size={16} className="shrink-0" />
                    {email}
                  </p>
                  <p className="text-xs text-cosmos-muted m-0">Miembro desde {MOCK_USER.memberSince}</p>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="mt-4 px-5 py-2.5 text-sm font-medium text-cosmos-accent hover:text-cosmos-accent-hover border border-cosmos-accent/50 rounded-xl hover:bg-cosmos-accent-soft transition-all"
                  >
                    Editar perfil
                  </button>
                </>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <label className="block">
                    <span className="text-xs font-medium uppercase tracking-wider text-cosmos-muted block mb-1.5">
                      Nombre
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 border border-cosmos-border bg-cosmos-surface-elevated text-cosmos-text rounded-xl focus:outline-none focus:border-cosmos-accent focus:ring-2 focus:ring-cosmos-accent/20 transition-all"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-medium uppercase tracking-wider text-cosmos-muted block mb-1.5">
                      Correo
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-cosmos-border bg-cosmos-surface-elevated text-cosmos-text rounded-xl focus:outline-none focus:border-cosmos-accent focus:ring-2 focus:ring-cosmos-accent/20 transition-all"
                    />
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="px-5 py-2.5 font-medium bg-cosmos-accent text-cosmos-bg rounded-xl hover:bg-cosmos-accent-hover transition-colors"
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setName(MOCK_USER.name);
                        setEmail(MOCK_USER.email);
                      }}
                      className="px-5 py-2.5 font-medium text-cosmos-muted border border-cosmos-border rounded-xl hover:bg-cosmos-surface-elevated transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>

        <section className="mb-8 p-6 bg-cosmos-surface border border-cosmos-border rounded-2xl hover:border-cosmos-border-strong transition-colors">
          <h3 className="font-display font-semibold text-cosmos-text text-lg m-0 mb-4 flex items-center gap-2">
            <ShoppingCart size={20} className="text-cosmos-accent" />
            Mis compras
          </h3>
          <MisCompras />
        </section>

        <section className="mb-8 p-6 bg-cosmos-surface border border-cosmos-border rounded-2xl hover:border-cosmos-border-strong transition-colors">
          <h3 className="font-display font-semibold text-cosmos-text text-lg m-0 mb-4 flex items-center gap-2">
            <LayoutDashboard size={20} className="text-cosmos-accent" />
            Accesos rápidos
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Link
              to="/retailer"
              className="flex items-center gap-3 p-4 rounded-xl border border-cosmos-border hover:border-cosmos-accent hover:bg-cosmos-surface-elevated transition-all group"
            >
              <Store size={22} className="text-cosmos-accent group-hover:scale-110 transition-transform" />
              <span className="font-medium text-cosmos-text">Mi tienda (Retailer)</span>
            </Link>
            <Link
              to="/proveedores"
              className="flex items-center gap-3 p-4 rounded-xl border border-cosmos-border hover:border-cosmos-accent hover:bg-cosmos-surface-elevated transition-all group"
            >
              <Package size={22} className="text-cosmos-accent group-hover:scale-110 transition-transform" />
              <span className="font-medium text-cosmos-text">Proveedores</span>
            </Link>
            <Link
              to="/cosmos-pay"
              className="flex items-center gap-3 p-4 rounded-xl border border-cosmos-border hover:border-cosmos-accent hover:bg-cosmos-surface-elevated transition-all group"
            >
              <Wallet size={22} className="text-cosmos-accent group-hover:scale-110 transition-transform" />
              <span className="font-medium text-cosmos-text">Cosmos Pay</span>
            </Link>
            <Link
              to="/perfil/wallet"
              className="flex items-center gap-3 p-4 rounded-xl border border-cosmos-border hover:border-cosmos-accent hover:bg-cosmos-surface-elevated transition-all group"
            >
              <TrendingUp size={22} className="text-cosmos-accent group-hover:scale-110 transition-transform" />
              <span className="font-medium text-cosmos-text">Mi wallet</span>
            </Link>
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

        <section className="mb-8 p-6 bg-cosmos-surface border border-cosmos-border rounded-2xl hover:border-cosmos-border-strong transition-colors">
          <h3 className="font-display font-semibold text-cosmos-text text-lg m-0 mb-4 flex items-center gap-2">
            <ShoppingBag size={20} className="text-cosmos-accent" />
            Cuenta
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {(MOCK_USER.role === "buyer" || MOCK_USER.role === "both") && (
              <span className="px-4 py-2 text-sm font-medium bg-cosmos-accent-soft text-cosmos-accent rounded-xl border border-cosmos-accent/20">
                Comprador
              </span>
            )}
            {(MOCK_USER.role === "seller" || MOCK_USER.role === "both") && (
              <span className="px-4 py-2 text-sm font-medium bg-cosmos-accent-soft text-cosmos-accent rounded-xl border border-cosmos-accent/20">
                Vendedor
              </span>
            )}
          </div>
          {(MOCK_USER.role === "seller" || MOCK_USER.role === "both") && (
            <Link
              to="/retailer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-cosmos-text border border-cosmos-border rounded-xl hover:border-cosmos-accent hover:text-cosmos-accent hover:bg-cosmos-surface-elevated transition-all"
            >
              <Store size={18} />
              Ir a mi tienda
            </Link>
          )}
        </section>

        <section className="mb-8 p-6 bg-cosmos-surface border border-cosmos-border rounded-2xl hover:border-cosmos-border-strong transition-colors">
          <h3 className="font-display font-semibold text-cosmos-text text-lg m-0 mb-4 flex items-center gap-2">
            <Shield size={20} className="text-cosmos-accent" />
            Seguridad
          </h3>
          <Link
            to="/restablecer-contraseña"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-cosmos-text border border-cosmos-border rounded-xl hover:border-cosmos-accent hover:text-cosmos-accent hover:bg-cosmos-surface-elevated transition-all"
          >
            <Key size={18} />
            Cambiar contraseña
          </Link>
        </section>

        <div className="pt-4 border-t border-cosmos-border">
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-cosmos-muted hover:text-red-400 transition-colors rounded-xl hover:bg-red-500/10"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
