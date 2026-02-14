import { Link } from "react-router-dom";
import { Building2, MapPin, Star } from "lucide-react";

export function ProveedoresPerfil() {
  return (
    <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <nav className="flex items-center gap-2 text-sm text-cosmos-muted mb-6">
          <Link to="/proveedores" className="hover:text-emerald-400 transition-colors">Proveedores</Link>
          <span>/</span>
          <span className="text-cosmos-text">Mi perfil</span>
        </nav>

        <div className="p-8 bg-cosmos-surface border border-cosmos-border rounded-2xl">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-24 h-24 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Building2 size={40} className="text-emerald-400" />
            </div>
            <div className="flex-1">
              <h1 className="font-display font-semibold text-cosmos-text text-2xl m-0 mb-2">
                ElectroPlus LATAM
              </h1>
              <p className="text-cosmos-muted flex items-center gap-2 m-0 mb-4">
                <MapPin size={16} />
                Buenos Aires, Argentina
              </p>
              <div className="flex items-center gap-2 mb-4">
                <Star size={18} className="text-amber-400 fill-amber-400" />
                <span className="font-medium text-cosmos-text">4.8</span>
                <span className="text-cosmos-muted">(45 valoraciones)</span>
              </div>
              <p className="text-cosmos-muted leading-relaxed m-0">
                Proveedor de electrónica y accesorios. Catálogo de más de 45 productos.
                Envíos a toda Latinoamérica.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-cosmos-surface border border-cosmos-border rounded-2xl">
          <h3 className="font-display font-semibold text-cosmos-text m-0 mb-4">Factor de beneficios al retailer</h3>
          <p className="text-sm text-cosmos-muted m-0 mb-4">
            Logo propio, quitar publicidad, precios preferenciales y más ventajas para retailers que vendan tus productos.
          </p>
          <p className="text-xs text-cosmos-muted m-0">Configurable desde el panel de proveedor.</p>
        </div>
      </div>
    </div>
  );
}
