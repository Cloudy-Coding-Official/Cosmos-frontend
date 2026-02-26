import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useCallback } from "react";
import { AuthProviders } from "../components/AuthProviders";
import { AuthLayout } from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";
import { useStellarWallet } from "../context/StellarWalletContext";
import { useGoogleSignIn } from "../hooks/useGoogleSignIn";
import * as authApi from "../api/auth";
import { getErrorMessage } from "../api/client";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [stellarLoginLoading, setStellarLoginLoading] = useState(false);
  const stellarLoginInProgress = useRef(false);
  const { setUser, login } = useAuth();
  const stellar = useStellarWallet();
  const navigate = useNavigate();

  const handleGoogleCredential = useCallback(
    async (idToken: string) => {
      setError("");
      setGoogleLoading(true);
      try {
        const res = await authApi.googleAuth({ idToken });
        setUser(res.user);
        const hasAnyProfile =
          res.user.hasBuyerProfile || res.user.hasStoreProfile || res.user.hasProviderProfile || res.user.pendingProvider;
        if (!hasAnyProfile) {
          login("comprador");
          navigate("/onboard?from=google");
          return;
        }
        login(
          res.user.hasProviderProfile || res.user.pendingProvider ? "proveedor" : res.user.hasStoreProfile ? "retailer" : "comprador"
        );
        navigate("/perfil");
      } catch (err) {
        const apiErr = err as { message?: string };
        if (apiErr.message === "GOOGLE_NEEDS_ONBOARDING") {
          navigate("/onboard?from=google");
          return;
        }
        setError(getErrorMessage(err, "Error al iniciar sesión con Google"));
      } finally {
        setGoogleLoading(false);
      }
    },
    [setUser, login, navigate]
  );

  const { triggerSignIn: triggerGoogleSignIn, isReady: googleReady, error: googleError, buttonContainerRef } = useGoogleSignIn(handleGoogleCredential);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      setUser(res.user);
      login(res.user.hasProviderProfile || res.user.pendingProvider ? "proveedor" : res.user.hasStoreProfile ? "retailer" : "comprador");
      navigate("/perfil");
    } catch (err) {
      setError(getErrorMessage(err, "Error al iniciar sesión"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    setError("");
    if (googleError) {
      setError(googleError);
      return;
    }
    triggerGoogleSignIn();
  };

  const handleStellarLogin = async () => {
    if (!stellar.address) return;
    if (stellarLoginInProgress.current) return;
    stellarLoginInProgress.current = true;
    setError("");
    setStellarLoginLoading(true);
    try {
      const { message } = await authApi.getWalletNonce(stellar.address);
      const signature = await stellar.signMessage(message);
      if (!signature) {
        setError("Tu wallet no permite firmar mensajes para iniciar sesión. Probá con Freighter o xBull.");
        return;
      }
      const res = await authApi.walletVerify({
        address: stellar.address,
        signature,
      });
      setUser(res.user);
      const hasAnyProfile =
        res.user.hasBuyerProfile || res.user.hasStoreProfile || res.user.hasProviderProfile || res.user.pendingProvider;
      if (!hasAnyProfile) {
        login("comprador");
        navigate("/onboard?from=wallet");
        return;
      }
      login(
        res.user.hasProviderProfile || res.user.pendingProvider ? "proveedor" : res.user.hasStoreProfile ? "retailer" : "comprador"
      );
      navigate("/perfil");
    } catch (err) {
      const apiErr = err as { message?: string };
      if (apiErr.message === "WALLET_NEEDS_ONBOARDING") {
        sessionStorage.setItem("cosmos_wallet_onboarding_address", stellar.address);
        navigate("/onboard?from=wallet");
        return;
      }
      let msg = getErrorMessage(err, "Error al iniciar sesión con la wallet");
      if (/rejected|rechazad/i.test(msg)) {
        msg = "La wallet canceló la firma. Probá de nuevo y tocá «Confirm» en el popup de Freighter.";
      }
      setError(msg);
    } finally {
      setStellarLoginLoading(false);
      stellarLoginInProgress.current = false;
    }
  };

  return (
    <AuthLayout>
      {/* Contenedor oculto para el botón de Google (abre el modal clásico al hacer clic en "Continuar con Google") */}
      {googleReady && (
        <div
          ref={buttonContainerRef}
          className="absolute left-[-9999px] w-[240px] h-[48px] overflow-hidden"
          aria-hidden
        />
      )}
      <div className="p-10 bg-cosmos-surface border border-cosmos-border rounded-xl shadow-xl">
        <h1 className="font-display text-[1.75rem] text-cosmos-text m-0 mb-1">Iniciar sesión</h1>
        <p className="text-[0.9375rem] text-cosmos-muted m-0 mb-6">Accede a tu cuenta de Cosmos</p>

        {(error || googleError) && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">
            {error || googleError}
          </div>
        )}

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
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 px-6 py-3.5 font-medium bg-cosmos-accent text-cosmos-bg border-0 rounded-lg hover:bg-cosmos-accent-hover transition-colors cursor-pointer shadow-lg disabled:opacity-60"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <span className="flex-1 h-px bg-cosmos-border" />
          <span className="text-xs font-medium uppercase tracking-wider text-cosmos-muted">o continúa con</span>
          <span className="flex-1 h-px bg-cosmos-border" />
        </div>

        <AuthProviders
          mode="login"
          onGoogle={googleReady ? handleGoogle : undefined}
          googleLoading={googleLoading}
          onStellarLogin={handleStellarLogin}
          stellarLoginLoading={stellarLoginLoading}
        />

        <p className="mt-6 pt-6 border-t border-cosmos-border text-[0.9375rem] text-cosmos-muted text-center m-0">
          ¿No tienes cuenta? <Link to="/onboard" className="text-cosmos-accent font-medium hover:text-cosmos-accent-hover">Crear cuenta</Link>
        </p>
      </div>
    </AuthLayout>
  );
}
