import { Link } from "react-router-dom";
import { Store, Plus } from "lucide-react";

const MOCK_STORES = [
  { id: "1", name: "TechStore", productsCount: 24, status: "Activa" },
  { id: "2", name: "ModaLatam", productsCount: 18, status: "Activa" },
];

export function RetailerStores() {
  return (
    <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <nav className="flex items-center gap-2 text-sm text-cosmos-muted mb-6">
          <Link to="/retailer" className="hover:text-cosmos-accent transition-colors">Mi tienda</Link>
          <span>/</span>
          <span className="text-cosmos-text">Mis tiendas</span>
        </nav>

        <h1 className="font-display font-semibold text-cosmos-text text-2xl md:text-3xl m-0 mb-2">
          Sus tiendas
        </h1>
        <p className="text-cosmos-muted m-0 mb-10">
          Gestiona varios perfiles de tienda distintos.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {MOCK_STORES.map((store) => (
            <div
              key={store.id}
              className="p-6 bg-cosmos-surface border border-cosmos-border rounded-2xl hover:border-cosmos-accent/40 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-cosmos-accent-soft flex items-center justify-center mb-4">
                <Store size={24} className="text-cosmos-accent" />
              </div>
              <h3 className="font-display font-semibold text-cosmos-text text-lg m-0 mb-1">
                {store.name}
              </h3>
              <p className="text-sm text-cosmos-muted m-0 mb-2">
                {store.productsCount} productos
              </p>
              <span className="inline-block px-3 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-400 rounded-lg">
                {store.status}
              </span>
            </div>
          ))}

          <button className="p-6 border-2 border-dashed border-cosmos-border rounded-2xl hover:border-cosmos-accent/50 hover:bg-cosmos-accent/5 transition-all flex flex-col items-center justify-center gap-3 min-h-[180px]">
            <Plus size={32} className="text-cosmos-muted" />
            <span className="font-medium text-cosmos-muted">Nueva tienda</span>
          </button>
        </div>
      </div>
    </div>
  );
}
