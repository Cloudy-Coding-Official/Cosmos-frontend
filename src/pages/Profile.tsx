import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Shield, Store, LogOut, Key, ShoppingBag, Sparkles, LayoutDashboard, Package, TrendingUp, Wallet, ShoppingCart, X, HelpCircle } from "lucide-react";
import { WalletSummary } from "../components/WalletSummary";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import * as authApi from "../api/auth";
import { getErrorMessage } from "../api/client";
import { getOrdersByBuyer, orderStatusLabel, type OrderBackend, type OrderStatusBackend } from "../api/orders";
import { getNavigationItems } from "../data/navigationItems";
import type { NavigationItem } from "../types/types";

const QUICK_ACCESS_EXTRA: NavigationItem[] = [
  { title: "Mi wallet", href: "/perfil/wallet" },
  { title: "Cosmos Pay", href: "/cosmos-pay" },
];

const QUICK_ACCESS_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  "/tienda": ShoppingBag,
  "/vender": Store,
  "/retailer": Store,
  "/proveedores": Package,
  "/como-funciona": HelpCircle,
  "/perfil/wallet": TrendingUp,
  "/cosmos-pay": Wallet,
};

function orderStatusClass(status: OrderStatusBackend): string {
  switch (status) {
    case "DELIVERED":
    case "RELEASED":
      return "bg-emerald-500/20 text-emerald-400";
    case "SHIPPED":
      return "bg-amber-500/20 text-amber-400";
    case "CANCELLED":
    case "DISPUTED":
      return "bg-red-500/20 text-red-400";
    default:
      return "bg-cosmos-accent-soft text-cosmos-accent";
  }
}

function MisCompras({ buyerProfileId }: { buyerProfileId: string | null }) {
  const [orders, setOrders] = useState<OrderBackend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!buyerProfileId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOrders([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    getOrdersByBuyer(buyerProfileId)
      .then(setOrders)
      .catch((err) => setError(getErrorMessage(err, "Error al cargar compras")))
      .finally(() => setLoading(false));
  }, [buyerProfileId]);

  if (!buyerProfileId) {
    return (
      <p className="text-cosmos-muted text-sm m-0 mb-4">
        No tenés perfil de comprador. <Link to="/tienda" className="text-cosmos-accent hover:underline">Explorar tienda</Link>
      </p>
    );
  }

  if (loading) {
    return (
      <div className="space-y-3 mb-4" aria-busy="true" aria-label="Cargando compras">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-cosmos-border">
            <div className="skeleton-shimmer rounded h-4 w-24 bg-cosmos-surface-elevated shrink-0" aria-hidden />
            <div className="flex-1 space-y-2">
              <div className="skeleton-shimmer rounded h-4 w-32 bg-cosmos-surface-elevated" aria-hidden />
              <div className="skeleton-shimmer rounded h-3 w-20 bg-cosmos-surface-elevated" aria-hidden />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">
        {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <p className="text-cosmos-muted text-sm m-0 mb-4">
        Aún no tenés compras. <Link to="/tienda" className="text-cosmos-accent hover:underline">Explorar tienda</Link>
      </p>
    );
  }

  const firstProductName = (o: OrderBackend) =>
    o.orderItems?.[0]?.product?.name ? ` · ${o.orderItems[0].product.name}` : "";

  return (
    <div className="space-y-3">
      {orders.map((o) => {
        const monto = parseFloat(o.totalAmount);
        return (
          <Link
            key={o.id}
            to={"/perfil/compras/" + o.id}
            className="block p-4 rounded-xl border border-cosmos-border hover:border-cosmos-accent/40 hover:bg-cosmos-surface-elevated transition-all"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-medium text-cosmos-text">{o.id}</span>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-lg ${orderStatusClass(o.status)}`}
              >
                {orderStatusLabel(o.status)}
              </span>
            </div>
            <p className="text-sm text-cosmos-muted m-0 mt-1">
              {new Date(o.createdAt).toLocaleDateString("es-AR", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}{" "}
              · {o.currency} {Number.isNaN(monto) ? "—" : monto.toFixed(2)}
              {firstProductName(o)}
            </p>
            <p className="text-xs text-cosmos-accent mt-2 m-0">Ver seguimiento →</p>
          </Link>
        );
      })}
    </div>
  );
}

function displayNameFromEmail(email: string | null): string {
  if (!email) return "Usuario";
  const part = email.split("@")[0];
  return part ? part.charAt(0).toUpperCase() + part.slice(1) : "Usuario";
}

function fullDisplayName(
  firstName: string | null | undefined,
  lastName: string | null | undefined,
  email: string | null
): string {
  const full = [firstName, lastName].filter(Boolean).join(" ").trim();
  return full || displayNameFromEmail(email);
}

export function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);
  const { user, logout, setUser, refreshUser } = useAuth();
  const navigate = useNavigate();

  const email = user?.email ?? "";
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("es-AR", { month: "long", year: "numeric" })
    : "";

  const displayName = fullDisplayName(user?.firstName, user?.lastName, user?.email ?? null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError("");
    setSaving(true);
    try {
      const updated = await authApi.updateProfile({
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
      });
      setUser(updated);
      await refreshUser();
      setIsEditing(false);
    } catch (err) {
      setSaveError(getErrorMessage(err, "No se pudo guardar el perfil"));
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const openPasswordModal = () => {
    setPasswordModalOpen(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError(null);
    setPasswordSuccess(false);
  };

  const closePasswordModal = () => {
    setPasswordModalOpen(false);
    setPasswordError(null);
    setPasswordSuccess(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    if (newPassword.length < 8) {
      setPasswordError("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("La nueva contraseña y la confirmación no coinciden.");
      return;
    }
    setPasswordLoading(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => closePasswordModal(), 1500);
    } catch (err) {
      setPasswordError(getErrorMessage(err, "No se pudo cambiar la contraseña"));
    } finally {
      setPasswordLoading(false);
    }
  };

  const hasEmailPassword = user?.providers?.includes("email") ?? false;

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
                    {displayName}
                  </h2>
                  <p className="text-cosmos-muted text-sm m-0 mb-4 flex items-center gap-2">
                    <Mail size={16} className="shrink-0" />
                    {email || "—"}
                  </p>
                  {memberSince && (
                    <p className="text-xs text-cosmos-muted m-0">Miembro desde {memberSince}</p>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setFirstName(user?.firstName ?? "");
                      setLastName(user?.lastName ?? "");
                      setSaveError("");
                      setIsEditing(true);
                    }}
                    className="mt-4 px-5 py-2.5 text-sm font-medium text-cosmos-accent hover:text-cosmos-accent-hover border border-cosmos-accent/50 rounded-xl hover:bg-cosmos-accent-soft transition-colors"
                  >
                    Editar perfil
                  </button>
                </>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  {saveError && (
                    <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">
                      {saveError}
                    </div>
                  )}
                  <label className="block">
                    <span className="text-xs font-medium uppercase tracking-wider text-cosmos-muted block mb-1.5">
                      Nombre
                    </span>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 border border-cosmos-border bg-cosmos-surface-elevated text-cosmos-text rounded-xl focus:outline-none focus:border-cosmos-accent focus:ring-2 focus:ring-cosmos-accent/20 transition-all"
                      placeholder="Ej: Juan"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-medium uppercase tracking-wider text-cosmos-muted block mb-1.5">
                      Apellido
                    </span>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-3 border border-cosmos-border bg-cosmos-surface-elevated text-cosmos-text rounded-xl focus:outline-none focus:border-cosmos-accent focus:ring-2 focus:ring-cosmos-accent/20 transition-all"
                      placeholder="Ej: García"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-medium uppercase tracking-wider text-cosmos-muted block mb-1.5">
                      Correo
                    </span>
                    <input
                      type="email"
                      value={email}
                      readOnly
                      className="w-full px-4 py-3 border border-cosmos-border bg-cosmos-surface-elevated text-cosmos-text rounded-xl opacity-80 cursor-not-allowed"
                    />
                    <p className="text-xs text-cosmos-muted mt-1">El correo es el de tu sesión y no se puede editar aquí.</p>
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-5 py-2.5 font-medium bg-cosmos-accent text-cosmos-bg rounded-xl hover:bg-cosmos-accent-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {saving ? "Guardando…" : "Guardar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setFirstName(user?.firstName ?? "");
                        setLastName(user?.lastName ?? "");
                        setSaveError("");
                      }}
                      disabled={saving}
                      className="px-5 py-2.5 font-medium text-cosmos-muted border border-cosmos-border rounded-xl hover:bg-cosmos-surface-elevated transition-colors disabled:opacity-60"
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
          <MisCompras buyerProfileId={user?.buyerProfileId ?? null} />
        </section>

        <section className="mb-8 p-6 bg-cosmos-surface border border-cosmos-border rounded-2xl hover:border-cosmos-border-strong transition-colors">
          <h3 className="font-display font-semibold text-cosmos-text text-lg m-0 mb-4 flex items-center gap-2">
            <LayoutDashboard size={20} className="text-cosmos-accent" />
            Accesos rápidos
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[...getNavigationItems(user ?? null), ...QUICK_ACCESS_EXTRA].map((item) => {
              const Icon = QUICK_ACCESS_ICONS[item.href] ?? LayoutDashboard;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className="flex items-center gap-3 p-4 rounded-xl border border-cosmos-border hover:border-cosmos-accent hover:bg-cosmos-surface-elevated transition-all group"
                >
                  <Icon size={22} className="text-cosmos-accent group-hover:scale-110 transition-transform shrink-0" />
                  <span className="font-medium text-cosmos-text">{item.title}</span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mb-8">
          <WalletSummary
            viewDetails={true}
            estimatedUsdt={0}
            walletsCount={user?.walletAddresses?.length ?? 0}
            loadingBalances={false}
            loadingWallets={false}
          />
          {user?.walletAddresses?.length ? (
            <p className="text-sm text-cosmos-muted mt-3">
              Wallet vinculada: <span className="font-mono text-cosmos-text">{user.walletAddresses[0]}</span>
            </p>
          ) : (
            <p className="text-sm text-cosmos-muted mt-3">
              No tenés wallet vinculada.{" "}
              <Link to="/perfil/wallet" className="text-cosmos-accent hover:underline">
                Sincronizá tu wallet Stellar
              </Link>
            </p>
          )}
        </section>

        <section className="mb-8 p-6 bg-cosmos-surface border border-cosmos-border rounded-2xl hover:border-cosmos-border-strong transition-colors">
          <h3 className="font-display font-semibold text-cosmos-text text-lg m-0 mb-4 flex items-center gap-2">
            <ShoppingBag size={20} className="text-cosmos-accent" />
            Cuenta
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {user?.hasBuyerProfile && (
              <span className="px-4 py-2 text-sm font-medium bg-cosmos-accent-soft text-cosmos-accent rounded-xl border border-cosmos-accent/20">
                Comprador
              </span>
            )}
            {user?.hasStoreProfile && (
              <span className="px-4 py-2 text-sm font-medium bg-cosmos-accent-soft text-cosmos-accent rounded-xl border border-cosmos-accent/20">
                Retailer / Tienda
              </span>
            )}
            {user?.hasProviderProfile && (
              <span className="px-4 py-2 text-sm font-medium bg-cosmos-accent-soft text-cosmos-accent rounded-xl border border-cosmos-accent/20">
                Proveedor
              </span>
            )}
          </div>
          {(user?.hasStoreProfile || user?.hasProviderProfile) && (
            <Link
              to="/retailer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-cosmos-text border border-cosmos-border rounded-xl hover:border-cosmos-accent hover:text-cosmos-accent hover:bg-cosmos-surface-elevated transition-colors"
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
          {hasEmailPassword ? (
            <button
              type="button"
              onClick={openPasswordModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-cosmos-text border border-cosmos-border rounded-xl hover:border-cosmos-accent hover:text-cosmos-accent hover:bg-cosmos-surface-elevated transition-colors"
            >
              <Key size={18} />
              Cambiar contraseña
            </button>
          ) : (
            <p className="text-sm text-cosmos-muted m-0">
              Iniciaste sesión con Google o wallet. Para usar contraseña, creá una cuenta con correo y contraseña.
            </p>
          )}
        </section>

        <div className="pt-4 border-t border-cosmos-border">
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-cosmos-muted hover:text-red-400 rounded-xl hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Modal cambiar contraseña */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={closePasswordModal}>
          <div
            className="bg-cosmos-surface border border-cosmos-border rounded-2xl shadow-xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-semibold text-cosmos-text text-lg m-0">Cambiar contraseña</h3>
              <button
                type="button"
                onClick={closePasswordModal}
                className="p-2 rounded-lg text-cosmos-muted hover:bg-cosmos-surface-elevated hover:text-cosmos-text transition-colors"
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleChangePassword} className="space-y-4">
              {passwordError && (
                <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/30 text-sm text-green-400">
                  Contraseña actualizada. Cerrando…
                </div>
              )}
              <label className="block">
                <span className="text-xs font-medium uppercase tracking-wider text-cosmos-muted block mb-1.5">Contraseña actual</span>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 border border-cosmos-border bg-cosmos-surface-elevated text-cosmos-text rounded-xl focus:outline-none focus:border-cosmos-accent focus:ring-2 focus:ring-cosmos-accent/20 transition-all"
                  placeholder="Tu contraseña actual"
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium uppercase tracking-wider text-cosmos-muted block mb-1.5">Nueva contraseña</span>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full px-4 py-3 border border-cosmos-border bg-cosmos-surface-elevated text-cosmos-text rounded-xl focus:outline-none focus:border-cosmos-accent focus:ring-2 focus:ring-cosmos-accent/20 transition-all"
                  placeholder="Mínimo 8 caracteres"
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium uppercase tracking-wider text-cosmos-muted block mb-1.5">Confirmar nueva contraseña</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full px-4 py-3 border border-cosmos-border bg-cosmos-surface-elevated text-cosmos-text rounded-xl focus:outline-none focus:border-cosmos-accent focus:ring-2 focus:ring-cosmos-accent/20 transition-all"
                  placeholder="Repetí la nueva contraseña"
                />
              </label>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closePasswordModal}
                  disabled={passwordLoading}
                  className="px-5 py-2.5 font-medium text-cosmos-muted border border-cosmos-border rounded-xl hover:bg-cosmos-surface-elevated transition-colors disabled:opacity-60"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="px-5 py-2.5 font-medium bg-cosmos-accent text-cosmos-bg rounded-xl hover:bg-cosmos-accent-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {passwordLoading ? "Guardando…" : "Cambiar contraseña"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
