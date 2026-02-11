import { Link } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

const MOCK_PRODUCTS = [
  { id: "1", name: "Auriculares inalámbricos", price: 49.99, image: null, seller: "TechStore" },
  { id: "2", name: "Mochila urbana", price: 35.5, image: null, seller: "ModaLatam" },
  { id: "3", name: "Cargador rápido 65W", price: 22.0, image: null, seller: "ElectroPlus" },
  { id: "4", name: "Zapatillas running", price: 89.99, image: null, seller: "DeportesYA" },
  { id: "5", name: "Café en grano 1kg", price: 12.5, image: null, seller: "CaféRegional" },
  { id: "6", name: "Lámpara LED escritorio", price: 28.0, image: null, seller: "HogarCosmos" },
  { id: "7", name: "Pack 3 camisetas básicas", price: 24.99, image: null, seller: "ModaLatam" },
  { id: "8", name: "Reloj inteligente", price: 75.0, image: null, seller: "TechStore" },
];

export function Shop() {
  const [search, setSearch] = useState("");

  return (
    <div className="py-8 bg-cosmos-bg">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <div className="flex flex-wrap gap-4 items-center mb-6">
          <div className="flex-1 min-w-[200px] relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-cosmos-muted pointer-events-none" />
            <input
              type="search"
              className="w-full pl-10 pr-4 py-3 font-sans text-base border border-cosmos-border bg-cosmos-surface text-cosmos-text placeholder:text-cosmos-muted focus:outline-none focus:border-cosmos-accent focus:ring-1 focus:ring-cosmos-accent rounded-lg transition-colors"
              placeholder="Buscar productos, marcas o vendedores"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-3 font-medium bg-cosmos-surface text-cosmos-text border border-cosmos-border rounded-lg hover:border-cosmos-accent hover:text-cosmos-accent transition-colors"
          >
            <SlidersHorizontal size={18} />
            Filtros
          </button>
        </div>

        <nav className="flex items-center gap-2 text-sm text-cosmos-muted mb-8">
          <Link to="/" className="hover:text-cosmos-accent transition-colors">Inicio</Link>
          <span>/</span>
          <span className="text-cosmos-text">Tienda</span>
        </nav>

        <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {MOCK_PRODUCTS.map((product) => (
            <Link
              to={`/producto/${product.id}`}
              key={product.id}
              className="block bg-cosmos-surface border border-cosmos-border text-cosmos-text rounded-xl overflow-hidden transition-all hover:-translate-y-1 hover:border-cosmos-border-strong hover:shadow-xl hover:shadow-black/20"
            >
              <div className="aspect-square bg-cosmos-surface-elevated" />
              <div className="p-4">
                <h3 className="font-medium text-cosmos-text m-0 mb-1 line-clamp-2">{product.name}</h3>
                <p className="text-sm text-cosmos-muted m-0 mb-1">{product.seller}</p>
                <p className="text-cosmos-text font-medium m-0">
                  US$ {product.price.toFixed(2)}
                  <span className="text-xs font-normal text-cosmos-muted"> 1% + $0.10 protección</span>
                </p>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
