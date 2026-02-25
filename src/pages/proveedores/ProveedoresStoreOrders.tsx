import { Link, useParams, Navigate } from "react-router-dom";
import { Store, ArrowLeft, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { getProviderStoreOrders, type ProviderStoreOrder } from "../../api/providers";
import { orderStatusLabel } from "../../api/orders";
import { getErrorMessage } from "../../api/client";

function toNum(v: string | number | null | undefined): number {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  const n = parseFloat(String(v));
  return Number.isFinite(n) ? n : 0;
}

export function ProveedoresStoreOrders() {
  const { storeId } = useParams<{ storeId: string }>();
  const [orders, setOrders] = useState<ProviderStoreOrder[]>([]);
  const [storeName, setStoreName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!storeId) return;
    getProviderStoreOrders(storeId)
      .then((list) => {
        setOrders(list);
        const first = list[0];
        setStoreName(first?.store?.name ?? "Tienda");
      })
      .catch((err) => {
        setError(getErrorMessage(err, "Error al cargar pedidos"));
        setOrders([]);
      })
      .finally(() => setLoading(false));
  }, [storeId]);

  if (!storeId) {
    return <Navigate to="/proveedores/retailers" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
        <div className="w-full max-w-[1200px] mx-auto px-6">
          <p className="text-cosmos-muted">Cargando pedidos…</p>
        </div>
      </div>
    );
  }

  if (error && orders.length === 0) {
    return (
      <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
        <div className="w-full max-w-[1200px] mx-auto px-6">
          <p className="text-red-500 mb-4">{error}</p>
          <Link to="/proveedores/retailers" className="text-cosmos-accent hover:underline">
            Volver a tiendas
          </Link>
        </div>
      </div>
    );
  }

  const name = storeName ?? "Tienda";

  return (
    <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <nav className="flex items-center gap-2 text-sm text-cosmos-muted mb-4">
          <Link to="/proveedores" className="hover:text-cosmos-accent">
            Proveedores
          </Link>
          <span>/</span>
          <Link to="/proveedores/retailers" className="hover:text-cosmos-accent">
            Retailers
          </Link>
          <span>/</span>
          <span className="text-cosmos-text">{name}</span>
        </nav>

        <Link
          to="/proveedores/retailers"
          className="inline-flex items-center gap-2 text-sm text-cosmos-muted hover:text-cosmos-accent mb-6"
        >
          <ArrowLeft size={16} />
          Volver a tiendas
        </Link>

        <div className="flex flex-wrap items-center gap-3 mb-6 p-4 rounded-xl bg-cosmos-surface border border-cosmos-border">
          <div className="w-10 h-10 rounded-lg bg-cosmos-accent-soft flex items-center justify-center shrink-0">
            <Store size={20} className="text-cosmos-accent" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-cosmos-muted m-0">
              Pedidos de
            </p>
            <p className="font-display font-semibold text-cosmos-text text-lg m-0">
              {name}
            </p>
          </div>
        </div>

        <h1 className="font-display font-semibold text-cosmos-text text-2xl m-0 mb-2">
          Pedidos de esta tienda
        </h1>
        <p className="text-cosmos-muted text-sm m-0 mb-8">
          {orders.length} pedido{orders.length !== 1 ? "s" : ""} en total.
        </p>

        {orders.length === 0 ? (
          <div className="p-8 bg-cosmos-surface border border-cosmos-border rounded-2xl text-center">
            <Package size={40} className="text-cosmos-muted mx-auto mb-4" />
            <p className="text-cosmos-muted m-0">No hay pedidos de esta tienda.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-5 bg-cosmos-surface border border-cosmos-border rounded-xl"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div>
                    <p className="font-medium text-cosmos-text m-0">
                      Pedido #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-sm text-cosmos-muted m-0">
                      {new Date(order.createdAt).toLocaleDateString("es-AR", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
