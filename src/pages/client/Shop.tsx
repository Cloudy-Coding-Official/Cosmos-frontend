import { Link } from "react-router-dom";
import { Search, SlidersHorizontal, Star, Sparkles } from "lucide-react";
import { useState } from "react";
import { MOCK_PRODUCTS } from "../../data/products";
import { ProductImage } from "../../components/ProductImage";

export function Shop() {
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-cosmos-bg">
      <div className="relative py-12 pb-8 bg-gradient-to-b from-cosmos-surface/60 to-transparent border-b border-cosmos-border/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(139,92,246,0.08)_0%,transparent_60%)]" />
        <div className="relative w-full max-w-[1200px] mx-auto px-6">
          <nav className="flex items-center gap-2 text-sm text-cosmos-muted mb-6">
            <Link to="/" className="hover:text-cosmos-accent transition-colors">Inicio</Link>
            <span>/</span>
            <span className="text-cosmos-text">Tienda</span>
          </nav>
          <h1 className="font-display font-semibold text-cosmos-text text-2xl md:text-3xl m-0 mb-2 flex items-center gap-2">
            <Sparkles size={28} className="text-cosmos-accent" />
            Explora productos
          </h1>
          <p className="text-cosmos-muted m-0 mb-8">
            Compra con confianza. Todos los productos cuentan con protección Cosmos.
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[240px] max-w-xl relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-cosmos-muted pointer-events-none" />
              <input
                type="search"
                className="w-full pl-12 pr-4 py-3.5 font-sans text-base border border-cosmos-border bg-cosmos-surface text-cosmos-text placeholder:text-cosmos-muted focus:outline-none focus:border-cosmos-accent focus:ring-2 focus:ring-cosmos-accent/20 rounded-xl transition-all"
                placeholder="Buscar productos, marcas o vendedores"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-5 py-3.5 font-medium bg-cosmos-surface text-cosmos-text border border-cosmos-border rounded-xl hover:border-cosmos-accent hover:text-cosmos-accent hover:bg-cosmos-surface-elevated transition-all"
            >
              <SlidersHorizontal size={18} />
              Filtros
            </button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1200px] mx-auto px-6 py-10">
        <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {MOCK_PRODUCTS.map((product) => (
            <Link
              to={`/producto/${product.id}`}
              key={product.id}
              className="group block bg-cosmos-surface border border-cosmos-border text-cosmos-text rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-cosmos-accent/40 hover:shadow-xl hover:shadow-cosmos-accent/5"
            >
              <div className="aspect-square bg-gradient-to-br from-cosmos-surface-elevated to-cosmos-surface relative overflow-hidden">
                <ProductImage
                  src={product.image}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  wrapperClassName="absolute inset-0"
                />
                <div className="absolute inset-0 bg-cosmos-accent/5 group-hover:bg-cosmos-accent/10 transition-colors" />
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-cosmos-bg/90 rounded-lg">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span className="text-xs font-medium text-cosmos-text">{product.rating}</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-cosmos-text m-0 mb-1 line-clamp-2 group-hover:text-cosmos-accent transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-cosmos-muted m-0 mb-3">{product.seller}</p>
                <p className="text-cosmos-text font-semibold m-0">
                  US$ {product.price.toFixed(2)}
                </p>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
