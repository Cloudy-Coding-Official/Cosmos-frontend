import { Link } from "react-router-dom";
import { Users, Store, Package, ClipboardList, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import {
  getProviderRetailerStores,
  type ProviderRetailerStore,
} from "../../api/providers";
import { getErrorMessage } from "../../api/client";

export function ProveedoresRetailers() {
  const [stores, setStores] = useState<ProviderRetailerStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedStoreId, setExpandedStoreId] = useState<string | null>(null);

  useEffect(() => {
    getProviderRetailerStores()
      .then(setStores)
      .catch((err) => setError(getErrorMessage(err, "Error al cargar tiendas")))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <nav className="flex items-center gap-2 text-sm text-cosmos-muted mb-8">
          <Link to="/proveedores" className="hover:text-cosmos-accent">
            Proveedores
          </Link>
          <span>/</span>
          <span className="text-cosmos-text">Retailers</span>
        </nav>

        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-cosmos-accent-soft flex items-center justify-center shrink-0">
            <Users size={24} className="text-cosmos-accent" />
          </div>
          <div>
            <h1 className="font-display font-semibold text-cosmos-text text-2xl m-0 mb-1">
              Tiendas con mis productos
            </h1>
            <p className="text-cosmos-muted text-sm m-0">
              Retailers que añadieron tus productos a su tienda. Administrá los pedidos de cada uno.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-cosmos-muted">Cargando tiendas…</p>
        ) : stores.length === 0 ? (
          <div className="p-8 bg-cosmos-surface border border-cosmos-border rounded-2xl text-center">
            <Store size={40} className="text-cosmos-muted mx-auto mb-4" />
            <p className="text-cosmos-muted m-0">
              Aún no hay tiendas con tus productos. Cuando un retailer agregue productos tuyos a su tienda, aparecerán acá.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {stores.map((s) => {
              const isExpanded = expandedStoreId === s.storeId;
              const hasProducts = s.products && s.products.length > 0;
              return (
                <div
                  key={s.storeId}
                  className="p-4 bg-cosmos-surface border border-cosmos-border rounded-xl"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-cosmos-accent/10 flex items-center justify-center shrink-0">
                        <Store size={20} className="text-cosmos-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-cosmos-text m-0">{s.storeName}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-cosmos-muted">
                          <span className="inline-flex items-center gap-1">
                            <Package size={14} />
                            {s.productCount} producto{s.productCount !== 1 ? "s" : ""} en su tienda
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 font-medium ${
                              s.orderCount > 0 ? "text-cosmos-accent" : ""
                            }`}
                          >
                            {s.orderCount} pedido{s.orderCount !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasProducts && (
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedStoreId(isExpanded ? null : s.storeId)
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-cosmos-muted border border-cosmos-border rounded-lg hover:bg-cosmos-surface-elevated transition-colors"
                        >
                          {isExpanded ? (
                            <>
                              Ocultar productos <ChevronUp size={16} />
                            </>
                          ) : (
                            <>
                              Ver productos <ChevronDown size={16} />
                            </>
                          )}
                        </button>
                      )}
                      <Link
                        to={`/proveedores/retailers/${s.storeId}`}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-cosmos-accent-soft text-cosmos-accent border border-cosmos-accent/30 rounded-lg hover:bg-cosmos-accent/20 transition-colors"
                      >
                        <ClipboardList size={16} />
                        Administrar pedidos
                      </Link>
                    </div>
                  </div>
                  {isExpanded && hasProducts && (
                    <div className="mt-4 pt-4 border-t border-cosmos-border">
                      <p className="text-xs font-medium uppercase tracking-wider text-cosmos-muted mb-2 m-0">
                        Productos que tiene esta tienda
                      </p>
                      <ul className="list-none m-0 p-0 space-y-1.5">
                        {s.products.map((p) => (
                          <li
                            key={p.productId}
                            className="flex items-center gap-2 text-sm text-cosmos-text"
                          >
                            <span className="font-medium">{p.productName}</span>
                            {p.sku && (
                              <span className="text-cosmos-muted">· SKU {p.sku}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
