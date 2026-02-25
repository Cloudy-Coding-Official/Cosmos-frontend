import { Link } from "react-router-dom";
import { Store, Plus, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { getMyStores, createMyStore, type Store as StoreType } from "../../api/storeProducts";
import { getErrorMessage } from "../../api/client";

const inputBase =
  "w-full px-4 py-3 font-sans text-base border border-cosmos-border bg-cosmos-surface-elevated text-cosmos-text placeholder:text-cosmos-muted focus:outline-none focus:border-cosmos-accent focus:ring-1 focus:ring-cosmos-accent rounded-lg transition-colors";

export function RetailerStores() {
  const [stores, setStores] = useState<StoreType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewStore, setShowNewStore] = useState(false);
  const [newStoreName, setNewStoreName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const loadStores = () => {
    setError(null);
    setLoading(true);
    getMyStores()
      .then((list) => setStores(list ?? []))
      .catch((err) => setError(getErrorMessage(err, "Error al cargar tiendas")))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStores();
  }, []);

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newStoreName.trim() || "Mi tienda";
    setCreateError(null);
    setCreating(true);
    try {
      await createMyStore(name);
      setNewStoreName("");
      setShowNewStore(false);
      loadStores();
    } catch (err) {
      setCreateError(getErrorMessage(err, "No se pudo crear la tienda"));
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <nav className="flex items-center gap-2 text-sm text-cosmos-muted mb-6">
          <Link to="/retailer" className="hover:text-cosmos-accent transition-colors">
            Mi tienda
          </Link>
          <span>/</span>
          <span className="text-cosmos-text">Mis tiendas</span>
        </nav>

        <h1 className="font-display font-semibold text-cosmos-text text-2xl md:text-3xl m-0 mb-2">
          Mis tiendas
        </h1>
        <p className="text-cosmos-muted m-0 mb-10">
          Gestioná varios perfiles de tienda. Cada una tiene su propio catálogo en la tienda pública.
        </p>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-cosmos-muted">Cargando tiendas…</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stores.map((store) => (
              <div
                key={store.id}
                className="p-6 bg-cosmos-surface border border-cosmos-border rounded-2xl hover:border-cosmos-accent/40 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-cosmos-accent-soft flex items-center justify-center mb-4">
                  <Store size={24} className="text-cosmos-accent" />
                </div>
                <h3 className="font-display font-semibold text-cosmos-text text-lg m-0 mb-1">
                  {store.name}
                </h3>
                <p className="text-sm text-cosmos-muted m-0 mb-2 flex items-center gap-1.5">
                  <Package size={14} />
                  {store._count?.storeProducts ?? 0} producto{(store._count?.storeProducts ?? 0) !== 1 ? "s" : ""}
                </p>
                <span
                  className={`inline-block px-3 py-1 text-xs font-medium rounded-lg ${
                    store.active !== false
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-cosmos-muted/20 text-cosmos-muted"
                  }`}
                >
                  {store.active !== false ? "Activa" : "Inactiva"}
                </span>
                <div className="mt-4 flex flex-col gap-2">
                  <Link
                    to={`/retailer/tiendas/${store.slug ?? store.id}/productos`}
                    className="text-sm font-medium text-cosmos-accent hover:underline"
                  >
                    Ver productos →
                  </Link>
                  <a
                    href={store.slug ? `/tienda/${store.slug}` : `/tienda?store=${store.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-cosmos-muted hover:text-cosmos-accent hover:underline"
                  >
                    Ver en la tienda pública →
                  </a>
                </div>
              </div>
            ))}

            {showNewStore ? (
              <form
                onSubmit={handleCreateStore}
                className="p-6 bg-cosmos-surface border border-cosmos-accent/40 rounded-2xl"
              >
                <label className="flex flex-col gap-1.5 mb-4">
                  <span className="text-xs font-medium uppercase tracking-wider text-cosmos-muted">
                    Nombre de la nueva tienda
                  </span>
                  <input
                    type="text"
                    className={inputBase}
                    value={newStoreName}
                    onChange={(e) => setNewStoreName(e.target.value)}
                    placeholder="Ej: Mi segunda tienda"
                    disabled={creating}
                    autoFocus
                  />
                </label>
                {createError && (
                  <p className="text-sm text-red-400 mb-3">{createError}</p>
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewStore(false);
                      setNewStoreName("");
                      setCreateError(null);
                    }}
                    disabled={creating}
                    className="flex-1 px-4 py-2.5 font-medium text-cosmos-muted border border-cosmos-border rounded-xl hover:bg-cosmos-surface-elevated transition-colors disabled:opacity-60"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={creating || !newStoreName.trim()}
                    className="flex-1 px-4 py-2.5 font-medium bg-cosmos-accent text-cosmos-bg rounded-xl hover:bg-cosmos-accent-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {creating ? "Creando…" : "Crear"}
                  </button>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setShowNewStore(true)}
                className="p-6 border-2 border-dashed border-cosmos-border rounded-2xl hover:border-cosmos-accent/50 hover:bg-cosmos-accent/5 transition-all flex flex-col items-center justify-center gap-3 min-h-[180px]"
              >
                <Plus size={32} className="text-cosmos-muted" />
                <span className="font-medium text-cosmos-muted">Nueva tienda</span>
              </button>
            )}
          </div>
        )}

        {!loading && stores.length === 0 && !showNewStore && (
          <div className="text-center py-12 px-6 bg-cosmos-surface border border-cosmos-border rounded-2xl">
            <Store size={48} className="text-cosmos-muted mx-auto mb-4 opacity-60" />
            <p className="text-cosmos-muted m-0 mb-4">
              Aún no tenés tiendas. Creá la primera para empezar a vender.
            </p>
            <button
              type="button"
              onClick={() => setShowNewStore(true)}
              className="px-6 py-3 font-medium bg-cosmos-accent text-cosmos-bg rounded-xl hover:bg-cosmos-accent-hover transition-colors"
            >
              Crear mi primera tienda
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
