import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { getProviderSales, type ProviderSale } from "../../api/providers";
import { getMyTransactions, type WalletTransaction } from "../../api/wallet";
import { getErrorMessage } from "../../api/client";

function formatTransactionType(type: string): string {
  const map: Record<string, string> = {
    CREDIT: "Ingreso",
    DEBIT: "Retiro",
    ESCROW_LOCK: "Bloqueo en depósito",
    ESCROW_RELEASE: "Liberación depósito",
    COMMISSION: "Comisión",
    FX_SPREAD: "Diferencial cambio",
    SETTLEMENT: "Liquidación",
  };
  return map[type] ?? type;
}

function formatSaleDate(createdAt: string): string {
  const d = new Date(createdAt);
  return d.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
}

function formatOrderStatus(status: string): string {
  const map: Record<string, string> = {
    PENDING: "Pendiente",
    FUNDED: "Pagado",
    ESCROW_DEPLOYED: "En depósito",
    SHIPPED: "Enviado",
    DELIVERED: "Entregado",
    RELEASED: "Completado",
    CANCELLED: "Cancelado",
    DISPUTED: "En disputa",
  };
  return map[status] ?? status;
}

function productSummary(order: ProviderSale): string {
  const items = order.orderItems ?? [];
  if (items.length === 0) return "Pedido";
  if (items.length === 1) {
    const name = items[0].product?.name ?? "Producto";
    return `${name} x ${items[0].quantity}`;
  }
  return items.map((i) => `${i.product?.name ?? "Producto"} x ${i.quantity}`).join(", ");
}

export function ProveedoresVentas() {
  const [tab, setTab] = useState<"ventas" | "transacciones">("ventas");
  const [ventas, setVentas] = useState<ProviderSale[]>([]);
  const [transacciones, setTransacciones] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTx, setLoadingTx] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorTx, setErrorTx] = useState<string | null>(null);

  useEffect(() => {
    getProviderSales()
      .then(setVentas)
      .catch((err) => setError(getErrorMessage(err, "Error al cargar ventas")))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (tab !== "transacciones") return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoadingTx(true);
    setErrorTx(null);
    getMyTransactions()
      .then(setTransacciones)
      .catch((err) => setErrorTx(getErrorMessage(err, "Error al cargar transacciones")))
      .finally(() => setLoadingTx(false));
  }, [tab]);

  const now = new Date();
  const thisMonth = ventas.filter((v) => {
    const d = new Date(v.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const totalEsteMes = thisMonth.reduce((acc, v) => acc + Number(v.totalAmount), 0);

  return (
    <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <nav className="flex items-center gap-2 text-sm text-cosmos-muted mb-8">
          <Link to="/proveedores" className="hover:text-cosmos-accent">Proveedores</Link>
          <span>/</span>
          <span className="text-cosmos-text">Ventas</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cosmos-accent-soft flex items-center justify-center">
              <TrendingUp size={20} className="text-cosmos-accent" />
            </div>
            <div>
              <h1 className="font-display font-semibold text-cosmos-text text-2xl m-0 mb-1">
                Ventas
              </h1>
              <p className="text-cosmos-muted text-sm m-0">
                Pedidos de retailers y cobros.
              </p>
            </div>
          </div>
          <div className="p-4 bg-cosmos-surface border border-cosmos-border rounded-xl">
            <p className="text-xs text-cosmos-muted m-0">Este mes</p>
            <p className="font-semibold text-cosmos-text text-xl m-0">
              {ventas.length > 0 ? `${ventas[0].currency ?? "USD"} ${totalEsteMes.toFixed(2)}` : "—"}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="flex gap-6 mb-6">
          <button
            type="button"
            onClick={() => setTab("ventas")}
            className={`text-sm font-medium transition-colors ${
              tab === "ventas" ? "text-cosmos-accent" : "text-cosmos-muted hover:text-cosmos-text transition-colors"
            }`}
          >
            Pedidos
          </button>
          <button
            type="button"
            onClick={() => setTab("transacciones")}
            className={`text-sm font-medium transition-colors ${
              tab === "transacciones" ? "text-cosmos-accent" : "text-cosmos-muted hover:text-cosmos-text transition-colors"
            }`}
          >
            Transacciones
          </button>
        </div>

        {tab === "ventas" && (
          <>
            {loading ? (
              <p className="text-cosmos-muted">Cargando ventas…</p>
            ) : ventas.length === 0 ? (
              <div className="p-8 bg-cosmos-surface border border-cosmos-border rounded-2xl text-center">
                <TrendingUp size={40} className="text-cosmos-muted mx-auto mb-4" />
                <p className="text-cosmos-muted m-0">Aún no tienes ventas. Los pedidos de retailers aparecerán aquí.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {ventas.map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center justify-between p-4 bg-cosmos-surface border border-cosmos-border rounded-xl"
                  >
                    <div>
                      <p className="font-medium text-cosmos-text m-0">
                        {v.store?.name ?? "Tienda"} · {productSummary(v)}
                      </p>
                      <p className="text-sm text-cosmos-muted m-0">{formatSaleDate(v.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-cosmos-text m-0">
                        {v.currency} {Number(v.totalAmount).toFixed(2)}
                      </p>
                      <p className="text-xs text-cosmos-muted m-0">{formatOrderStatus(v.status)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === "transacciones" && (
          <>
            {errorTx && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
                {errorTx}
              </div>
            )}
            {loadingTx ? (
              <p className="text-cosmos-muted">Cargando transacciones…</p>
            ) : transacciones.length === 0 ? (
              <div className="p-8 bg-cosmos-surface border border-cosmos-border rounded-2xl text-center">
                <TrendingUp size={40} className="text-cosmos-muted mx-auto mb-4" />
                <p className="text-cosmos-muted m-0">Aún no tienes transacciones. Los movimientos de tu billetera aparecerán aquí.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transacciones.map((t) => {
                  const amount = typeof t.amount === "number" ? t.amount : parseFloat(String(t.amount));
                  const currency = t.currency ?? "USD";
                  return (
                    <div
                      key={t.id}
                      className="flex items-center justify-between p-4 bg-cosmos-surface border border-cosmos-border rounded-xl"
                    >
                      <div>
                        <p className="font-medium text-cosmos-text m-0">
                          {formatTransactionType(t.type)}
                          {t.description ? ` · ${t.description}` : ""}
                        </p>
                        <p className="text-sm text-cosmos-muted m-0">
                          {new Date(t.createdAt).toLocaleDateString("es-AR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-medium m-0 ${
                            amount >= 0 ? "text-cosmos-text" : "text-red-400"
                          }`}
                        >
                          {amount >= 0 ? "+" : ""}
                          {currency} {amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
