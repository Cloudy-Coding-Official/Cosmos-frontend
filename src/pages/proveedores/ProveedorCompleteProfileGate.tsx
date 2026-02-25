import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Package } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getProviderById } from "../../api/providers";

const PENDING_LEGAL_NAME = "Pendiente";
const PENDING_TAX_ID = "PENDING";

export function ProveedorCompleteProfileGate() {
  const { user } = useAuth();
  const location = useLocation();
  const providerId = user?.providerProfileId ?? null;
  const [profile, setProfile] = useState<{ legalName: string; taxId: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const isPerfilRoute = location.pathname === "/proveedores/perfil" || location.pathname.startsWith("/proveedores/perfil/");

  useEffect(() => {
    if (!providerId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProfile(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getProviderById(providerId)
      .then((data) => {
        if (!cancelled && data)
          setProfile({ legalName: data.legalName, taxId: data.taxId });
        else if (!cancelled)
          setProfile(null);
      })
      .catch(() => {
        if (!cancelled) setProfile(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [providerId, location.pathname]);

  const isPending =
    profile &&
    (profile.legalName === PENDING_LEGAL_NAME || profile.taxId === PENDING_TAX_ID);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-cosmos-muted">Cargando…</p>
      </div>
    );
  }

  if (isPending && !isPerfilRoute) {
    return (
      <div className="min-h-screen bg-cosmos-bg py-12 flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-cosmos-accent-soft flex items-center justify-center mx-auto mb-6">
            <Package size={32} className="text-cosmos-accent" />
          </div>
          <h1 className="font-display font-semibold text-cosmos-text text-xl md:text-2xl m-0 mb-2">
            Completar datos de tu empresa
          </h1>
          <p className="text-cosmos-muted text-sm m-0 mb-8">
            Para usar el panel de proveedor necesitás cargar el nombre de tu empresa y CUIT/RFC. Completalo ahora para comenzar.
          </p>
          <Link
            to="/proveedores/perfil"
            className="inline-block w-full px-6 py-3.5 font-medium bg-cosmos-accent text-cosmos-bg rounded-lg hover:bg-cosmos-accent-hover transition-colors text-center"
          >
            Completar datos
          </Link>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
