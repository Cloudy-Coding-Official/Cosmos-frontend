import { useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../context/AuthContext";
import { Lock, ShoppingBag, Store, Package, Check, X } from "lucide-react";
import * as authApi from "../api/auth";
import { getErrorMessage } from "../api/client";
import { SectionPreview } from "./SectionPreview";

type ProtectedRouteProps = {
  allowedRoles?: UserRole[];
  /** Si es true, en la ruta principal (índice) se muestra una preview no interactiva y la opción de expandir cuenta en lugar de bloquear. */
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

const COUNTRY_OPTIONS = [
  { value: "", label: "Seleccionar país" },
  { value: "AR", label: "Argentina" },
  { value: "MX", label: "México" },
  { value: "CO", label: "Colombia" },
  { value: "CL", label: "Chile" },
  { value: "PE", label: "Perú" },
  { value: "EC", label: "Ecuador" },
  { value: "UY", label: "Uruguay" },
  { value: "PY", label: "Paraguay" },
  { value: "BO", label: "Bolivia" },
  { value: "US", label: "Estados Unidos" },
  { value: "ES", label: "España" },
  { value: "BR", label: "Brasil" },
  { value: "XX", label: "Otro" },
];

const inputBase =
  "w-full px-4 py-2.5 rounded-xl border border-cosmos-border bg-cosmos-bg text-cosmos-text placeholder:text-cosmos-muted focus:outline-none focus:ring-2 focus:ring-cosmos-accent/50";

type ExpandModalProps = {
  requiredRole: "retailer" | "proveedor";
  expandStep: "confirm" | "form";
  setExpandStep: (s: "confirm" | "form") => void;
  expandForm: { country: string; brandName: string; legalName: string; taxId: string };
  setExpandForm: React.Dispatch<React.SetStateAction<{ country: string; brandName: string; legalName: string; taxId: string }>>;
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
  expandStep,
  setExpandStep,
  expandForm,
  setExpandForm,
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
          <h2 className="font-display font-semibold text-cosmos-text text-lg m-0">
            {expandStep === "confirm" ? "Expandir tu cuenta" : "Completá los datos"}
          </h2>
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

        {expandStep === "confirm" && (
          <>
            <p className="text-sm text-cosmos-muted mb-4">
              Para acceder a esta sección se agregará este tipo de cuenta a tu perfil. Completá los datos en el siguiente paso.
            </p>
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
                className="flex-1 px-4 py-2.5 font-medium text-cosmos-muted border border-cosmos-border rounded-xl hover:bg-cosmos-surface-elevated transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => setExpandStep("form")}
                className="flex-1 px-4 py-2.5 font-medium bg-cosmos-accent text-cosmos-bg rounded-xl hover:bg-cosmos-accent-hover transition-colors"
              >
                Proceder
              </button>
            </div>
          </>
        )}

        {expandStep === "form" && (
          <>
            <p className="text-sm text-cosmos-muted mb-4">
              {requiredRole === "retailer"
                ? "Nombre de tu tienda y país para el perfil de retailer."
                : "Nombre de la empresa, CUIT/RFC y país para el perfil de proveedor."}
            </p>
            {expandError && (
              <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">
                {expandError}
              </div>
            )}
            {expanding ? (
              <div className="flex items-center justify-center gap-2 py-6 text-cosmos-muted">
                <span className="inline-block w-5 h-5 border-2 border-cosmos-accent border-t-transparent rounded-full animate-spin" />
                <span>Agregando rol a tu cuenta…</span>
              </div>
            ) : (
              <form
                className="flex flex-col gap-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (requiredRole !== "retailer" && requiredRole !== "proveedor") return;
                  const { country, brandName, legalName, taxId } = expandForm;
                  if (requiredRole === "retailer" && !brandName.trim()) {
                    setExpandError("El nombre de la tienda es obligatorio");
                    return;
                  }
                  if (requiredRole === "proveedor") {
                    if (!legalName.trim()) {
                      setExpandError("El nombre de la empresa es obligatorio");
                      return;
                    }
                    if (!taxId.trim()) {
                      setExpandError("El CUIT / RFC / Tax ID es obligatorio");
                      return;
                    }
                  }
                  if (!country || country.length !== 2) {
                    setExpandError("Seleccioná un país");
                    return;
                  }
                  setExpandError(null);
                  setExpanding(true);
                  try {
                    const payload: authApi.ExpandAccountPayload = {
                      role: requiredRole,
                      country,
                      ...(requiredRole === "retailer" ? { brandName: brandName.trim() } : { legalName: legalName.trim(), taxId: taxId.trim() }),
                    };
                    const updated = await authApi.expandAccount(payload);
                    setUser(updated);
                    await refreshUser();
                    onSuccess();
                  } catch (err) {
                    setExpandError(getErrorMessage(err, "No se pudo agregar el rol"));
                  } finally {
                    setExpanding(false);
                  }
                }}
              >
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium uppercase tracking-wider text-cosmos-muted">País</span>
                  <select
                    className={inputBase}
                    value={expandForm.country}
                    onChange={(e) => setExpandForm((f) => ({ ...f, country: e.target.value }))}
                    required
                  >
                    {COUNTRY_OPTIONS.map((o) => (
                      <option key={o.value || "empty"} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
                {requiredRole === "retailer" && (
                  <label className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium uppercase tracking-wider text-cosmos-muted">
                      Nombre de la tienda
                    </span>
                    <input
                      type="text"
                      className={inputBase}
                      value={expandForm.brandName}
                      onChange={(e) => setExpandForm((f) => ({ ...f, brandName: e.target.value }))}
                      placeholder="Ej: Mi Tienda"
                      required
                    />
                  </label>
                )}
                {requiredRole === "proveedor" && (
                  <>
                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-medium uppercase tracking-wider text-cosmos-muted">
                        Nombre de la empresa
                      </span>
                      <input
                        type="text"
                        className={inputBase}
                        value={expandForm.legalName}
                        onChange={(e) => setExpandForm((f) => ({ ...f, legalName: e.target.value }))}
                        placeholder="Ej: Distribuidora XYZ"
                        required
                      />
                    </label>
                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-medium uppercase tracking-wider text-cosmos-muted">
                        CUIT / RFC / Tax ID
                      </span>
                      <input
                        type="text"
                        className={inputBase}
                        value={expandForm.taxId}
                        onChange={(e) => setExpandForm((f) => ({ ...f, taxId: e.target.value }))}
                        placeholder="Ej: 20-12345678-9"
                        required
                      />
                    </label>
                  </>
                )}
                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setExpandStep("confirm")}
                    className="flex-1 px-4 py-2.5 font-medium text-cosmos-muted border border-cosmos-border rounded-xl hover:bg-cosmos-surface-elevated transition-colors"
                  >
                    Atrás
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 font-medium bg-cosmos-accent text-cosmos-bg rounded-xl hover:bg-cosmos-accent-hover transition-colors"
                  >
                    Agregar rol
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export function ProtectedRoute({ allowedRoles, allowPreview }: ProtectedRouteProps) {
  const { isLoggedIn, userRole, loading, setUser, refreshUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [expandModalOpen, setExpandModalOpen] = useState(false);
  const [expandStep, setExpandStep] = useState<"confirm" | "form">("confirm");
  const [expandForm, setExpandForm] = useState({ country: "", brandName: "", legalName: "", taxId: "" });
  const [expanding, setExpanding] = useState(false);
  const [expandError, setExpandError] = useState<string | null>(null);

  const openExpandModal = () => {
    setExpandModalOpen(true);
    setExpandStep("confirm");
    setExpandForm({ country: "", brandName: "", legalName: "", taxId: "" });
    setExpandError(null);
  };
  const closeExpandModal = () => {
    if (expanding) return;
    setExpandModalOpen(false);
    setExpandStep("confirm");
    setExpandError(null);
  };

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <p className="text-cosmos-muted">Cargando…</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const requiredRole = allowedRoles != null && allowedRoles.length > 0 ? allowedRoles[0] : null;
  const accessDenied =
    allowedRoles != null && allowedRoles.length > 0 && userRole != null && !allowedRoles.includes(userRole);
  const basePath = requiredRole ? ROLE_TO_BASE_PATH[requiredRole] : null;
  const isIndexRoute = basePath != null && (location.pathname === basePath || location.pathname === basePath + "/");
  const showPreview = allowPreview && accessDenied && requiredRole && isIndexRoute;
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
            expandStep={expandStep}
            setExpandStep={setExpandStep}
            expandForm={expandForm}
            setExpandForm={setExpandForm}
            expanding={expanding}
            expandError={expandError}
            setExpandError={setExpandError}
            closeExpandModal={closeExpandModal}
            onSuccess={() => {
              setExpandModalOpen(false);
              navigate(location.pathname, { replace: true });
            }}
            setExpanding={setExpanding}
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
                className="inline-flex items-center justify-center gap-2 px-6 py-3 font-medium bg-cosmos-accent text-cosmos-bg rounded-xl hover:bg-cosmos-accent-hover transition-colors"
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
            expandStep={expandStep}
            setExpandStep={setExpandStep}
            expandForm={expandForm}
            setExpandForm={setExpandForm}
            expanding={expanding}
            expandError={expandError}
            setExpandError={setExpandError}
            closeExpandModal={closeExpandModal}
            onSuccess={() => {
              setExpandModalOpen(false);
              navigate(location.pathname, { replace: true });
            }}
            setExpanding={setExpanding}
            setUser={setUser}
            refreshUser={refreshUser}
          />
        )}
      </>
    );
  }

  return <Outlet />;
}
