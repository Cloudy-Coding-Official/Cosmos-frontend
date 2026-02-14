import { Link } from "react-router-dom";
import { Package, Plus } from "lucide-react";

export function ProveedoresProductos() {
  return (
    <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <nav className="flex items-center gap-2 text-sm text-cosmos-muted mb-6">
          <Link to="/proveedores" className="hover:text-emerald-400 transition-colors">Proveedores</Link>
          <span>/</span>
          <span className="text-cosmos-text">Productos</span>
        </nav>

        <h1 className="font-display font-semibold text-cosmos-text text-2xl md:text-3xl m-0 mb-2">
          Subir productos
        </h1>
        <p className="text-cosmos-muted m-0 mb-10">
          Publica tu catálogo para que los retailers puedan vender tus productos.
        </p>

        <div className="p-8 bg-cosmos-surface border border-cosmos-border rounded-2xl border-dashed hover:border-emerald-500/40 transition-all">
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
              <Package size={32} className="text-emerald-400" />
            </div>
            <h3 className="font-display font-semibold text-cosmos-text text-lg m-0 mb-2">
              Agregar producto
            </h3>
            <p className="text-sm text-cosmos-muted m-0 mb-6 max-w-md mx-auto">
              Sube tus productos con nombre, descripción, precio y fotos. Los retailers verán tu catálogo y podrán venderlos.
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 font-medium bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-colors">
              <Plus size={20} />
              Subir producto
            </button>
          </div>
        </div>

        <div className="mt-12 p-6 bg-cosmos-surface border border-cosmos-border rounded-2xl">
          <h3 className="font-display font-semibold text-cosmos-text m-0 mb-4">Mis productos</h3>
          <p className="text-sm text-cosmos-muted m-0">
            Aquí aparecerán los productos que hayas publicado.
          </p>
        </div>
      </div>
    </div>
  );
}
