import { Link } from "react-router-dom";
import { ClipboardCheck, Check, X } from "lucide-react";
import { useState, useEffect } from "react";
import {
  getProviderStoreRequests,
  approveProviderStoreRequest,
  rejectProviderStoreRequest,
  type ProviderStoreRequestItem,
} from "../../api/providers";
import { getErrorMessage } from "../../api/client";
import { ProductImage } from "../../components/ProductImage";

function toNum(v: number | string | null | undefined): number {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  const n = parseFloat(String(v));
  return Number.isFinite(n) ? n : 0;
}

export function ProveedoresSolicitudes() {
  const [requests, setRequests] = useState<ProviderStoreRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);

  const load = () => {
    getProviderStoreRequests()
      .then(setRequests)
      .catch((err) => setError(getErrorMessage(err, "Error al cargar solicitudes")))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleApprove = async (requestId: string, whitelist: boolean) => {
    setActingId(requestId);
    setError(null);
    try {
      await approveProviderStoreRequest(requestId, { whitelist });
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo aprobar"));
    } finally {
      setActingId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    setActingId(requestId);
    setError(null);
    try {
      await rejectProviderStoreRequest(requestId);
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo rechazar"));
    } finally {
      setActingId(null);
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
          <span className="text-cosmos-text">Solicitudes de tiendas</span>
        </nav>

        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-cosmos-accent-soft flex items-center justify-center shrink-0">
            <ClipboardCheck size={24} className="text-cosmos-accent" />
          </div>
          <div>
            <h1 className="font-display font-semibold text-cosmos-text text-2xl m-0 mb-1">
              Solicitudes de tiendas
            </h1>
            <p className="text-cosmos-muted text-sm m-0">
              Tiendas que quieren vender tus productos. Aprobá o rechazá cada solicitud.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 bg-cosmos-surface border border-cosmos-border rounded-xl flex flex-wrap items-center gap-4">
                <div className="skeleton-shimmer w-14 h-14 rounded-lg bg-cosmos-surface-elevated shrink-0" aria-hidden />
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="skeleton-shimmer rounded h-4 w-48 bg-cosmos-surface-elevated" aria-hidden />
                  <div className="skeleton-shimmer rounded h-3 w-36 bg-cosmos-surface-elevated" aria-hidden />
                </div>
                <div className="flex gap-2">
                  <div className="skeleton-shimmer rounded h-9 w-40 bg-cosmos-surface-elevated" aria-hidden />
                  <div className="skeleton-shimmer rounded h-9 w-48 bg-cosmos-surface-elevated" aria-hidden />
                </div>
              </div>
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="p-8 bg-cosmos-surface border border-cosmos-border rounded-2xl text-center">
            <ClipboardCheck size={40} className="text-cosmos-muted mx-auto mb-4" />
            <p className="text-cosmos-muted m-0">
              No hay solicitudes pendientes. Cuando un retailer solicite acceso a tus productos, aparecerán acá.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((r) => {
              const busy = actingId === r.id;
              return (
                <div
                  key={r.id}
                  className="p-4 bg-cosmos-surface border border-cosmos-border rounded-xl flex flex-wrap items-center gap-4"
                >
                  <div className="w-14 h-14 rounded-lg bg-cosmos-surface-elevated overflow-hidden shrink-0">
                    <ProductImage
                      src={r.product?.imageUrl ?? ""}
                      alt={r.product?.name ?? ""}
                      className="w-full h-full object-cover"
                      wrapperClassName="w-full h-full"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-cosmos-text m-0 truncate">
                      {r.product?.name ?? "Producto"}
                    </p>
                    <p className="text-sm text-cosmos-muted m-0">
                      {r.product?.sku ?? ""} · Tienda: <strong>{r.store?.name ?? ""}</strong>
                    </p>
                    <p className="text-sm text-cosmos-muted mt-1 m-0">
                      Precio solicitado: {r.currency} {toNum(r.requestedPrice).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleApprove(r.id, false)}
                      disabled={busy}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Solo este producto"
                    >
                      <Check size={16} />
                      Aprobar solo este producto
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApprove(r.id, true)}
                      disabled={busy}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-emerald-700 bg-emerald-100 dark:bg-emerald-900/40 hover:bg-emerald-200 dark:hover:bg-emerald-900/60 rounded-lg border border-emerald-500/30 disabled:opacity-50"
                      title="Esta tienda podrá añadir cualquier producto tuyo sin solicitar"
                    >
                      <Check size={16} />
                      Aprobar y autorizar todos los productos
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(r.id)}
                      disabled={busy}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-500/10 border border-red-500/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <X size={16} />
                      Rechazar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
