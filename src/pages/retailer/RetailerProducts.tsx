import { Link } from "react-router-dom";
import { Upload, Package, ArrowRight, Plus, Pencil, Check, X, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import {
  getMyStoreProducts,
  updateStoreProductPrice,
  removeProductFromStore,
  type StoreProductItem,
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

export function RetailerProducts() {
  const [storeProducts, setStoreProducts] = useState<StoreProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [removingKey, setRemovingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = () => {
    setLoading(true);
    getMyStoreProducts()
      .then(setStoreProducts)
      .catch(() => setStoreProducts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

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

  return (
    <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <nav className="flex items-center gap-2 text-sm text-cosmos-muted mb-6">
          <Link to="/retailer" className="hover:text-cosmos-accent transition-colors">Mi tienda</Link>
          <span>/</span>
          <span className="text-cosmos-text">Productos</span>
        </nav>

        <h1 className="font-display font-semibold text-cosmos-text text-2xl md:text-3xl m-0 mb-2">
          Mis productos
        </h1>
        <p className="text-cosmos-muted m-0 mb-10">
          Productos en tu tienda y del catálogo de proveedores.
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
          <h3 className="font-display font-semibold text-cosmos-text m-0 mb-2">Productos en mi tienda</h3>
          <p className="text-sm text-cosmos-muted m-0 mb-4">
            Productos que agregaste de proveedores. Podés cambiar el precio de venta cuando quieras.
          </p>
          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">
              {error}
            </div>
          )}
          {loading ? (
            <p className="text-cosmos-muted text-sm m-0">Cargando…</p>
          ) : storeProducts.length === 0 ? (
            <p className="text-cosmos-muted text-sm m-0">
              Aún no tenés productos. Agregá productos desde el perfil de un{" "}
              <Link to="/retailer/proveedores" className="text-cosmos-accent hover:underline">
                proveedor
              </Link>
              .
            </p>
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
    </div>
  );
}
