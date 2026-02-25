import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Trash2, ShoppingBag, Shield, Loader2 } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { ProductImage } from "../../components/ProductImage";

function productLink(item: { productId: string; productSlug?: string; storeSlug?: string }): string {
  if (item.storeSlug && item.productSlug) {
    return `/tienda/${item.storeSlug}/producto/${item.productSlug}`;
  }
  return `/producto/${item.productId}`;
}

export function Cart() {
  const { items, isValidating, refreshCart, removeItem, updateQuantity, subtotal, fee, total, itemCount } = useCart();
  const currency = items[0]?.currency ?? "USD";
  const hasRefreshed = useRef(false);

  useEffect(() => {
    if (items.length > 0 && !hasRefreshed.current) {
      hasRefreshed.current = true;
      refreshCart();
    }
    if (items.length === 0) {
      hasRefreshed.current = false;
    }
  }, [items.length, refreshCart]);

  if (items.length === 0 && !isValidating) {
    return (
      <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
        <div className="w-full max-w-[1200px] mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-cosmos-accent-soft flex items-center justify-center">
              <ShoppingBag size={24} className="text-cosmos-accent" />
            </div>
            <div>
              <h1 className="font-display font-semibold text-cosmos-text text-2xl md:text-3xl m-0">
                Tu carrito
              </h1>
              <p className="text-cosmos-muted text-sm m-0">Tu carrito está vacío</p>
            </div>
          </div>
          <div className="p-12 bg-cosmos-surface border border-cosmos-border rounded-2xl text-center">
            <ShoppingBag size={48} className="text-cosmos-muted mx-auto mb-4" />
            <p className="text-cosmos-muted m-0 mb-6">Agregá productos desde la tienda para continuar.</p>
            <Link
              to="/tienda"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 font-semibold bg-cosmos-accent text-cosmos-bg rounded-xl hover:bg-cosmos-accent-hover transition-colors"
            >
              Ir a la tienda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-cosmos-accent-soft flex items-center justify-center">
            <ShoppingBag size={24} className="text-cosmos-accent" />
          </div>
          <div>
            <h1 className="font-display font-semibold text-cosmos-text text-2xl md:text-3xl m-0">
              Tu carrito
            </h1>
            <p className="text-cosmos-muted text-sm m-0">
              {isValidating ? "Actualizando precios y disponibilidad…" : `${itemCount} ${itemCount === 1 ? "producto" : "productos"}`}
            </p>
          </div>
        </div>

        {isValidating && (
          <div className="mb-6 flex items-center gap-2 text-sm text-cosmos-muted">
            <Loader2 size={18} className="animate-spin shrink-0" />
            <span>Verificando productos y precios actuales…</span>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <article
                key={`${item.productId}-${item.storeId}`}
                className="flex flex-wrap gap-5 p-6 bg-cosmos-surface border border-cosmos-border text-cosmos-text rounded-2xl hover:border-cosmos-border-strong transition-colors"
              >
                <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-cosmos-surface-elevated">
                  <ProductImage
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    wrapperClassName="w-full h-full"
                  />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <Link
                    to={productLink(item)}
                    className="font-semibold text-cosmos-text hover:text-cosmos-accent block mb-1 transition-colors"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-cosmos-muted m-0 mb-3">
                    {currency} {item.price.toFixed(2)} × {item.quantity}
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <select
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.productId, item.storeId, Number(e.target.value))
                      }
                      className="w-20 px-2 py-1.5 text-sm border border-cosmos-border bg-cosmos-surface-elevated text-cosmos-text rounded-lg focus:outline-none focus:border-cosmos-accent"
                      aria-label="Cantidad"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId, item.storeId)}
                      className="inline-flex items-center gap-2 text-sm text-cosmos-muted hover:text-red-400 transition-colors"
                      aria-label="Quitar"
                    >
                      <Trash2 size={18} />
                      Quitar
                    </button>
                  </div>
                </div>
                <div className="font-semibold text-cosmos-text text-lg">
                  {currency} {(item.price * item.quantity).toFixed(2)}
                </div>
              </article>
            ))}
          </div>

          <aside className="h-fit">
            <div className="sticky top-24 p-6 bg-cosmos-surface border border-cosmos-border rounded-2xl">
              <div className="flex items-center gap-2 mb-6">
                <Shield size={20} className="text-cosmos-accent" />
                <h2 className="font-semibold text-lg text-cosmos-text m-0">Resumen</h2>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm py-2">
                  <span className="text-cosmos-muted">Subtotal</span>
                  <span className="text-cosmos-text">{currency} {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm py-2">
                  <span className="text-cosmos-muted">Servicio</span>
                  <span className="text-cosmos-text">{currency} {fee.toFixed(2)}</span>
                </div>
                <div className="h-px bg-cosmos-border my-2" />
                <div className="flex justify-between font-semibold py-2 text-lg text-cosmos-text">
                  <span>Total</span>
                  <span>{currency} {total.toFixed(2)}</span>
                </div>
              </div>
              <Link
                to="/checkout"
                className="block w-full text-center px-6 py-4 font-semibold bg-cosmos-accent text-cosmos-bg border-0 rounded-xl hover:bg-cosmos-accent-hover transition-all shadow-lg shadow-cosmos-accent/20"
              >
                Ir a pagar
              </Link>
              <Link
                to="/tienda"
                className="block text-center text-sm text-cosmos-accent mt-4 hover:text-cosmos-accent-hover transition-colors"
              >
                Seguir comprando
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
