import { useParams, Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Shield, Truck, Star, Check, Store, Building2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getProductById, getProductBySlug, type Product } from "../../api/products";
import { ProductImage } from "../../components/ProductImage";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const defaultSpecs = [
  { label: "Incluye", value: "—" },
];

export function Product() {
  const { id, storeSlug, productSlug } = useParams<{ id?: string; storeSlug?: string; productSlug?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addItem } = useCart();
  const isRetailer = user?.hasStoreProfile ?? false;
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchKey = productSlug ? productSlug : id;

  useEffect(() => {
    if (!fetchKey) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    const fetchProduct = productSlug
      ? () => getProductBySlug(productSlug, storeSlug)
      : () => getProductById(fetchKey);
    fetchProduct()
      .then((p) => {
        if (!cancelled) setProduct(p ?? null);
      })
      .catch(() => {
        if (!cancelled) setError("Error al cargar el producto");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [fetchKey, productSlug, storeSlug]);

  const specs = product?.specs?.length ? product.specs : defaultSpecs;
  const total = product ? product.price * quantity : 0;
  const sellerStoreSlug = storeSlug ?? product?.sellerStoreSlug;
  const sellerStoreName = product?.sellerStoreName;
  const providerId = product?.providerId;
  const providerName = product?.providerName;
  const providerSlug = product?.providerSlug;
  // const storeListUrl = storeSlug ? `/tienda/${storeSlug}` : "/tienda";

  if (loading) {
    return (
      <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
        <div className="w-full max-w-[1200px] mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="skeleton-shimmer aspect-square w-full rounded-2xl bg-cosmos-surface-elevated" aria-hidden />
            <div className="space-y-4">
              <div className="skeleton-shimmer rounded h-8 w-3/4 bg-cosmos-surface-elevated" aria-hidden />
              <div className="skeleton-shimmer rounded h-5 w-24 bg-cosmos-surface-elevated" aria-hidden />
              <div className="skeleton-shimmer rounded h-4 w-full bg-cosmos-surface-elevated" aria-hidden />
              <div className="skeleton-shimmer rounded h-4 w-2/3 bg-cosmos-surface-elevated" aria-hidden />
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (error || !product) {
    return (
      <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
        <div className="w-full max-w-[1200px] mx-auto px-6">
          <p className="text-cosmos-muted mb-4">{error ?? "Producto no encontrado."}</p>
          <Link to={storeSlug ? `/tienda/${storeSlug}` : "/tienda"} className="text-cosmos-accent hover:underline">Volver a la tienda</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <nav className="flex items-center gap-2 text-sm text-cosmos-muted mb-8">
          <Link to="/" className="hover:text-cosmos-accent transition-colors">Inicio</Link>
          <span>/</span>
          <Link to="/tienda" className="hover:text-cosmos-accent transition-colors">Tienda</Link>
          {sellerStoreSlug && (
            <>
              <span>/</span>
              <Link to={`/tienda/${sellerStoreSlug}`} className="hover:text-cosmos-accent transition-colors">{sellerStoreName ?? "Tienda"}</Link>
            </>
          )}
          <span>/</span>
          <span className="text-cosmos-text line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-cosmos-surface-elevated to-cosmos-surface rounded-2xl overflow-hidden border border-cosmos-border max-h-[520px] relative">
              <ProductImage
                src={product.image}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover"
                wrapperClassName="absolute inset-0 rounded-2xl"
              />
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-cosmos-accent/90 rounded-lg">
                <Shield size={16} className="text-white" />
                <span className="text-sm font-medium text-white">Protegido por Cosmos</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              {sellerStoreSlug && sellerStoreName ? (
                <Link
                  to={`/tienda/${sellerStoreSlug}`}
                  className="inline-flex items-center gap-2 text-sm text-cosmos-accent hover:underline"
                >
                  <Store size={16} />
                  Vendido por {sellerStoreName}
                </Link>
              ) : (
                <p className="text-xs font-medium uppercase tracking-wider text-cosmos-muted m-0">
                  {product.seller}
                </p>
              )}
              {(providerId || providerSlug) && providerName && (
                <span className="text-cosmos-muted text-sm">
                  {isRetailer ? (
                    <Link
                      to={`/retailer/proveedores/${providerSlug ?? providerId}`}
                      className="inline-flex items-center gap-1.5 text-cosmos-accent hover:underline"
                    >
                      <Building2 size={14} />
                      Proveedor: {providerName}
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-1.5">
                      <Building2 size={14} />
                      Proveedor: {providerName}
                    </span>
                  )}
                </span>
              )}
            </div>
            <h1 className="font-display font-semibold text-cosmos-text text-2xl md:text-3xl m-0 mb-3 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                <Star size={18} className="text-amber-400 fill-amber-400" />
                <span className="font-medium text-cosmos-text">{product.rating}</span>
              </div>
              <span className="text-cosmos-muted">
                ({product.reviews ?? 0} valoraciones)
              </span>
            </div>

            <p className="text-2xl font-bold text-cosmos-text m-0 mb-6">
              US$ {product.price.toFixed(2)}
            </p>

            <p className="text-cosmos-muted leading-relaxed mb-6">
              {product.description ?? `${product.name} de ${product.seller}. Calidad garantizada.`}
            </p>

            {product.highlights && product.highlights.length > 0 && (
              <ul className="space-y-2 mb-6">
                {product.highlights.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-cosmos-text">
                    <span className="w-5 h-5 rounded-full bg-cosmos-accent-soft flex items-center justify-center shrink-0">
                      <Check size={12} className="text-cosmos-accent" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            )}

            <div className="flex flex-wrap gap-3 mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2.5 bg-cosmos-surface rounded-xl border border-cosmos-border">
                <Shield size={18} className="text-cosmos-accent shrink-0" />
                Protección al comprador
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2.5 bg-cosmos-surface rounded-xl border border-cosmos-border">
                <Truck size={18} className="text-cosmos-accent shrink-0" />
                Envío coordinado por Cosmos
              </span>
            </div>

            <div className="flex flex-wrap items-end gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wider text-cosmos-muted">
                  Cantidad
                </span>
                <select
                  className="w-24 px-4 py-3 font-sans text-base border border-cosmos-border bg-cosmos-surface-elevated text-cosmos-text focus:outline-none focus:border-cosmos-accent focus:ring-2 focus:ring-cosmos-accent/20 rounded-xl transition-all"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </label>
              {product.sellerStoreId && product.providerId ? (
                <button
                  type="button"
                  onClick={() => {
                    addItem({
                      productId: product.id,
                      storeId: product.sellerStoreId!,
                      providerId: product.providerId!,
                      quantity,
                      name: product.name,
                      price: product.price,
                      image: product.image,
                      productSlug: product.slug,
                      storeSlug: product.sellerStoreSlug,
                      currency: "USD",
                    });
                    setAddedToCart(true);
                    setTimeout(() => setAddedToCart(false), 2000);
                    navigate("/carrito");
                  }}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold bg-cosmos-accent text-cosmos-bg border-0 rounded-xl hover:bg-cosmos-accent-hover transition-all shadow-lg shadow-cosmos-accent/20 hover:shadow-xl hover:shadow-cosmos-accent/25"
                >
                  <ShoppingCart size={22} />
                  {addedToCart ? "Añadido" : `Agregar al carrito — US$ ${total.toFixed(2)}`}
                </button>
              ) : (
                <span className="inline-flex items-center gap-2 px-6 py-3 text-cosmos-muted border border-cosmos-border rounded-xl">
                  Este producto no está disponible para compra en este momento.
                </span>
              )}
            </div>
          </div>
        </div>

        <section className="mt-16 pt-12 border-t border-cosmos-border">
          <h2 className="font-display font-semibold text-cosmos-text text-xl m-0 mb-6">
            Especificaciones
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {specs.map((s) => (
              <div
                key={s.label}
                className="flex justify-between items-baseline gap-4 py-3 px-4 bg-cosmos-surface rounded-xl border border-cosmos-border"
              >
                <span className="text-sm text-cosmos-muted">{s.label}</span>
                <span className="text-cosmos-text font-medium text-right">{s.value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
