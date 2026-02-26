import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Store } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getMyStores, createMyStore, type Store as StoreType } from "../../api/storeProducts";
import { getErrorMessage } from "../../api/client";

const inputBase =
  "w-full px-4 py-3 font-sans text-base border border-cosmos-border bg-cosmos-surface-elevated text-cosmos-text placeholder:text-cosmos-muted focus:outline-none focus:border-cosmos-accent focus:ring-1 focus:ring-cosmos-accent rounded-lg transition-colors";

export function RetailerFirstStoreGate() {
  const { refreshUser } = useAuth();
  const [stores, setStores] = useState<StoreType[] | null>(null);
  const [storeName, setStoreName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getMyStores()
      .then((list) => {
        if (!cancelled) setStores(list ?? []);
      })
      .catch(() => {
        if (!cancelled) setStores([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = storeName.trim() || "Mi tienda";
    setError(null);
    setCreating(true);
    try {
      const store = await createMyStore(name);
      setStores([store]);
      await refreshUser();
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo crear la tienda"));
    } finally {
      setCreating(false);
    }
  };

  if (stores === null) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-cosmos-muted">Cargando…</p>
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div className="min-h-screen bg-cosmos-bg py-12 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-cosmos-accent-soft flex items-center justify-center mx-auto mb-6">
            <Store size={32} className="text-cosmos-accent" />
          </div>
          <h1 className="font-display font-semibold text-cosmos-text text-xl md:text-2xl text-center m-0 mb-2">
            Crear mi primera tienda
          </h1>
          <p className="text-cosmos-muted text-sm text-center m-0 mb-8">
            Para usar el panel de retailer necesitás al menos una tienda. Dale un nombre para empezar.
          </p>
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            {error && (
              <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">
                {error}
              </div>
            )}
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium uppercase tracking-wider text-cosmos-muted">
                Nombre de la tienda
              </span>
              <input
                type="text"
                className={inputBase}
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Ej: Mi Tienda"
                disabled={creating}
              />
            </label>
            <button
              type="submit"
              disabled={creating || !storeName.trim()}
              className="w-full px-6 py-3.5 font-medium bg-cosmos-accent text-cosmos-bg rounded-lg hover:bg-cosmos-accent-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {creating ? "Creando…" : "Crear mi tienda"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
