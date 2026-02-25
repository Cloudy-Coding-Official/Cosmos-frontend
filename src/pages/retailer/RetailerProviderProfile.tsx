import { Link, useParams } from "react-router-dom";
import { Building2, MapPin, Package, ArrowLeft, CheckCircle, Plus, Check, Store as StoreIcon, X, Settings2, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { getProviderById, getProviderBySlug, type ProviderProfile } from "../../api/providers";
import {
  getMyStores,
  getMyStoreProducts,
  addProductToStore,
  removeProductFromStore,
  createMyStore,
  type Store,
  type StoreProductItem,
} from "../../api/storeProducts";
import { ProductImage } from "../../components/ProductImage";
import { getErrorMessage } from "../../api/client";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function toNum(v: number | string | null | undefined): number {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  const n = parseFloat(String(v));
  return Number.isFinite(n) ? n : 0;
}

export function RetailerProviderProfile() {
  const { id: providerSlugOrId } = useParams<{ id: string }>();
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [myStores, setMyStores] = useState<Store[]>([]);
  const [myStoreProducts, setMyStoreProducts] = useState<StoreProductItem[]>([]);
  const [addingToStoreId, setAddingToStoreId] = useState<string | null>(null);
  const [removingFromStoreId, setRemovingFromStoreId] = useState<string | null>(null);
  const [creatingStore, setCreatingStore] = useState(false);
  const [manageModal, setManageModal] = useState<{ productId: string; productName: string; suggestedPrice: number } | null>(null);
  const [priceByStoreId, setPriceByStoreId] = useState<Record<string, string>>({});
  const [manageError, setManageError] = useState<string | null>(null);

  useEffect(() => {
    if (!providerSlugOrId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    const fetchProvider = UUID_REGEX.test(providerSlugOrId)
      ? () => getProviderById(providerSlugOrId)
      : () => getProviderBySlug(providerSlugOrId);
    fetchProvider()
      .then((data) => {
        if (!cancelled) setProvider(data ?? null);
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err, "Error al cargar proveedor"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [providerSlugOrId]);

  const loadStoresAndProducts = () => {
    Promise.all([getMyStores(), getMyStoreProducts()])
      .then(([stores, list]) => {
        setMyStores(stores ?? []);
        setMyStoreProducts(Array.isArray(list) ? list : []);
      })
      .catch(() => setMyStores([]));
  };

  useEffect(() => {
    loadStoresAndProducts();
  }, []);

  const handleCreateStore = async () => {
    setCreatingStore(true);
    try {
      await createMyStore("Mi tienda");
      loadStoresAndProducts();
    } catch (err) {
      alert(getErrorMessage(err, "No se pudo crear la tienda"));
    } finally {
      setCreatingStore(false);
    }
  };

  const storeIdsWithProduct = (productId: string) =>
    myStoreProducts.filter((sp) => sp.productId === productId).map((sp) => sp.storeId);

  const getStoreProduct = (productId: string, storeId: string): StoreProductItem | undefined =>
    myStoreProducts.find((sp) => sp.productId === productId && sp.storeId === storeId);

  const openManageModal = (productId: string, productName: string, suggestedPrice: number) => {
    setManageModal({ productId, productName, suggestedPrice });
    const initial: Record<string, string> = {};
    myStores.forEach((s) => {
      initial[s.id] = suggestedPrice > 0 ? String(suggestedPrice) : "";
    });
    setPriceByStoreId(initial);
    setManageError(null);
  };

  const closeManageModal = () => {
    if (!addingToStoreId && !removingFromStoreId) {
      setManageModal(null);
      setPriceByStoreId({});
      setManageError(null);
    }
  };

  const handleAddToStore = async (storeId: string) => {
    if (!manageModal) return;
    const price = parseFloat(priceByStoreId[storeId] ?? "");
    if (!Number.isFinite(price) || price < 0) {
      setManageError("Ingresá un precio válido");
      return;
    }
    setAddingToStoreId(storeId);
    setManageError(null);
    try {
      await addProductToStore(storeId, manageModal.productId, price);
      loadStoresAndProducts();
    } catch (err) {
      setManageError(getErrorMessage(err, "No se pudo agregar el producto"));
    } finally {
      setAddingToStoreId(null);
    }
  };

  const handleRemoveFromStore = async (storeId: string) => {
    if (!manageModal) return;
    setRemovingFromStoreId(storeId);
    setManageError(null);
    try {
      await removeProductFromStore(storeId, manageModal.productId);
      loadStoresAndProducts();
    } catch (err) {
      setManageError(getErrorMessage(err, "No se pudo quitar el producto"));
    } finally {
      setRemovingFromStoreId(null);
    }
  };

  if (!providerSlugOrId) {
    return (
      <div className="min-h-screen bg-cosmos-bg py-8">
        <div className="w-full max-w-[1200px] mx-auto px-6">
          <p className="text-cosmos-muted">Proveedor no especificado.</p>
          <Link to="/retailer/proveedores" className="text-cosmos-accent hover:underline mt-2 inline-block">
            Volver a proveedores
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cosmos-bg py-8">
        <div className="w-full max-w-[1200px] mx-auto px-6">
          <p className="text-cosmos-muted">Cargando perfil del proveedor…</p>
        </div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="min-h-screen bg-cosmos-bg py-8">
        <div className="w-full max-w-[1200px] mx-auto px-6">
          <p className="text-red-500 mb-4">{error ?? "Proveedor no encontrado."}</p>
          <Link to="/retailer/proveedores" className="text-cosmos-accent hover:underline">
            Volver a proveedores
          </Link>
        </div>
      </div>
    );
  }

  const products = provider.products ?? [];

  return (
    <div className="min-h-screen bg-cosmos-bg">
      {/* Header B2B: distinto a /tienda, sin gradientes ni “Explora productos” */}
      <div className="border-b border-cosmos-border bg-cosmos-surface/50">
        <div className="w-full max-w-[1200px] mx-auto px-6 py-6">
          <nav className="flex items-center gap-2 text-sm text-cosmos-muted mb-6">
            <Link to="/retailer" className="hover:text-cosmos-accent transition-colors">Mi tienda</Link>
            <span>/</span>
            <Link to="/retailer/proveedores" className="hover:text-cosmos-accent transition-colors">
              Proveedores
            </Link>
            <span>/</span>
            <span className="text-cosmos-text">Catálogo B2B</span>
          </nav>

          <Link
            to="/retailer/proveedores"
            className="inline-flex items-center gap-2 text-sm text-cosmos-muted hover:text-cosmos-accent mb-6"
          >
            <ArrowLeft size={16} />
            Volver al listado
          </Link>

          <div className="flex flex-wrap items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Building2 size={28} className="text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h1 className="font-display font-semibold text-cosmos-text text-2xl m-0 mb-1 flex items-center gap-2">
                {provider.legalName}
                {provider.verified && (
                  <span className="inline-flex items-center gap-1 text-sm font-normal text-cosmos-accent">
                    <CheckCircle size={16} />
                    Verificado
                  </span>
                )}
              </h1>
              <div className="flex items-center gap-2 text-cosmos-muted">
                <MapPin size={16} />
                <span>País: {provider.country}</span>
              </div>
              <p className="text-sm text-cosmos-muted mt-2 m-0">
                Catálogo mayorista · Solo visible para retailers
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1200px] mx-auto px-6 py-8">
        <h2 className="font-semibold text-cosmos-text text-lg m-0 mb-6 flex items-center gap-2">
          <Package size={20} className="text-cosmos-accent" />
          Productos del proveedor ({products.length})
        </h2>

        {products.length === 0 ? (
          <div className="p-12 border border-dashed border-cosmos-border rounded-xl text-center bg-cosmos-surface/30">
            <Package size={40} className="text-cosmos-muted mx-auto mb-4" />
            <p className="text-cosmos-muted m-0">Este proveedor aún no tiene productos publicados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-cosmos-border">
                  <th className="py-3 pr-4 text-sm font-medium text-cosmos-muted">Producto</th>
                  <th className="py-3 pr-4 text-sm font-medium text-cosmos-muted">SKU</th>
                  <th className="py-3 pr-4 text-sm font-medium text-cosmos-muted">Categoría</th>
                  <th className="py-3 pr-4 text-sm font-medium text-cosmos-muted">Mayorista (US$)</th>
                  <th className="py-3 pr-4 text-sm font-medium text-cosmos-muted">P. sugerido (US$)</th>
                  <th className="py-3 pr-4 text-sm font-medium text-cosmos-muted">Acción</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-cosmos-border/60 hover:bg-cosmos-surface/50 transition-colors"
                  >
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-cosmos-surface-elevated overflow-hidden shrink-0">
                          <ProductImage
                            src={p.imageUrl ?? ""}
                            alt={p.name}
                            className="w-full h-full object-cover"
                            wrapperClassName="w-full h-full"
                          />
                        </div>
                        <span className="font-medium text-cosmos-text">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-sm text-cosmos-muted">{p.sku}</td>
                    <td className="py-4 pr-4 text-sm text-cosmos-muted">{p.category}</td>
                    <td className="py-4 pr-4 text-cosmos-text font-medium">
                      {toNum(p.wholesalePrice).toFixed(2)}
                    </td>
                    <td className="py-4 pr-4 text-cosmos-text">
                      {toNum(p.suggestedPrice).toFixed(2)}
                    </td>
                    <td className="py-4 pr-4">
                      {myStores.length > 0 ? (
                        <button
                          type="button"
                          onClick={() => openManageModal(p.id, p.name, toNum(p.suggestedPrice))}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-cosmos-accent border border-cosmos-accent/50 rounded-lg hover:bg-cosmos-accent/10"
                        >
                          <Settings2 size={14} />
                          Administrar
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleCreateStore}
                          disabled={creatingStore}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-cosmos-accent border border-cosmos-accent/50 rounded-lg hover:bg-cosmos-accent/10 disabled:opacity-50"
                        >
                          <Plus size={14} />
                          {creatingStore ? "Creando…" : "Crear mi tienda"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {manageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={closeManageModal}
        >
          <div
            className="bg-cosmos-surface border border-cosmos-border rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display font-semibold text-cosmos-text text-lg m-0">
                Administrar producto
              </h3>
              {!addingToStoreId && !removingFromStoreId && (
                <button
                  type="button"
                  onClick={closeManageModal}
                  className="p-2 rounded-lg text-cosmos-muted hover:bg-cosmos-surface-elevated hover:text-cosmos-text transition-colors"
                  aria-label="Cerrar"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            <p className="text-sm text-cosmos-muted mb-4 truncate" title={manageModal.productName}>
              {manageModal.productName}
            </p>
            {manageError && (
              <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">
                {manageError}
              </div>
            )}
            <div className="space-y-3 overflow-y-auto flex-1 min-h-0">
              {myStores.map((store) => {
                const inStore = storeIdsWithProduct(manageModal.productId).includes(store.id);
                const storeProduct = getStoreProduct(manageModal.productId, store.id);
                const isAdding = addingToStoreId === store.id;
                const isRemoving = removingFromStoreId === store.id;
                const busy = isAdding || isRemoving;
                return (
                  <div
                    key={store.id}
                    className={`flex flex-wrap items-center gap-3 p-3 rounded-xl border ${
                      inStore ? "border-emerald-500/30 bg-emerald-500/5" : "border-cosmos-border bg-cosmos-surface-elevated"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-cosmos-accent/10 flex items-center justify-center shrink-0">
                      <StoreIcon size={20} className="text-cosmos-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-cosmos-text m-0 truncate">{store.name}</p>
                      {inStore && storeProduct && (
                        <p className="text-xs text-cosmos-muted m-0">
                          En esta tienda · US$ {toNum(storeProduct.price).toFixed(2)}
                        </p>
                      )}
                    </div>
                    {inStore ? (
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          <Check size={14} />
                          Ya está
                        </span>
                        <Link
                          to={store.slug ? `/retailer/tiendas/${store.slug}/productos` : `/retailer/tiendas`}
                          className="text-xs font-medium text-cosmos-accent hover:underline"
                          onClick={closeManageModal}
                        >
                          Ver en tienda
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleRemoveFromStore(store.id)}
                          disabled={busy}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                          title="Quitar de esta tienda"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 flex-wrap">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={priceByStoreId[store.id] ?? ""}
                          onChange={(e) =>
                            setPriceByStoreId((prev) => ({ ...prev, [store.id]: e.target.value }))
                          }
                          placeholder={String(manageModal.suggestedPrice)}
                          className="w-24 px-2 py-1.5 text-sm border border-cosmos-border bg-cosmos-surface rounded-lg focus:outline-none focus:border-cosmos-accent"
                          disabled={busy}
                        />
                        <span className="text-xs text-cosmos-muted">US$</span>
                        <button
                          type="button"
                          onClick={() => handleAddToStore(store.id)}
                          disabled={busy || !Number.isFinite(parseFloat(priceByStoreId[store.id] ?? "")) || parseFloat(priceByStoreId[store.id] ?? "0") < 0}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-cosmos-accent border border-cosmos-accent/50 rounded-lg hover:bg-cosmos-accent/10 disabled:opacity-50"
                        >
                          {isAdding ? "Agregando…" : "Agregar"}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-4 border-t border-cosmos-border">
              <button
                type="button"
                onClick={closeManageModal}
                disabled={!!addingToStoreId || !!removingFromStoreId}
                className="w-full px-4 py-2.5 font-medium text-cosmos-muted border border-cosmos-border rounded-xl hover:bg-cosmos-surface-elevated transition-colors disabled:opacity-60"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
