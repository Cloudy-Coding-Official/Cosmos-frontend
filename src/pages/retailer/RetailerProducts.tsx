import { Link } from "react-router-dom";
import { Upload, Package, ArrowRight, Plus } from "lucide-react";

export function RetailerProducts() {
  return (
    <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <nav className="flex items-center gap-2 text-sm text-cosmos-muted mb-6">
          <Link to="/retailer" className="hover:text-cosmos-accent transition-colors">Mi tienda</Link>
          <span>/</span>
          <span className="text-cosmos-text">Productos</span>
        </nav>

        <h1 className="font-display font-semibold text-cosmos-text text-2xl md:text-3xl m-0 mb-2">
          Subir productos
        </h1>
        <p className="text-cosmos-muted m-0 mb-10">
          Sube productos propios o selecciona del catálogo de proveedores.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-8 bg-cosmos-surface border border-cosmos-border rounded-2xl hover:border-cosmos-accent/40 transition-all">
            <div className="w-14 h-14 rounded-xl bg-cosmos-accent-soft flex items-center justify-center mb-4">
              <Package className="text-cosmos-accent" size={28} />
            </div>
            <h3 className="font-display font-semibold text-cosmos-text text-lg m-0 mb-2">
              Producto propio
            </h3>
            <p className="text-sm text-cosmos-muted m-0 mb-6">
              Sube productos que ya tienes en stock o fabricas tú mismo.
            </p>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 font-medium bg-cosmos-accent text-cosmos-bg rounded-xl hover:bg-cosmos-accent-hover transition-colors">
              <Plus size={18} />
              Subir producto
            </button>
          </div>

          <div className="p-8 bg-cosmos-surface border border-cosmos-border rounded-2xl hover:border-cosmos-accent/40 transition-all">
            <div className="w-14 h-14 rounded-xl bg-cosmos-accent-soft flex items-center justify-center mb-4">
              <Upload className="text-cosmos-accent" size={28} />
            </div>
            <h3 className="font-display font-semibold text-cosmos-text text-lg m-0 mb-2">
              Producto de proveedor
            </h3>
            <p className="text-sm text-cosmos-muted m-0 mb-6">
              Selecciona productos del catálogo de tus proveedores conectados.
            </p>
            <Link
              to="/retailer/proveedores"
              className="inline-flex items-center gap-2 px-5 py-2.5 font-medium text-cosmos-accent border border-cosmos-accent rounded-xl hover:bg-cosmos-accent-soft transition-colors"
            >
              Ver proveedores
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        <div className="mt-12 p-6 bg-cosmos-surface border border-cosmos-border rounded-2xl">
          <h3 className="font-display font-semibold text-cosmos-text m-0 mb-4">Mis productos publicados</h3>
          <p className="text-sm text-cosmos-muted m-0">
            Aquí aparecerán los productos que hayas subido o seleccionado de proveedores.
          </p>
        </div>
      </div>
    </div>
  );
}
