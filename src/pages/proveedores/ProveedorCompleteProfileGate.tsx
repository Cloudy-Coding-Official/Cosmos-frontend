import { Link, Outlet, useLocation } from "react-router-dom";
import { Package } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function ProveedorCompleteProfileGate() {
  const { user } = useAuth();
  const location = useLocation();
  const providerId = user?.providerProfileId ?? null;
  const isPerfilRoute =
    location.pathname === "/proveedores/perfil" ||
    location.pathname.startsWith("/proveedores/perfil/");

  if (!providerId && !isPerfilRoute) {
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
            className="inline-block w-full px-6 py-3.5 font-medium bg-cosmos-accent text-cosmos-bg rounded-lg hover:bg-cosmos-accent-hover transition-colors text-center disabled:cursor-not-allowed"
          >
            Completar datos
          </Link>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
