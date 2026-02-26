import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useRef, useCallback } from "react";
import { ShoppingBag, Store, Package, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { AuthLayout } from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";
import { useStellarWallet } from "../context/StellarWalletContext";
import { useGoogleSignIn } from "../hooks/useGoogleSignIn";
import * as authApi from "../api/auth";
import { getErrorMessage } from "../api/client";
import type { RegisterWithGooglePayload } from "../api/auth";
import { COUNTRIES } from "../data/countries";

export type OnboardRole = "comprador" | "retailer" | "proveedor";

const WALLET_ONBOARDING_KEY = "cosmos_wallet_onboarding_address";

const STEPS = [
  { id: 1, title: "Tipo de cuenta" },
  { id: 2, title: "Datos personales" },
  { id: 3, title: "Listo" },
];

export function Onboard() {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get("role") as OnboardRole | null;
  const fromWallet = searchParams.get("from") === "wallet";
  const fromGoogle = searchParams.get("from") === "google";
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<OnboardRole | null>(
    roleParam && ["comprador", "retailer", "proveedor"].includes(roleParam) ? roleParam : null
  );
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [country, setCountry] = useState("");
  const [finishError, setFinishError] = useState("");
  const [finishLoading, setFinishLoading] = useState(false);
  const pendingGoogleRef = useRef<Omit<RegisterWithGooglePayload, "idToken"> | null>(null);
  const { login, setUser } = useAuth();
  const stellar = useStellarWallet();
  const navigate = useNavigate();

  const handleGoogleCredentialForRegister = useCallback(
    async (idToken: string) => {
      const data = pendingGoogleRef.current;
      if (!data) return;
      pendingGoogleRef.current = null;
      setFinishError("");
      try {
        const res = await authApi.registerWithGoogle({ idToken, ...data });
        setUser(res.user);
        login(
          res.user.hasProviderProfile || res.user.pendingProvider ? "proveedor" : res.user.hasStoreProfile ? "retailer" : "comprador"
        );
        if (data.role === "retailer") navigate("/retailer");
        else if (data.role === "proveedor") navigate("/proveedores");
        else navigate("/perfil");
      } catch (err) {
        setFinishError(getErrorMessage(err, "Error al crear la cuenta"));
      } finally {
        setFinishLoading(false);
      }
    },
    [setUser, login, navigate]
  );

  const { triggerSignIn: triggerGoogleSignIn, isReady: googleReady, buttonContainerRef } = useGoogleSignIn(handleGoogleCredentialForRegister);

  const totalSteps = 3;

  const handleNext = () => {
    if (step < totalSteps) setStep((s) => s + 1);
    else handleFinish();
  };

  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  const handleFinish = async () => {
    if (fromWallet) {
      const walletAddress = sessionStorage.getItem(WALLET_ONBOARDING_KEY);
      if (!walletAddress) {
        setFinishError("No se encontró la dirección de la wallet. Volvé a iniciar sesión con tu wallet.");
        return;
      }
      if (!stellar?.address || stellar.address !== walletAddress) {
        setFinishError("Conectá la misma wallet que usaste para iniciar (Freighter u otra).");
        return;
      }
      setFinishError("");
      setFinishLoading(true);
      try {
        const { message } = await authApi.getWalletNonce(walletAddress);
        const signature = await stellar.signMessage(message);
        if (!signature) {
          setFinishError("Tu wallet no permitió firmar. Probá de nuevo y confirmá en el popup.");
          return;
        }
        const countryCode = country && country.length === 2 ? country : undefined;
        const res = await authApi.registerWithWallet({
          email,
          password,
          address: walletAddress,
          signature,
          country: countryCode,
          firstName: firstName.trim() || undefined,
          lastName: lastName.trim() || undefined,
          role: role ?? "comprador",
        });
        sessionStorage.removeItem(WALLET_ONBOARDING_KEY);
        setUser(res.user);
        login(
          res.user.hasProviderProfile || res.user.pendingProvider ? "proveedor" : res.user.hasStoreProfile ? "retailer" : "comprador"
        );
        if (role === "retailer") navigate("/retailer");
        else if (role === "proveedor") navigate("/proveedores");
        else navigate("/perfil");
      } catch (err) {
        setFinishError(getErrorMessage(err, "Error al crear la cuenta"));
      } finally {
        setFinishLoading(false);
      }
      return;
    }

    if (fromGoogle) {
      if (!googleReady) {
        setFinishError("Google Sign-In aún no está listo. Esperá un momento y probá de nuevo.");
        return;
      }
      setFinishError("");
      setFinishLoading(true);
      pendingGoogleRef.current = {
        email,
        password,
        country: country && country.length === 2 ? country : undefined,
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
        role: role ?? "comprador",
      };
      triggerGoogleSignIn();
      return;
    }

    setFinishError("");
    setFinishLoading(true);
    try {
      const countryCode = country && country.length === 2 ? country : undefined;
      const res = await authApi.register({
        email,
        password,
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
        country: countryCode,
      });
      let user = res.user;
      if (role === "retailer") {
        const updated = await authApi.expandAccount({
          role: "retailer",
          country: countryCode,
        });
        user = updated;
      } else if (role === "proveedor") {
        const updated = await authApi.expandAccount({
          role: "proveedor",
          country: countryCode,
        });
        user = updated;
      }
      setUser(user);
      login(
        user.hasProviderProfile || user.pendingProvider ? "proveedor" : user.hasStoreProfile ? "retailer" : "comprador"
      );
      if (role === "retailer") navigate("/retailer");
      else if (role === "proveedor") navigate("/proveedores");
      else navigate("/perfil");
    } catch (err) {
      setFinishError(getErrorMessage(err, "Error al crear la cuenta"));
    } finally {
      setFinishLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return role !== null;
    if (step === 2) return firstName.trim() && lastName.trim() && email.trim() && password.length >= 8;
    return true;
  };

  const inputBase =
    "w-full px-4 py-3 font-sans text-base border border-cosmos-border bg-cosmos-surface-elevated text-cosmos-text placeholder:text-cosmos-muted focus:outline-none focus:border-cosmos-accent focus:ring-1 focus:ring-cosmos-accent rounded-lg transition-colors";

  return (
    <AuthLayout wide>
      {fromGoogle && googleReady && (
        <div
          ref={buttonContainerRef}
          className="absolute left-[-9999px] w-[240px] h-[48px] overflow-hidden"
          aria-hidden
        />
      )}
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
                  <span className="text-xs font-medium uppercase tracking-wider text-cosmos-muted">Nombre</span>
                  <input type="text" className={inputBase} value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Ingresa tu nombre" required />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium uppercase tracking-wider text-cosmos-muted">Apellido</span>
                  <input type="text" className={inputBase} value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Ingresa tu apellido" required />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium uppercase tracking-wider text-cosmos-muted">Correo electrónico</span>
                  <input type="email" className={inputBase} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium uppercase tracking-wider text-cosmos-muted">Contraseña</span>
                  <input type="password" className={inputBase} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 8 caracteres" required minLength={8} />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium uppercase tracking-wider text-cosmos-muted">País</span>
                  <select className={inputBase} value={country} onChange={(e) => setCountry(e.target.value)}>
                    <option value="">Seleccionar país</option>
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
              </form>
            </div>
          )}

          {/* Step 3: Resumen / Listo */}
          {(step === totalSteps) && (
            <div className="text-center">
              {fromWallet ? (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-cosmos-accent-soft flex items-center justify-center mx-auto mb-4">
                    <Check size={32} className="text-cosmos-accent" />
                  </div>
                  <h2 className="font-display font-semibold text-cosmos-text text-lg m-0 mb-2">Crear cuenta con tu wallet</h2>
                  <p className="text-cosmos-muted text-sm m-0 mb-4">
                    Al continuar se creará tu cuenta con estos datos y se vinculará tu wallet.
                  </p>
                  {finishError && (
                    <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400 text-left">
                      {finishError}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleFinish}
                    disabled={finishLoading}
                    className="w-full px-6 py-3.5 font-medium bg-cosmos-accent text-cosmos-bg rounded-lg hover:bg-cosmos-accent-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {finishLoading ? "Creando cuenta…" : "Crear cuenta"}
                  </button>
                </>
              ) : fromGoogle ? (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-cosmos-accent-soft flex items-center justify-center mx-auto mb-4">
                    <Check size={32} className="text-cosmos-accent" />
                  </div>
                  <h2 className="font-display font-semibold text-cosmos-text text-lg m-0 mb-2">Completar registro con Google</h2>
                  <p className="text-cosmos-muted text-sm m-0 mb-4">
                    Al continuar se abrirá Google para confirmar tu cuenta. Se creará tu perfil con los datos ingresados y se vinculará tu cuenta de Google.
                  </p>
                  {finishError && (
                    <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400 text-left">
                      {finishError}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleFinish}
                    disabled={finishLoading || !googleReady}
                    className="w-full px-6 py-3.5 font-medium bg-cosmos-accent text-cosmos-bg rounded-lg hover:bg-cosmos-accent-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {finishLoading ? "Creando cuenta…" : "Continuar con Google y crear cuenta"}
                  </button>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-cosmos-accent-soft flex items-center justify-center mx-auto mb-4">
                    <Check size={32} className="text-cosmos-accent" />
                  </div>
                  <h2 className="font-display font-semibold text-cosmos-text text-lg m-0 mb-2">Crear cuenta</h2>
                  <p className="text-cosmos-muted text-sm m-0 mb-4">
                    Al continuar se creará tu cuenta con los datos que ingresaste.
                  </p>
                  {finishError && (
                    <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400 text-left">
                      {finishError}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleFinish}
                    disabled={finishLoading}
                    className="w-full px-6 py-3.5 font-medium bg-cosmos-accent text-cosmos-bg rounded-lg hover:bg-cosmos-accent-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {finishLoading ? "Creando cuenta…" : "Crear cuenta"}
                  </button>
                </>
              )}
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
                <Link to="/" className="flex items-center gap-2 px-4 py-3 font-medium text-cosmos-muted border border-cosmos-border rounded-lg hover:bg-cosmos-surface-elevated hover:border-cosmos-border-strong transition-colors">
                  Cancelar
                </Link>
              )}
              <button
                type="button"
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 font-medium bg-cosmos-accent text-cosmos-bg rounded-lg hover:bg-cosmos-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
