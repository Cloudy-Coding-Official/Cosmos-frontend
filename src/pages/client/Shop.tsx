import { Link, useParams } from "react-router-dom";
import { Search, SlidersHorizontal, Star, Sparkles, X } from "lucide-react";
import { useState, useEffect } from "react";
import { getProducts, getProductCategories, type Product, type ProductFilters } from "../../api/products";
import { getStoreBySlug } from "../../api/stores";
import { ProductImage } from "../../components/ProductImage";
import { getErrorMessage } from "../../api/client";

const SORT_OPTIONS: { value: ProductFilters["sort"]; label: string }[] = [
  { value: undefined, label: "Relevancia" },
  { value: "price_asc", label: "Precio: menor a mayor" },
  { value: "price_desc", label: "Precio: mayor a menor" },
  { value: "rating", label: "Mejor valorados" },
  { value: "newest", label: "Más recientes" },
];

export function Shop() {
  const { storeSlug } = useParams<{ storeSlug?: string }>();

  const [storeName, setStoreName] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<{
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: ProductFilters["sort"];
  }>({});

  useEffect(() => {
    let cancelled = false;
    getProductCategories(true)
      .then((list) => { if (!cancelled) setCategories(list); })
      .catch(() => { if (!cancelled) setCategories([]); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!storeSlug) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStoreName(null);
      return;
    }
    let cancelled = false;
    getStoreBySlug(storeSlug)
      .then((s) => { if (!cancelled && s) setStoreName(s.name); })
      .catch(() => { if (!cancelled) setStoreName(null); });
    return () => { cancelled = true; };
  }, [storeSlug]);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);
    const params: ProductFilters = {
      ...(search.trim() && { q: search.trim() }),
      ...(filters.category && { category: filters.category }),
      ...(filters.minPrice != null && filters.minPrice >= 0 && { minPrice: filters.minPrice }),
      ...(filters.maxPrice != null && filters.maxPrice >= 0 && { maxPrice: filters.maxPrice }),
      ...(filters.sort && { sort: filters.sort }),
      ...(storeSlug && { storeSlug }),
    };
    getProducts(params)
      .then((list) => { if (!cancelled) setProducts(list); })
      .catch((err) => { if (!cancelled) setError(getErrorMessage(err, "Error al cargar productos")); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [search, filters.category, filters.minPrice, filters.maxPrice, filters.sort, storeSlug]);

  const isEmpty = !loading && !error && products.length === 0;
  const hasSearch = search.trim().length > 0 || !!filters.category || filters.minPrice != null || filters.maxPrice != null;

  const clearFilters = () => {
    setFilters({});
    setSearch("");
  };

  const hasActiveFilters = hasSearch || !!filters.sort;

  return (
    <div className="min-h-screen bg-cosmos-bg">
      <div className="relative py-12 pb-8 bg-gradient-to-b from-cosmos-surface/60 to-transparent border-b border-cosmos-border/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(139,92,246,0.08)_0%,transparent_60%)]" />
        <div className="relative w-full max-w-[1200px] mx-auto px-6">
          <nav className="flex items-center gap-2 text-sm text-cosmos-muted mb-6">
            <Link to="/" className="hover:text-cosmos-accent transition-colors">Inicio</Link>
            <span>/</span>
            <Link to="/tienda" className="hover:text-cosmos-accent transition-colors">Tienda</Link>
            {storeSlug && (
              <>
                <span>/</span>
                <span className="text-cosmos-text">{storeName ?? storeSlug}</span>
              </>
            )}
          </nav>
          <h1 className="font-display font-semibold text-cosmos-text text-2xl md:text-3xl m-0 mb-2 flex items-center gap-2">
            <Sparkles size={28} className="text-cosmos-accent" />
            {storeSlug ? (storeName ? `Tienda: ${storeName}` : "Tienda") : "Explora productos"}
          </h1>
          <p className="text-cosmos-muted m-0 mb-8">
            {storeSlug && storeName
              ? `Productos de ${storeName}. Compra con confianza.`
              : "Compra con confianza. Todos los productos cuentan con protección Cosmos."}
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
              onClick={() => setFiltersOpen((o) => !o)}
              className={`inline-flex items-center gap-2 px-5 py-3.5 font-medium rounded-xl border transition-all ${filtersOpen || hasActiveFilters
                ? "bg-cosmos-accent/10 text-cosmos-accent border-cosmos-accent/40"
                : "bg-cosmos-surface text-cosmos-text border-cosmos-border hover:border-cosmos-accent hover:text-cosmos-accent hover:bg-cosmos-surface-elevated"
                }`}
            >
              <SlidersHorizontal size={18} />
              Filtros
              {hasActiveFilters && (
                <span className="ml-1 w-2 h-2 rounded-full bg-cosmos-accent" aria-hidden />
              )}
            </button>
            <label className="flex items-center gap-2 text-cosmos-muted text-sm">
              <span className="whitespace-nowrap">Ordenar:</span>
              <select
                value={filters.sort ?? ""}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    sort: (e.target.value || undefined) as ProductFilters["sort"],
                  }))
                }
                className="bg-cosmos-surface border border-cosmos-border text-cosmos-text rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cosmos-accent"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value ?? "default"} value={opt.value ?? ""}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {filtersOpen && (
            <div
              className="mt-6 p-5 rounded-2xl border border-cosmos-border bg-cosmos-surface/80 backdrop-blur"
              role="region"
              aria-label="Opciones de filtro"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-cosmos-text m-0 text-lg">Filtros</h2>
                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  className="p-2 text-cosmos-muted hover:text-cosmos-text rounded-lg"
                  aria-label="Cerrar filtros"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="block text-sm font-medium text-cosmos-text mb-2">Categoría</label>
                  <select
                    value={filters.category ?? ""}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, category: e.target.value || undefined }))
                    }
                    className="w-full bg-cosmos-bg border border-cosmos-border text-cosmos-text rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cosmos-accent"
                  >
                    <option value="">Todas</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-cosmos-text mb-2">Precio mín. (US$)</label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="0"
                    value={filters.minPrice ?? ""}
                    onChange={(e) => {
                      const v = e.target.value === "" ? undefined : parseFloat(e.target.value);
                      setFilters((f) => ({ ...f, minPrice: Number.isFinite(v) ? v : undefined }));
                    }}
                    className="w-full bg-cosmos-bg border border-cosmos-border text-cosmos-text rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cosmos-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cosmos-text mb-2">Precio máx. (US$)</label>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="Sin tope"
                    value={filters.maxPrice ?? ""}
                    onChange={(e) => {
                      const v = e.target.value === "" ? undefined : parseFloat(e.target.value);
                      setFilters((f) => ({ ...f, maxPrice: Number.isFinite(v) ? v : undefined }));
                    }}
                    className="w-full bg-cosmos-bg border border-cosmos-border text-cosmos-text rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cosmos-accent"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="px-4 py-2 text-sm font-medium text-cosmos-muted hover:text-cosmos-accent border border-cosmos-border rounded-lg hover:border-cosmos-accent transition-colors"
                  >
                    Limpiar filtros
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-full max-w-[1200px] mx-auto px-6 py-10">
        {error && (
          <p className="text-red-500 mb-6" role="alert">{error}</p>
        )}
        {loading && (
          <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-busy="true" aria-label="Cargando productos">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-cosmos-surface border border-cosmos-border rounded-2xl overflow-hidden"
              >
                <div className="aspect-square bg-cosmos-surface-elevated animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-cosmos-surface-elevated rounded animate-pulse w-full" />
                  <div className="h-4 bg-cosmos-surface-elevated rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-cosmos-surface-elevated rounded animate-pulse w-1/4" />
                  <div className="h-4 bg-cosmos-surface-elevated rounded animate-pulse w-1/3" />
                </div>
              </div>
            ))}
          </section>
        )}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center border border-cosmos-border border-dashed rounded-2xl bg-cosmos-surface/50">
            <Sparkles size={48} className="text-cosmos-muted mb-4" />
            <h2 className="font-display font-semibold text-cosmos-text text-xl m-0 mb-2">
              {hasSearch ? "No hay resultados" : "Aún no hay productos"}
            </h2>
            <p className="text-cosmos-muted m-0 max-w-md">
              {hasSearch
                ? "Probá con otros términos o quitá el filtro de búsqueda."
                : "Cuando haya productos publicados, los encontrarás aquí."}
            </p>
          </div>
        )}
        {!loading && !isEmpty && (
          <section className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => {
              const productUrl =
                product.sellerStoreSlug && product.slug
                  ? `/tienda/${product.sellerStoreSlug}/producto/${product.slug}`
                  : `/producto/${product.id}`;
              const storeLink =
                product.sellerStoreSlug
                  ? `/tienda/${product.sellerStoreSlug}`
                  : null;
              return (
                <div key={product.id} className="group block bg-cosmos-surface border border-cosmos-border text-cosmos-text rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-cosmos-accent/40 hover:shadow-xl hover:shadow-cosmos-accent/5">
                  <Link to={productUrl} className="block">
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
                  {storeLink && (
                    <div className="px-5 pb-4 pt-0">
                      <Link
                        to={storeLink}
                        className="text-xs text-cosmos-accent hover:underline"
                      >
                        Ver más de {product.sellerStoreName}
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        )}
      </div>
    </div>
  );
}
