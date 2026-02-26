import { Link } from "react-router-dom";
import { ShieldCheck, Store, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import {
  getProviderWhitelistedStores,
  removeProviderWhitelistedStore,
  type ProviderWhitelistedStore,
} from "../../api/providers";
import { getErrorMessage } from "../../api/client";

export function ProveedoresTiendasAutorizadas() {
  const [list, setList] = useState<ProviderWhitelistedStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const load = () => {
    getProviderWhitelistedStores()
      .then(setList)
      .catch((err) => setError(getErrorMessage(err, "Error al cargar")))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleRemove = async (storeId: string) => {
    if (!window.confirm("¿Quitar esta tienda de la lista? A partir de ahora tendrán que solicitar acceso por cada producto.")) return;
    setError(null);
    setRemovingId(storeId);
    try {
      await removeProviderWhitelistedStore(storeId);
      setList((prev) => prev.filter((w) => w.storeId !== storeId));
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo quitar"));
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <nav className="flex items-center gap-2 text-sm text-cosmos-muted mb-8">
          <Link to="/proveedores" className="hover:text-cosmos-accent">
            Proveedores
          </Link>
          <span>/</span>
          <span className="text-cosmos-text">Tiendas autorizadas</span>
        </nav>

        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
            <ShieldCheck size={24} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="font-display font-semibold text-cosmos-text text-2xl m-0 mb-1">
              Tiendas autorizadas
            </h1>
            <p className="text-cosmos-muted text-sm m-0">
              Estas tiendas pueden añadir cualquier producto tuyo sin solicitar acceso cada vez. Podés quitarlas cuando quieras.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 bg-cosmos-surface border border-cosmos-border rounded-xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="skeleton-shimmer w-10 h-10 rounded-lg bg-cosmos-surface-elevated shrink-0" aria-hidden />
                  <div className="space-y-2">
                    <div className="skeleton-shimmer rounded h-4 w-32 bg-cosmos-surface-elevated" aria-hidden />
                    <div className="skeleton-shimmer rounded h-3 w-48 bg-cosmos-surface-elevated" aria-hidden />
                  </div>
                </div>
                <div className="skeleton-shimmer rounded h-9 w-20 bg-cosmos-surface-elevated shrink-0" aria-hidden />
              </div>
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="p-8 bg-cosmos-surface border border-cosmos-border rounded-2xl text-center">
            <ShieldCheck size={40} className="text-cosmos-muted mx-auto mb-4" />
            <p className="text-cosmos-muted m-0 mb-2">
              Aún no tenés tiendas autorizadas.
            </p>
            <p className="text-sm text-cosmos-muted m-0">
              Cuando apruebes una solicitud con &quot;Aprobar y autorizar todos los productos&quot;, la tienda aparecerá acá.
            </p>
            <Link
              to="/proveedores/solicitudes"
              className="inline-block mt-4 text-sm font-medium text-cosmos-accent hover:underline"
            >
              Ver solicitudes pendientes
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {list.map((w) => (
              <div
                key={w.id}
                className="p-4 bg-cosmos-surface border border-cosmos-border rounded-xl flex flex-wrap items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Store size={20} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-medium text-cosmos-text m-0">{w.store?.name ?? "Tienda"}</p>
                    <p className="text-xs text-cosmos-muted m-0">
                      Puede añadir cualquier producto sin solicitar
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(w.storeId)}
                  disabled={removingId === w.storeId}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10 border border-red-500/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Quitar de autorizadas"
                >
                  <Trash2 size={16} />
                  {removingId === w.storeId ? "Quitando…" : "Quitar"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
