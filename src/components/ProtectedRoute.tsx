import { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../context/AuthContext";
import { Lock, ShoppingBag, Store, Package, Check, X } from "lucide-react";
import * as authApi from "../api/auth";
import { getErrorMessage } from "../api/client";
import { SectionPreview } from "./SectionPreview";

type ProtectedRouteProps = {
  allowedRoles?: UserRole[];
  allowPreview?: boolean;
};

const ROLE_TO_BASE_PATH: Record<string, string> = {
  retailer: "/retailer",
  proveedor: "/proveedores",
};

const ROLE_CARD: Record<
  UserRole,
  { title: string; description: string; Icon: React.ComponentType<{ size?: number; className?: string }> }
> = {
  comprador: {
    title: "Comprador",
    description: "Comprar productos en tiendas de la red",
    Icon: ShoppingBag,
  },
  retailer: {
    title: "Retailer / Vendedor",
    description: "Vender sin stock, conectando con proveedores",
    Icon: Store,
  },
  proveedor: {
    title: "Proveedor",
    description: "Tenés productos, vendés a retailers",
    Icon: Package,
  },
};

type ExpandModalProps = {
  requiredRole: "retailer" | "proveedor";
  userCountry: string;
  expanding: boolean;
  setExpanding: (v: boolean) => void;
  expandError: string | null;
  setExpandError: (v: string | null) => void;
  closeExpandModal: () => void;
  onSuccess: () => void;
  setUser: (u: import("../api/auth").AuthUser | null) => void;
  refreshUser: () => Promise<void>;
};

function ExpandModal({
  requiredRole,
  userCountry,
  expanding,
  setExpanding,
  expandError,
  setExpandError,
  closeExpandModal,
  onSuccess,
  setUser,
  refreshUser,
}: ExpandModalProps) {
  const roleInfo = ROLE_CARD[requiredRole];
  const RoleIcon = roleInfo.Icon;
  const country = userCountry && userCountry.length === 2 ? userCountry : "XX";

  const handleAddRole = async () => {
    setExpandError(null);
    setExpanding(true);
    try {
      const updated = await authApi.expandAccount({ role: requiredRole, country });
      setUser(updated);
      await refreshUser();
      onSuccess();
    } catch (err) {
      setExpandError(getErrorMessage(err, "No se pudo agregar el rol"));
    } finally {
      setExpanding(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={closeExpandModal}
    >
      <div
        className="bg-cosmos-surface border border-cosmos-border rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-cosmos-text text-lg m-0">Expandir tu cuenta</h2>
          {!expanding && (
            <button
              type="button"
              onClick={closeExpandModal}
              className="p-2 rounded-lg text-cosmos-muted hover:bg-cosmos-surface-elevated hover:text-cosmos-text transition-colors"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <p className="text-sm text-cosmos-muted mb-4">
          Se agregará este tipo de cuenta a tu perfil. Al entrar al panel te pediremos{" "}
          {requiredRole === "retailer" ? "crear tu primera tienda" : "completar los datos de tu empresa"} para comenzar.
        </p>
        {expandError && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">
            {expandError}
          </div>
        )}
        <div className="flex items-center gap-4 p-4 rounded-xl border border-cosmos-accent bg-cosmos-accent-soft mb-6">
          <div className="w-12 h-12 rounded-xl bg-cosmos-accent/20 flex items-center justify-center shrink-0">
            <RoleIcon size={24} className="text-cosmos-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-cosmos-text m-0">{roleInfo.title}</p>
            <p className="text-sm text-cosmos-muted m-0">{roleInfo.description}</p>
          </div>
          <Check size={20} className="text-cosmos-accent shrink-0" />
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={closeExpandModal}
            disabled={expanding}
            className="flex-1 px-4 py-2.5 font-medium text-cosmos-muted border border-cosmos-border rounded-xl hover:bg-cosmos-surface-elevated transition-colors disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleAddRole}
            disabled={expanding}
            className="flex-1 px-4 py-2.5 font-medium bg-cosmos-accent text-cosmos-bg rounded-xl hover:bg-cosmos-accent-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {expanding ? "Agregando…" : "Agregar rol"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProtectedRoute({ allowedRoles, allowPreview }: ProtectedRouteProps) {
  const { isLoggedIn, userRole, user, loading, setUser, refreshUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [expandModalOpen, setExpandModalOpen] = useState(false);
  const [expanding, setExpanding] = useState(false);
  const [expandError, setExpandError] = useState<string | null>(null);
  const [checkingStaleAccess, setCheckingStaleAccess] = useState(false);
  const [hasRefreshedForRoleRoute, setHasRefreshedForRoleRoute] = useState(false);

  const requiredRole = allowedRoles != null && allowedRoles.length > 0 ? allowedRoles[0] : null;
  const basePath = requiredRole ? ROLE_TO_BASE_PATH[requiredRole] : null;
  const isIndexRoute = basePath != null && (location.pathname === basePath || location.pathname === basePath + "/");
  const isRetailerOrProveedorIndex =
    isIndexRoute && requiredRole && (requiredRole === "retailer" || requiredRole === "proveedor");
  const hasAccessToRequiredRole =
    !requiredRole ||
    (requiredRole === "retailer" && !!user?.hasStoreProfile) ||
    (requiredRole === "proveedor" && (!!user?.hasProviderProfile || !!user?.pendingProvider)) ||
    ((requiredRole !== "retailer" && requiredRole !== "proveedor") && userRole != null && !!allowedRoles?.includes(userRole));
  const accessDenied =
    allowedRoles != null && allowedRoles.length > 0 && !hasAccessToRequiredRole;
  const wouldShowExpandPreview =
    allowPreview && accessDenied && requiredRole && isIndexRoute && (requiredRole === "retailer" || requiredRole === "proveedor");

  useEffect(() => {
    if (!isRetailerOrProveedorIndex) {
      queueMicrotask(() => setHasRefreshedForRoleRoute(false));
      return;
    }
    if (!user) return;
    if (hasRefreshedForRoleRoute) return;
    queueMicrotask(() => {
      setHasRefreshedForRoleRoute(true);
      setCheckingStaleAccess(true);
    });
    refreshUser().finally(() => setCheckingStaleAccess(false));
  }, [isRetailerOrProveedorIndex, user, refreshUser, location.pathname, hasRefreshedForRoleRoute]);

  const openExpandModal = () => {
    setExpandModalOpen(true);
    setExpandError(null);
  };
  const closeExpandModal = () => {
    if (expanding) return;
    setExpandModalOpen(false);
    setExpandError(null);
  };

  const mustWaitForRefresh =
    isRetailerOrProveedorIndex && !!user && !hasRefreshedForRoleRoute;
  if (loading || checkingStaleAccess || mustWaitForRefresh) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <p className="text-cosmos-muted">Cargando…</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const showPreview = wouldShowExpandPreview;
  const redirectToPreview = allowPreview && accessDenied && requiredRole && basePath && !isIndexRoute && location.pathname.startsWith(basePath);

  if (redirectToPreview && basePath) {
    return <Navigate to={basePath} replace />;
  }

  if (showPreview && requiredRole && (requiredRole === "retailer" || requiredRole === "proveedor")) {
    return (
      <>
        <SectionPreview
          section={requiredRole}
          onExpandAccount={openExpandModal}
        />
        {expandModalOpen && (
          <ExpandModal
            requiredRole={requiredRole}
            userCountry={user?.country ?? ""}
            expanding={expanding}
            setExpanding={setExpanding}
            expandError={expandError}
            setExpandError={setExpandError}
            closeExpandModal={closeExpandModal}
            onSuccess={() => {
              setExpandModalOpen(false);
              navigate(location.pathname, { replace: true });
            }}
            setUser={setUser}
            refreshUser={refreshUser}
          />
        )}
      </>
    );
  }

  if (accessDenied && requiredRole) {
    return (
      <>
        <div className="min-h-[calc(100vh-72px-200px)] bg-cosmos-bg py-12 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center mx-auto mb-6">
              <Lock size={32} className="text-amber-400" />
            </div>
            <h1 className="font-display font-semibold text-cosmos-text text-xl m-0 mb-2">Sin acceso</h1>
            <p className="text-cosmos-muted text-sm m-0 mb-6">
              No tenés permiso para ver esta sección. Requiere un tipo de cuenta distinto.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={openExpandModal}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 font-medium bg-cosmos-accent text-cosmos-bg rounded-xl hover:bg-cosmos-accent-hover transition-colors disabled:cursor-not-allowed"
              >
                Expandir cuenta
              </button>
              <Link
                to="/perfil"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 font-medium text-cosmos-text border border-cosmos-border rounded-xl hover:bg-cosmos-surface-elevated transition-colors"
              >
                Ir a mi perfil
              </Link>
            </div>
          </div>
        </div>

        {expandModalOpen && (requiredRole === "retailer" || requiredRole === "proveedor") && (
          <ExpandModal
            requiredRole={requiredRole}
            userCountry={user?.country ?? ""}
            expanding={expanding}
            setExpanding={setExpanding}
            expandError={expandError}
            setExpandError={setExpandError}
            closeExpandModal={closeExpandModal}
            onSuccess={() => {
              setExpandModalOpen(false);
              navigate(location.pathname, { replace: true });
            }}
            setUser={setUser}
            refreshUser={refreshUser}
          />
        )}
      </>
    );
  }

  return <Outlet />;
}
