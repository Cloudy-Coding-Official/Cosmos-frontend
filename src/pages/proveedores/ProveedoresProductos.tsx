import { Link } from "react-router-dom";
import { Package, Plus } from "lucide-react";

export function ProveedoresProductos() {
  return (
    <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <nav className="flex items-center gap-2 text-sm text-cosmos-muted mb-8">
          <Link to="/proveedores" className="hover:text-cosmos-accent">Proveedores</Link>
          <span>/</span>
          <span className="text-cosmos-text">Catálogo</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display font-semibold text-cosmos-text text-2xl m-0 mb-1">
              Catálogo
            </h1>
            <p className="text-cosmos-muted text-sm m-0">
              Lo que subís acá aparece en las tiendas de los retailers.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 font-medium bg-cosmos-accent text-cosmos-bg rounded-lg hover:bg-cosmos-accent-hover transition-colors"
          >
            <Plus size={18} />
            Nuevo producto
          </button>
        </div>

        <div className="p-12 border border-dashed border-cosmos-border rounded-xl text-center">
          <div className="w-14 h-14 rounded-xl bg-cosmos-surface-elevated flex items-center justify-center mx-auto mb-4">
            <Package size={28} className="text-cosmos-muted" />
          </div>
          <p className="text-cosmos-muted m-0 mb-2">Sin productos todavía</p>
          <p className="text-sm text-cosmos-muted m-0">
            Agregá tu primer producto para que los retailers puedan venderlo.
          </p>
        </div>
      </div>
    </div>
  );
}
