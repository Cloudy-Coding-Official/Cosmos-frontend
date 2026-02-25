import { Link } from "react-router-dom";
import { Fragment } from "react";
import { DollarSign, Package, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";
import { getRetailerSales, orderStatusLabel, type RetailerSale, type OrderStatusBackend } from "../../api/orders";
import { getErrorMessage } from "../../api/client";

function formatSaleDate(createdAt: string): string {
  return new Date(createdAt).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function productSummary(order: RetailerSale): string {
  const items = order.orderItems ?? [];
  if (items.length === 0) return "Pedido";
  if (items.length === 1) {
    const name = items[0].product?.name ?? "Producto";
    return `${name} x ${items[0].quantity}`;
  }
  return items.map((i) => `${i.product?.name ?? "Producto"} x ${i.quantity}`).join(", ");
}

function buyerName(order: RetailerSale): string {
  const b = order.buyer;
  if (!b) return "—";
  const first = b.firstName?.trim() ?? "";
  const last = b.lastName?.trim() ?? "";
  const name = [first, last].filter(Boolean).join(" ");
  return name || "Cliente";
}

function ShippingInfoBlock({ shippingInfo }: { shippingInfo: Record<string, unknown> }) {
  return (
    <div className="text-sm text-cosmos-text space-y-0.5">
      {"recipientName" in shippingInfo && shippingInfo.recipientName != null && shippingInfo.recipientName !== "" && (
        <p className="m-0">Destinatario: {String(shippingInfo.recipientName)}</p>
      )}
      {"email" in shippingInfo && shippingInfo.email != null && shippingInfo.email !== "" && (
        <p className="m-0">Email: {String(shippingInfo.email)}</p>
      )}
      {"address" in shippingInfo && shippingInfo.address != null && shippingInfo.address !== "" && (
        <p className="m-0">Dirección: {String(shippingInfo.address)}</p>
      )}
      {("city" in shippingInfo && shippingInfo.city) || ("postalCode" in shippingInfo && shippingInfo.postalCode) || ("country" in shippingInfo && shippingInfo.country) ? (
        <p className="m-0">
          {[
            "city" in shippingInfo && shippingInfo.city ? String(shippingInfo.city) : "",
            "postalCode" in shippingInfo && shippingInfo.postalCode ? String(shippingInfo.postalCode) : "",
            "country" in shippingInfo && shippingInfo.country ? String(shippingInfo.country) : "",
          ].filter(Boolean).join(", ")}
        </p>
      ) : null}
    </div>
  );
}

export function RetailerVentas() {
  const [ventas, setVentas] = useState<RetailerSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    getRetailerSales()
      .then(setVentas)
      .catch((err) => setError(getErrorMessage(err, "Error al cargar ventas")))
      .finally(() => setLoading(false));
  }, []);

  const totalVentas = ventas.reduce((acc, v) => acc + Number(v.totalAmount), 0);
  const currency = ventas[0]?.currency ?? "USD";

  return (
    <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <nav className="flex items-center gap-2 text-sm text-cosmos-muted mb-6">
          <Link to="/retailer" className="hover:text-cosmos-accent transition-colors">Mi tienda</Link>
          <span>/</span>
          <span className="text-cosmos-text">Ventas</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="font-display font-semibold text-cosmos-text text-2xl md:text-3xl m-0 mb-2">
              Ventas
            </h1>
            <p className="text-cosmos-muted m-0">
              Historial de ventas a tus clientes finales.
            </p>
          </div>
          <div className="flex items-center gap-4 p-4 bg-cosmos-surface border border-cosmos-border rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-cosmos-accent-soft flex items-center justify-center">
              <DollarSign size={24} className="text-cosmos-accent" />
            </div>
            <div>
              <p className="text-xs text-cosmos-muted m-0">Total vendido</p>
              <p className="font-semibold text-cosmos-text text-xl m-0">
                {ventas.length > 0 ? `${currency} ${totalVentas.toFixed(2)}` : "—"}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-cosmos-muted">Cargando ventas…</p>
        ) : ventas.length === 0 ? (
          <div className="p-12 bg-cosmos-surface border border-cosmos-border rounded-2xl text-center">
            <Package size={48} className="text-cosmos-muted mx-auto mb-4" />
            <p className="text-cosmos-muted m-0">Aún no tienes ventas.</p>
            <Link to="/retailer/tiendas" className="inline-flex items-center gap-2 mt-4 text-cosmos-accent hover:text-cosmos-accent-hover">
              Ver mis tiendas y productos <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-cosmos-surface border border-cosmos-border rounded-2xl overflow-hidden">
            <thead>
              <tr className="border-b border-cosmos-border">
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-cosmos-muted px-6 py-4">
                  ID
                </th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-cosmos-muted px-6 py-4">
                  Fecha
                </th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-cosmos-muted px-6 py-4">
                  Producto
                </th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-cosmos-muted px-6 py-4">
                  Cliente
                </th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-cosmos-muted px-6 py-4">
                  Total
                </th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-cosmos-muted px-6 py-4">
                  Estado
                </th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-cosmos-muted px-6 py-4 w-20">
                  Envío
                </th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((venta) => (
                <Fragment key={venta.id}>
                  <tr
                    className="border-b border-cosmos-border last:border-b-0 hover:bg-cosmos-surface-elevated/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-cosmos-text font-mono text-sm">
                      {venta.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 text-cosmos-muted text-sm">{formatSaleDate(venta.createdAt)}</td>
                    <td className="px-6 py-4 text-cosmos-text">{productSummary(venta)}</td>
                    <td className="px-6 py-4 text-cosmos-muted">{buyerName(venta)}</td>
                    <td className="px-6 py-4 font-medium text-cosmos-text">
                      {venta.currency} {Number(venta.totalAmount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-medium rounded-lg ${
                          venta.status === "DELIVERED" || venta.status === "RELEASED"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : venta.status === "CANCELLED" || venta.status === "DISPUTED"
                              ? "bg-red-500/10 text-red-400"
                              : "bg-amber-500/10 text-amber-400"
                        }`}
                      >
                        {orderStatusLabel(venta.status as OrderStatusBackend)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {venta.shippingInfo && typeof venta.shippingInfo === "object" ? (
                        <button
                          type="button"
                          onClick={() => setExpandedId(expandedId === venta.id ? null : venta.id)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-cosmos-accent hover:underline"
                        >
                          {expandedId === venta.id ? (
                            <>Ocultar <ChevronUp size={14} /></>
                          ) : (
                            <>Ver datos <ChevronDown size={14} /></>
                          )}
                        </button>
                      ) : (
                        <span className="text-cosmos-muted text-xs">—</span>
                      )}
                    </td>
                  </tr>
                  {expandedId === venta.id && venta.shippingInfo && typeof venta.shippingInfo === "object" && (
                    <tr className="border-b border-cosmos-border bg-cosmos-surface-elevated/30">
                      <td colSpan={7} className="px-6 py-4">
                        <p className="text-xs font-medium uppercase tracking-wider text-cosmos-muted m-0 mb-2">
                          Datos de envío del cliente
                        </p>
                        <ShippingInfoBlock shippingInfo={venta.shippingInfo as Record<string, unknown>} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </div>
  );
}
