import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { ShoppingBag, Store, Package, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { AuthLayout } from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";

export type OnboardRole = "comprador" | "retailer" | "proveedor";

const STEPS = [
  { id: 1, title: "Tipo de cuenta" },
  { id: 2, title: "Datos personales" },
  { id: 3, title: "Tu negocio" },
  { id: 4, title: "Listo" },
];

export function Onboard() {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get("role") as OnboardRole | null;
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<OnboardRole | null>(
    roleParam && ["comprador", "retailer", "proveedor"].includes(roleParam) ? roleParam : null
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [country, setCountry] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const needsBusinessStep = role === "retailer" || role === "proveedor";
  const totalSteps = needsBusinessStep ? 4 : 3;

  const handleNext = () => {
    if (step < totalSteps) setStep((s) => s + 1);
    else handleFinish();
  };

  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  const handleFinish = () => {
    login(role || "comprador");
    if (role === "retailer") navigate("/retailer");
    else if (role === "proveedor") navigate("/proveedores");
    else navigate("/perfil");
  };

  const canProceed = () => {
    if (step === 1) return role !== null;
    if (step === 2) return name.trim() && email.trim() && password.length >= 8;
    if (step === 3 && needsBusinessStep) return businessName.trim();
    return true;
  };

  const inputBase =
    "w-full px-4 py-3 font-sans text-base border border-cosmos-border bg-cosmos-surface-elevated text-cosmos-text placeholder:text-cosmos-muted focus:outline-none focus:border-cosmos-accent focus:ring-1 focus:ring-cosmos-accent rounded-lg transition-colors";

  return (
    <AuthLayout wide>
      <div className="w-full max-w-[480px] mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-[1.5rem] text-cosmos-text m-0 mb-1">Crear cuenta en Cosmos</h1>
          <p className="text-[0.9375rem] text-cosmos-muted m-0">Paso {step} de {totalSteps}</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.slice(0, totalSteps).map((s, i) => (
            <div key={s.id} className="flex items-center gap-1 flex-1">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                  step > s.id
                    ? "bg-cosmos-accent text-cosmos-bg"
                    : step === s.id
                    ? "bg-cosmos-accent text-cosmos-bg"
                    : "bg-cosmos-surface-elevated text-cosmos-muted border border-cosmos-border"
                }`}
              >
                {step > s.id ? <Check size={16} /> : s.id}
              </div>
              {i < totalSteps - 1 && (
                <div className={`flex-1 h-0.5 rounded ${step > s.id ? "bg-cosmos-accent" : "bg-cosmos-border"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="p-6 md:p-8 bg-cosmos-surface border border-cosmos-border rounded-xl shadow-xl">
          {/* Step 1: Tipo de cuenta */}
          {step === 1 && (
            <div>
              <h2 className="font-display font-semibold text-cosmos-text text-lg m-0 mb-4">¿Qué querés hacer en Cosmos?</h2>
              <div className="grid gap-3">
                <button
                  type="button"
                  onClick={() => setRole("comprador")}
                  className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                    role === "comprador"
                      ? "border-cosmos-accent bg-cosmos-accent-soft"
                      : "border-cosmos-border bg-cosmos-surface-elevated hover:border-cosmos-accent/50"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-cosmos-accent-soft flex items-center justify-center shrink-0">
                    <ShoppingBag size={24} className="text-cosmos-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-cosmos-text m-0">Comprador</p>
                    <p className="text-sm text-cosmos-muted m-0">Comprar productos en tiendas de la red</p>
                  </div>
                  {role === "comprador" && <Check size={20} className="text-cosmos-accent ml-auto" />}
                </button>

                <button
                  type="button"
                  onClick={() => setRole("retailer")}
                  className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                    role === "retailer"
                      ? "border-cosmos-accent bg-cosmos-accent-soft"
                      : "border-cosmos-border bg-cosmos-surface-elevated hover:border-cosmos-accent/50"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-cosmos-accent-soft flex items-center justify-center shrink-0">
                    <Store size={24} className="text-cosmos-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-cosmos-text m-0">Retailer / Vendedor</p>
                    <p className="text-sm text-cosmos-muted m-0">Vender sin stock, conectando con proveedores</p>
                  </div>
                  {role === "retailer" && <Check size={20} className="text-cosmos-accent ml-auto" />}
                </button>

                <button
                  type="button"
                  onClick={() => setRole("proveedor")}
                  className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                    role === "proveedor"
                      ? "border-cosmos-accent bg-cosmos-accent-soft"
                      : "border-cosmos-border bg-cosmos-surface-elevated hover:border-cosmos-accent/50"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-cosmos-accent-soft flex items-center justify-center shrink-0">
                    <Package size={24} className="text-cosmos-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-cosmos-text m-0">Proveedor</p>
                    <p className="text-sm text-cosmos-muted m-0">Tenés productos, vendés a retailers</p>
                  </div>
                  {role === "proveedor" && <Check size={20} className="text-cosmos-accent ml-auto" />}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Datos personales */}
          {step === 2 && (
            <div>
              <h2 className="font-display font-semibold text-cosmos-text text-lg m-0 mb-4">Tus datos</h2>
              <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium uppercase tracking-wider text-cosmos-muted">Nombre completo</span>
                  <input type="text" className={inputBase} value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" required />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium uppercase tracking-wider text-cosmos-muted">Correo electrónico</span>
                  <input type="email" className={inputBase} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium uppercase tracking-wider text-cosmos-muted">Contraseña</span>
                  <input type="password" className={inputBase} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 8 caracteres" required minLength={8} />
                </label>
              </form>
            </div>
          )}

          {/* Step 3: Negocio (solo retailer o proveedor) */}
          {step === 3 && needsBusinessStep && (
            <div>
              <h2 className="font-display font-semibold text-cosmos-text text-lg m-0 mb-4">
                {role === "retailer" ? "Tu tienda" : "Tu empresa"}
              </h2>
              <div className="flex flex-col gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium uppercase tracking-wider text-cosmos-muted">
                    {role === "retailer" ? "Nombre de la tienda" : "Nombre de la empresa"}
                  </span>
                  <input type="text" className={inputBase} value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder={role === "retailer" ? "Ej: Mi Tienda" : "Ej: Distribuidora XYZ"} required />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium uppercase tracking-wider text-cosmos-muted">País</span>
                  <input type="text" className={inputBase} value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Argentina" />
                </label>
              </div>
            </div>
          )}

          {/* Step 4 (o 3 si comprador): Resumen / Listo */}
          {(step === totalSteps) && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-cosmos-accent-soft flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-cosmos-accent" />
              </div>
              <h2 className="font-display font-semibold text-cosmos-text text-lg m-0 mb-2">¡Cuenta creada!</h2>
              <p className="text-cosmos-muted text-sm m-0 mb-6">
                Vas a ser redirigido a tu {role === "comprador" ? "perfil" : role === "retailer" ? "dashboard de retailer" : "panel de proveedores"}.
              </p>
              <button type="button" onClick={handleFinish} className="w-full px-6 py-3.5 font-medium bg-cosmos-accent text-cosmos-bg rounded-lg hover:bg-cosmos-accent-hover transition-colors">
                Continuar
              </button>
            </div>
          )}

          {/* Navegación (excepto en último paso de confirmación) */}
          {step < totalSteps && (
            <div className="flex gap-3 mt-6">
              {step > 1 ? (
                <button type="button" onClick={handleBack} className="flex items-center gap-2 px-4 py-3 font-medium text-cosmos-muted border border-cosmos-border rounded-lg hover:bg-cosmos-surface-elevated transition-colors">
                  <ChevronLeft size={18} />
                  Atrás
                </button>
              ) : (
                <Link to="/" className="flex items-center gap-2 px-4 py-3 font-medium text-cosmos-muted border border-cosmos-border rounded-lg hover:bg-cosmos-surface-elevated transition-colors">
                  Cancelar
                </Link>
              )}
              <button
                type="button"
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 font-medium bg-cosmos-accent text-cosmos-bg rounded-lg hover:bg-cosmos-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {step === totalSteps - 1 ? "Crear cuenta" : "Siguiente"} <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        <p className="mt-6 text-[0.9375rem] text-cosmos-muted text-center m-0">
          ¿Ya tenés cuenta? <Link to="/login" className="text-cosmos-accent font-medium hover:text-cosmos-accent-hover">Iniciar sesión</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
