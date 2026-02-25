import { Link, useParams, Navigate } from "react-router-dom";
import { Package, Pencil, Check, X, Store, Plus, ArrowRight, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import {
  getMyStores,
  getStoreProductsByStoreSlug,
  getMyPendingRequests,
  updateStoreProductPrice,
  removeProductFromStore,
  type StoreProductItem,
  type StoreProductRequestItem,
  type Store as StoreType,
} from "../../api/storeProducts";
import { getErrorMessage } from "../../api/client";

const inputBase =
  "px-3 py-1.5 text-sm border border-cosmos-border bg-cosmos-surface-elevated text-cosmos-text rounded-lg focus:outline-none focus:border-cosmos-accent focus:ring-1 focus:ring-cosmos-accent w-24";

function toNum(v: number | string | null | undefined): number {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  const n = parseFloat(String(v));
  return Number.isFinite(n) ? n : 0;
}

export function RetailerStoreProducts() {
  const { storeSlug } = useParams<{ storeSlug: string }>();
  const [store, setStore] = useState<StoreType | null>(null);
  const [storeProducts, setStoreProducts] = useState<StoreProductItem[]>([]);
  const [pendingRequests, setPendingRequests] = useState<StoreProductRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [removingKey, setRemovingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!storeSlug) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([getMyStores(), getStoreProductsByStoreSlug(storeSlug), getMyPendingRequests()])
      .then(([stores, products, pending]) => {
        if (cancelled) return;
        const found = (stores ?? []).find((s) => s.slug === storeSlug || s.id === storeSlug);
        setStore(found ?? null);
        setStoreProducts(Array.isArray(products) ? products : []);
        const storeId = found?.id;
        setPendingRequests(
          storeId && Array.isArray(pending)
            ? pending.filter((r) => r.storeId === storeId)
            : []
        );
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getErrorMessage(err, "Error al cargar"));
          setStore(null);
          setStoreProducts([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [storeSlug]);

  const startEdit = (item: StoreProductItem) => {
    setEditingKey(`${item.storeId}-${item.productId}`);
    setEditPrice(String(toNum(item.price)));
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setEditPrice("");
  };

  const savePrice = async (item: StoreProductItem) => {
    const price = parseFloat(editPrice);
    if (!Number.isFinite(price) || price < 0) {
      setError("Precio inválido");
      return;
    }
    setError(null);
    setSavingKey(`${item.storeId}-${item.productId}`);
    try {
      await updateStoreProductPrice(item.storeId, item.productId, price, item.currency);
      setStoreProducts((prev) =>
        prev.map((p) =>
          p.storeId === item.storeId && p.productId === item.productId
            ? { ...p, price, currency: item.currency }
            : p
        )
      );
      setEditingKey(null);
      setEditPrice("");
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo actualizar el precio"));
    } finally {
      setSavingKey(null);
    }
  };

  const handleRemove = async (item: StoreProductItem) => {
    if (!window.confirm("¿Quitar este producto de la tienda?")) return;
    setError(null);
    const key = `${item.storeId}-${item.productId}`;
    setRemovingKey(key);
    try {
      await removeProductFromStore(item.storeId, item.productId);
      setStoreProducts((prev) => prev.filter((p) => p.storeId !== item.storeId || p.productId !== item.productId));
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo quitar el producto"));
    } finally {
      setRemovingKey(null);
    }
  };

  if (!storeSlug) {
    return <Navigate to="/retailer/tiendas" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
        <div className="w-full max-w-[1200px] mx-auto px-6">
          <p className="text-cosmos-muted">Cargando…</p>
        </div>
      </div>
    );
  }

  if (error && !store) {
    return (
      <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
        <div className="w-full max-w-[1200px] mx-auto px-6">
          <p className="text-red-500 mb-4">{error}</p>
          <Link to="/retailer/tiendas" className="text-cosmos-accent hover:underline">
            Volver a mis tiendas
          </Link>
        </div>
      </div>
    );
  }

  const storeName = store?.name ?? "Tienda";

  return (
    <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <nav className="flex items-center gap-2 text-sm text-cosmos-muted mb-4">
          <Link to="/retailer" className="hover:text-cosmos-accent transition-colors">
            Mi tienda
          </Link>
          <span>/</span>
          <Link to="/retailer/tiendas" className="hover:text-cosmos-accent transition-colors">
            Mis tiendas
          </Link>
          <span>/</span>
          <span className="text-cosmos-text">{storeName}</span>
          <span>/</span>
          <span className="text-cosmos-text">Productos</span>
        </nav>

        <div className="flex flex-wrap items-center gap-3 mb-6 p-4 rounded-xl bg-cosmos-surface border border-cosmos-border">
          <div className="w-10 h-10 rounded-lg bg-cosmos-accent-soft flex items-center justify-center shrink-0">
            <Store size={20} className="text-cosmos-accent" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-cosmos-muted m-0">
              Estás en
            </p>
            <p className="font-display font-semibold text-cosmos-text text-lg m-0">
              {storeName}
            </p>
          </div>
        </div>

        <h1 className="font-display font-semibold text-cosmos-text text-2xl md:text-3xl m-0 mb-2">
          Productos de esta tienda
        </h1>
        <p className="text-cosmos-muted m-0 mb-6">
          Productos que agregaste de proveedores. Podés cambiar el precio de venta cuando quieras.
        </p>

        <Link
          to="/retailer/proveedores"
          className="group flex items-center gap-4 p-5 mb-8 rounded-2xl border border-cosmos-accent/40 bg-cosmos-accent/5 hover:bg-cosmos-accent/10 transition-colors"
        >
          <div className="w-12 h-12 rounded-xl bg-cosmos-accent-soft flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Plus size={24} className="text-cosmos-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-display font-semibold text-cosmos-text text-lg m-0 mb-0.5">
              Explorar nuevos productos
            </h2>
            <p className="text-sm text-cosmos-muted m-0">
              Agregá productos del catálogo de tus proveedores a esta tienda.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-cosmos-accent shrink-0">
            Ir a proveedores <ArrowRight size={16} />
          </span>
        </Link>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">
            {error}
          </div>
        )}

        {storeProducts.length === 0 && pendingRequests.length === 0 ? (
          <div className="p-8 bg-cosmos-surface border border-cosmos-border rounded-2xl text-center">
            <Package size={40} className="text-cosmos-muted mx-auto mb-4" />
            <p className="text-cosmos-muted m-0 mb-4">
              Aún no hay productos en esta tienda. Agregá productos desde el perfil de un{" "}
              <Link to="/retailer/proveedores" className="text-cosmos-accent hover:underline">
                proveedor
              </Link>
              .
            </p>
            <Link
              to="/retailer/tiendas"
              className="inline-flex items-center gap-2 text-sm font-medium text-cosmos-accent hover:underline"
            >
              Volver a mis tiendas
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-cosmos-border">
                  <th className="py-3 pr-4 text-sm font-medium text-cosmos-muted">Producto</th>
                  <th className="py-3 pr-4 text-sm font-medium text-cosmos-muted">Proveedor</th>
                  <th className="py-3 pr-4 text-sm font-medium text-cosmos-muted">Precio de venta</th>
                  <th className="py-3 pr-4 text-sm font-medium text-cosmos-muted">Acción</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.map((r) => (
                  <tr
                    key={`pending-${r.id}`}
                    className="border-b border-cosmos-border/60 bg-amber-500/5 border-l-2 border-l-amber-500/50"
                  >
                    <td className="py-4 pr-4 font-medium text-cosmos-text">
                      {r.product?.name ?? "—"}
                    </td>
                    <td className="py-4 pr-4 text-sm text-cosmos-muted">
                      {r.product?.provider?.legalName ?? "—"}
                    </td>
                    <td className="py-4 pr-4">
                      <span className="text-amber-600 dark:text-amber-400 font-medium">
                        US$ {toNum(r.requestedPrice).toFixed(2)} (solicitado)
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                        Pendiente de aprobación
                      </span>
                    </td>
                  </tr>
                ))}
                {storeProducts.map((item) => {
                  const key = `${item.storeId}-${item.productId}`;
                  const isEditing = editingKey === key;
                  const isSaving = savingKey === key;
                  const isRemoving = removingKey === key;
                  const busy = isSaving || isRemoving;
                  return (
                    <tr
                      key={key}
                      className="border-b border-cosmos-border/60 hover:bg-cosmos-surface/50 transition-colors"
                    >
                      <td className="py-4 pr-4 font-medium text-cosmos-text">
                        {item.product?.name ?? "—"}
                      </td>
                      <td className="py-4 pr-4 text-sm text-cosmos-muted">
                        {item.product?.provider?.legalName ?? "—"}
                      </td>
                      <td className="py-4 pr-4">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-cosmos-muted">
                              {item.currency === "USD" ? "US$" : item.currency}{" "}
                            </span>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                              className={inputBase}
                              disabled={isSaving}
                            />
                            <button
                              type="button"
                              onClick={() => savePrice(item)}
                              disabled={isSaving}
                              className="p-1.5 rounded-lg text-cosmos-accent hover:bg-cosmos-accent/10 transition-colors disabled:opacity-50"
                              title="Guardar"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              type="button"
                              onClick={cancelEdit}
                              disabled={isSaving}
                              className="p-1.5 rounded-lg text-cosmos-muted hover:bg-cosmos-surface-elevated transition-colors disabled:opacity-50"
                              title="Cancelar"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-cosmos-text font-medium">
                            {item.currency === "USD" ? "US$" : ""}
                            {toNum(item.price).toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td className="py-4 pr-4">
                        {!isEditing && (
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => startEdit(item)}
                              disabled={busy}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-cosmos-accent border border-cosmos-accent/50 rounded-lg hover:bg-cosmos-accent/10 disabled:opacity-50"
                            >
                              <Pencil size={14} />
                              Modificar precio
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemove(item)}
                              disabled={busy}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-500 border border-red-500/30 rounded-lg hover:bg-red-500/10 disabled:opacity-50"
                              title="Quitar de la tienda"
                            >
                              <Trash2 size={14} />
                              {isRemoving ? "Quitando…" : "Quitar"}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
