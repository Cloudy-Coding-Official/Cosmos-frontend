import { Link } from "react-router-dom";
import { ClipboardList, Package, Store, Truck, CheckCircle, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { getProviderSales, type ProviderStoreOrder } from "../../api/providers";
import { orderStatusLabel } from "../../api/orders";
import { getErrorMessage } from "../../api/client";
import {
  providerEnsureShipment,
  providerMarkShipped,
  providerMarkDelivered,
} from "../../api/providers";

function toNum(v: string | number | null | undefined): number {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  const n = parseFloat(String(v));
  return Number.isFinite(n) ? n : 0;
}

export function ProveedoresPedidos() {
  const [orders, setOrders] = useState<ProviderStoreOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStoreId, setFilterStoreId] = useState<string | "">("");
  const [actionOrderId, setActionOrderId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const refetch = useCallback(() => {
    getProviderSales()
      .then(setOrders)
      .catch((err) => {
        setError(getErrorMessage(err, "Error al cargar pedidos"));
        setOrders([]);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    getProviderSales()
      .then(setOrders)
      .catch((err) => {
        setError(getErrorMessage(err, "Error al cargar pedidos"));
        setOrders([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const storeIds = Array.from(
    new Set(orders.map((o) => o.storeId).filter(Boolean) as string[])
  );
  const storeNames = Object.fromEntries(
    orders
      .filter((o) => o.store?.id)
      .map((o) => [o.store!.id, o.store!.name ?? "Tienda"])
  );
  const filteredOrders =
    filterStoreId === ""
      ? orders
      : orders.filter((o) => o.storeId === filterStoreId);

  if (loading) {
    return (
      <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
        <div className="w-full max-w-[1200px] mx-auto px-6 space-y-6">
          <div className="skeleton-shimmer rounded h-4 w-40 bg-cosmos-surface-elevated" aria-hidden />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="p-4 bg-cosmos-surface border border-cosmos-border rounded-xl flex items-center justify-between"
              >
                <div className="skeleton-shimmer rounded h-4 w-28 bg-cosmos-surface-elevated" aria-hidden />
                <div className="skeleton-shimmer rounded h-4 w-20 bg-cosmos-surface-elevated" aria-hidden />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <nav className="flex items-center gap-2 text-sm text-cosmos-muted mb-6">
          <Link to="/proveedores" className="hover:text-cosmos-accent">
            Proveedores
          </Link>
          <span>/</span>
          <span className="text-cosmos-text">Pedidos</span>
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cosmos-accent-soft flex items-center justify-center shrink-0">
              <ClipboardList size={24} className="text-cosmos-accent" />
            </div>
            <div>
              <h1 className="font-display font-semibold text-cosmos-text text-2xl m-0 mb-1">
                Administrador de pedidos
              </h1>
              <p className="text-cosmos-muted text-sm m-0">
                Todos los pedidos de tus tiendas en un solo lugar.
              </p>
            </div>
          </div>
          {storeIds.length > 1 && (
            <div className="flex items-center gap-2">
              <label htmlFor="filter-store" className="text-sm text-cosmos-muted whitespace-nowrap">
                Filtrar por tienda:
              </label>
              <select
                id="filter-store"
                value={filterStoreId}
                onChange={(e) => setFilterStoreId(e.target.value)}
                className="px-3 py-2 text-sm bg-cosmos-surface border border-cosmos-border rounded-lg text-cosmos-text focus:outline-none focus:ring-2 focus:ring-cosmos-accent/40"
              >
                <option value="">Todas las tiendas</option>
                {storeIds.map((sid) => (
                  <option key={sid} value={sid}>
                    {storeNames[sid] ?? sid.slice(0, 8)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {error && orders.length === 0 && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
            {error}
          </div>
        )}

        <p className="text-cosmos-muted text-sm m-0 mb-6">
          {filteredOrders.length} pedido{filteredOrders.length !== 1 ? "s" : ""}
          {filterStoreId ? ` en ${storeNames[filterStoreId] ?? "esta tienda"}` : " en total"}.
        </p>

        {filteredOrders.length === 0 ? (
          <div className="p-8 bg-cosmos-surface border border-cosmos-border rounded-2xl text-center">
            <Package size={40} className="text-cosmos-muted mx-auto mb-4" />
            <p className="text-cosmos-muted m-0">
              {filterStoreId
                ? "No hay pedidos de esta tienda."
                : "Aún no tenés pedidos. Cuando las tiendas te compren, aparecerán acá."}
            </p>
            {filterStoreId && (
              <button
                type="button"
                onClick={() => setFilterStoreId("")}
                className="mt-4 text-sm font-medium text-cosmos-accent hover:underline"
              >
                Ver todas las tiendas
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="p-5 bg-cosmos-surface border border-cosmos-border rounded-xl"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <div>
                      <p className="font-medium text-cosmos-text m-0">
                        Pedido #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-sm text-cosmos-muted m-0">
                        {new Date(order.createdAt).toLocaleString("es-AR", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {order.store && (
                      <Link
                        to={`/proveedores/retailers/${order.store.id}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-cosmos-surface-elevated text-cosmos-muted border border-cosmos-border hover:bg-cosmos-accent-soft hover:text-cosmos-accent hover:border-cosmos-accent/40 transition-colors"
                      >
                        <Store size={14} />
                        {order.store.name ?? "Tienda"}
                      </Link>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-cosmos-text">
                      {order.currency} {toNum(order.totalAmount).toFixed(2)}
                    </span>
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-lg ${
                        order.status === "RELEASED" || order.status === "DELIVERED"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : order.status === "CANCELLED"
                            ? "bg-cosmos-muted/20 text-cosmos-muted"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {orderStatusLabel(order.status as import("../../api/orders").OrderStatusBackend)}
                    </span>
                  </div>
                </div>
                {order.orderItems && order.orderItems.length > 0 && (
                  <ul className="list-none m-0 p-0 space-y-1 text-sm text-cosmos-muted border-t border-cosmos-border pt-3">
                    {order.orderItems.map((item) => (
                      <li key={item.id} className="flex justify-between gap-2">
                        <span>
                          {item.product?.name ?? "Producto"} × {item.quantity}
                        </span>
                        <span>
                          {order.currency} {toNum(item.subtotal).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                {order.shippingInfo && typeof order.shippingInfo === "object" && (
                  <div className="mt-3 pt-3 border-t border-cosmos-border">
                    <p className="text-xs font-medium uppercase tracking-wider text-cosmos-muted m-0 mb-2">
                      Datos de envío
                    </p>
                    <div className="text-sm text-cosmos-text space-y-0.5">
                      {"recipientName" in order.shippingInfo && order.shippingInfo.recipientName && (
                        <p className="m-0">Destinatario: {String(order.shippingInfo.recipientName)}</p>
                      )}
                      {"email" in order.shippingInfo && order.shippingInfo.email && (
                        <p className="m-0">Email: {String(order.shippingInfo.email)}</p>
                      )}
                      {"address" in order.shippingInfo && order.shippingInfo.address && (
                        <p className="m-0">Dirección: {String(order.shippingInfo.address)}</p>
                      )}
                      {("city" in order.shippingInfo && order.shippingInfo.city) ||
                      ("postalCode" in order.shippingInfo && order.shippingInfo.postalCode) ||
                      ("country" in order.shippingInfo && order.shippingInfo.country) ? (
                        <p className="m-0">
                          {[
                            "city" in order.shippingInfo && order.shippingInfo.city
                              ? String(order.shippingInfo.city)
                              : "",
                            "postalCode" in order.shippingInfo && order.shippingInfo.postalCode
                              ? String(order.shippingInfo.postalCode)
                              : "",
                            "country" in order.shippingInfo && order.shippingInfo.country
                              ? String(order.shippingInfo.country)
                              : "",
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      ) : null}
                    </div>
                  </div>
                )}

                {/* Acciones del proveedor */}
                {(order.status === "FUNDED" || order.status === "SHIPPED" || order.status === "DELIVERED") && (
                  <div className="mt-3 pt-3 border-t border-cosmos-border flex flex-wrap items-center gap-2">
                    {actionError && actionOrderId === order.id && (
                      <p className="text-red-500 text-sm w-full m-0">{actionError}</p>
                    )}
                    {order.status === "FUNDED" && !order.shipment && order.escrow?.id ? (
                      <button
                        type="button"
                        disabled={actionOrderId === order.id}
                        onClick={async () => {
                          setActionOrderId(order.id);
                          setActionError(null);
                          try {
                            await providerEnsureShipment(order.id);
                            refetch();
                          } catch (err) {
                            setActionError(getErrorMessage(err, "Error al preparar envío"));
                          } finally {
                            setActionOrderId(null);
                          }
                        }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-cosmos-surface-elevated border border-cosmos-border text-cosmos-text hover:bg-cosmos-accent-soft hover:border-cosmos-accent/40 disabled:opacity-60"
                      >
                        {actionOrderId === order.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Truck size={14} />
                        )}
                        Preparar envío
                      </button>
                    ) : null}
                    {order.shipment && !order.shipment.sellerMarkedShipped ? (
                      <button
                        type="button"
                        disabled={actionOrderId === order.id}
                        onClick={async () => {
                          setActionOrderId(order.id);
                          setActionError(null);
                          try {
                            await providerMarkShipped(order.shipment!.id);
                            refetch();
                          } catch (err) {
                            setActionError(getErrorMessage(err, "Error al marcar como enviado"));
                          } finally {
                            setActionOrderId(null);
                          }
                        }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 disabled:opacity-60"
                      >
                        {actionOrderId === order.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Truck size={14} />
                        )}
                        Marcar como enviado
                      </button>
                    ) : null}
                    {order.shipment?.sellerMarkedShipped && !order.shipment.sellerMarkedDelivered ? (
                      <button
                        type="button"
                        disabled={actionOrderId === order.id}
                        onClick={async () => {
                          setActionOrderId(order.id);
                          setActionError(null);
                          try {
                            await providerMarkDelivered(order.shipment!.id);
                            refetch();
                          } catch (err) {
                            setActionError(getErrorMessage(err, "Error al marcar como recibido"));
                          } finally {
                            setActionOrderId(null);
                          }
                        }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 disabled:opacity-60"
                      >
                        {actionOrderId === order.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <CheckCircle size={14} />
                        )}
                        Marcar como recibido
                      </button>
                    ) : null}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
