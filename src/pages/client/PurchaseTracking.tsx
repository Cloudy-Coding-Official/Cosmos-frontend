import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Package, Truck, CheckCircle, ArrowLeft, Loader2 } from "lucide-react";
import type { Order } from "../../data/orders";
import { getOrder, ingresarCodigoComprador, marcarEnCamino } from "../../data/orders";
import { getOrderById, orderStatusLabel, type OrderBackend, type OrderStatusBackend } from "../../api/orders";
import { getProductById } from "../../data/products";
import { ProductImage } from "../../components/ProductImage";
import { getShipmentByOrder, buyerDeliveryResponse } from "../../api/shipments";
import type { ShipmentDto } from "../../api/shipments";
import { getErrorMessage } from "../../api/client";

function purchaseStatusMessage(status: OrderStatusBackend): { message: string; stage: "preparando" | "en_camino" | "entregado" | "completado" | "otro" } {
  switch (status) {
    case "PENDING":
    case "ESCROW_DEPLOYED":
    case "FUNDED":
      return { message: "El proveedor está preparando tu compra.", stage: "preparando" };
    case "SHIPPED":
      return { message: "Tu pedido está en camino.", stage: "en_camino" };
    case "DELIVERED":
      return { message: "Tu pedido fue entregado. Confirmá cuando lo recibas para liberar el pago al vendedor.", stage: "entregado" };
    case "RELEASED":
      return { message: "¡Listo! Confirmaste la recepción y el pago fue liberado al vendedor.", stage: "completado" };
    case "CANCELLED":
      return { message: "Este pedido fue cancelado.", stage: "otro" };
    case "DISPUTED":
      return { message: "Este pedido está en disputa. Te contactaremos si hace falta.", stage: "otro" };
    default:
      return { message: orderStatusLabel(status), stage: "otro" };
  }
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const PASOS_LOCAL: { id: "comprado" | "en_camino" | "confirmado"; label: string; icon: typeof Package }[] = [
  { id: "comprado", label: "Comprado", icon: Package },
  { id: "en_camino", label: "En Camino", icon: Truck },
  { id: "confirmado", label: "Confirmado", icon: CheckCircle },
];

export function PurchaseTracking() {
  const { id } = useParams<{ id: string }>();
  const [localOrder, setLocalOrder] = useState<Order | undefined>(undefined);
  const [apiOrder, setApiOrder] = useState<OrderBackend | null | undefined>(undefined);
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [enviado, setEnviado] = useState(false);

  const isApiOrderId = id && UUID_REGEX.test(id);
  const [shipment, setShipment] = useState<ShipmentDto | null | undefined>(undefined);
  const [deliveryActionLoading, setDeliveryActionLoading] = useState(false);
  const [deliveryActionError, setDeliveryActionError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    if (isApiOrderId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalOrder(undefined);
      getOrderById(id)
        .then(setApiOrder)
        .catch(() => setApiOrder(null));
    } else {
      setApiOrder(undefined);
      setLocalOrder(getOrder(id));
    }
  }, [id, isApiOrderId]);

  useEffect(() => {
    if (!apiOrder || !isApiOrderId) return;
    const needShipment =
      apiOrder.status === "SHIPPED" ||
      apiOrder.status === "DELIVERED" ||
      apiOrder.status === "RELEASED";
    if (!needShipment) {
      setShipment(null);
      return;
    }
    setShipment(undefined);
    getShipmentByOrder(apiOrder.id)
      .then(setShipment)
      .catch(() => setShipment(null));
  }, [apiOrder?.id, apiOrder?.status, isApiOrderId]);

  const loading = isApiOrderId ? apiOrder === undefined : false;
  const notFound = isApiOrderId ? apiOrder === null : !localOrder;

  if (loading) {
    return (
      <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
        <div className="w-full max-w-[1200px] mx-auto px-6 space-y-6">
          <div className="skeleton-shimmer rounded h-6 w-40 bg-cosmos-surface-elevated" aria-hidden />
          <div className="p-6 bg-cosmos-surface border border-cosmos-border rounded-2xl space-y-4">
            <div className="skeleton-shimmer rounded h-4 w-full bg-cosmos-surface-elevated" aria-hidden />
            <div className="skeleton-shimmer rounded h-4 w-3/4 bg-cosmos-surface-elevated" aria-hidden />
            <div className="skeleton-shimmer rounded h-4 w-1/2 bg-cosmos-surface-elevated" aria-hidden />
          </div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-cosmos-bg py-16 text-center">
        <p className="text-cosmos-muted m-0 mb-6">No se encontró la compra.</p>
        <Link to="/perfil" className="text-cosmos-accent font-medium hover:underline">
          Volver al perfil
        </Link>
      </div>
    );
  }

  if (apiOrder) {
    return (
      <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
        <div className="max-w-[720px] mx-auto px-6">
          <nav className="flex items-center gap-2 text-sm text-cosmos-muted mb-8">
            <Link to="/perfil" className="hover:text-cosmos-accent flex items-center gap-1">
              <ArrowLeft size={16} /> Perfil
            </Link>
            <span>/</span>
            <Link to="/perfil" className="hover:text-cosmos-accent">Mis compras</Link>
            <span>/</span>
            <span className="text-cosmos-text">#{apiOrder.id.slice(0, 8)}</span>
          </nav>
          <h1 className="font-display font-semibold text-cosmos-text text-2xl m-0 mb-1">
            Seguimiento de compra
          </h1>
          <p className="text-cosmos-muted text-sm m-0 mb-6">
            Pedido #{apiOrder.id.slice(0, 8)} · {new Date(apiOrder.createdAt).toLocaleString("es-AR", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>

          {(() => {
            const { message, stage } = purchaseStatusMessage(apiOrder.status as OrderStatusBackend);
            const steps: { id: "preparando" | "en_camino" | "entregado"; label: string; icon: typeof Package }[] = [
              { id: "preparando", label: "Preparando", icon: Package },
              { id: "en_camino", label: "En camino", icon: Truck },
              { id: "entregado", label: "Entregado", icon: CheckCircle },
            ];
            const stageOrder = ["preparando", "en_camino", "entregado", "completado"] as const;
            type StageOrder = (typeof stageOrder)[number];
            const currentIndex = stage === "otro" ? -1 : stageOrder.indexOf(stage as StageOrder);
            return (
              <>
                <div className="mb-6 p-5 bg-cosmos-surface border border-cosmos-border rounded-2xl flex items-start gap-4">
                  {stage === "preparando" && <Package size={28} className="text-cosmos-accent shrink-0 mt-0.5" />}
                  {stage === "en_camino" && <Truck size={28} className="text-cosmos-accent shrink-0 mt-0.5" />}
                  {(stage === "entregado" || stage === "completado") && <CheckCircle size={28} className="text-emerald-400 shrink-0 mt-0.5" />}
                  {stage === "otro" && <Package size={28} className="text-cosmos-muted shrink-0 mt-0.5" />}
                  <div>
                    <p className="font-semibold text-cosmos-text m-0 mb-0.5">{message}</p>
                    <p className="text-sm text-cosmos-muted m-0">Estado: {orderStatusLabel(apiOrder.status as OrderStatusBackend)}</p>
                  </div>
                </div>
                {currentIndex >= 0 && (
                  <div className="mb-8 flex items-center gap-0">
                    {steps.map((s, i) => {
                      const Icon = s.icon;
                      const done = stageOrder.indexOf(stage as StageOrder) > i || stage === "completado";
                      const active = stage === "completado" ? false : stageOrder.indexOf(stage as StageOrder) === i;
                      return (
                        <div key={s.id} className="flex flex-1 items-center min-w-0">
                          <div className="flex flex-1 flex-col items-center">
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${done ? "bg-emerald-500/20 text-emerald-400" : active ? "bg-cosmos-accent text-white" : "bg-cosmos-surface-elevated text-cosmos-muted"}`}>
                              {done ? <CheckCircle size={20} /> : <Icon size={20} />}
                            </div>
                            <span className={`mt-2 text-center text-xs font-medium ${done ? "text-emerald-400/90" : active ? "text-cosmos-text" : "text-cosmos-muted"}`}>{s.label}</span>
                          </div>
                          {i < steps.length - 1 && (
                            <div className="w-8 shrink-0 flex items-center justify-center">
                              <div className={`h-0.5 w-4 rounded-full ${done ? "bg-emerald-500/40" : "bg-cosmos-border"}`} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            );
          })()}

          <div className="mb-8 p-6 bg-cosmos-surface border border-cosmos-border rounded-2xl">
            <h3 className="font-semibold text-cosmos-text m-0 mb-4">Detalles</h3>
            {apiOrder.shippingInfo && typeof apiOrder.shippingInfo === "object" && (
              <div className="mb-4 text-sm text-cosmos-muted">
                <p className="m-0 mb-1">
                  Envío a: {"recipientName" in apiOrder.shippingInfo && apiOrder.shippingInfo.recipientName
                    ? String(apiOrder.shippingInfo.recipientName)
                    : "—"}
                </p>
                <p className="m-0">
                  {"address" in apiOrder.shippingInfo && apiOrder.shippingInfo.address
                    ? `${apiOrder.shippingInfo.address}, ${"city" in apiOrder.shippingInfo ? apiOrder.shippingInfo.city : ""} ${"postalCode" in apiOrder.shippingInfo ? apiOrder.shippingInfo.postalCode : ""} ${"country" in apiOrder.shippingInfo ? apiOrder.shippingInfo.country : ""}`.trim()
                    : ""}
                </p>
              </div>
            )}
            {apiOrder.orderItems && apiOrder.orderItems.length > 0 && (
              <ul className="space-y-3 m-0 p-0 list-none">
                {apiOrder.orderItems.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 text-sm">
                    <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-cosmos-surface-elevated">
                      <ProductImage
                        src=""
                        alt={item.product?.name ?? "Producto"}
                        className="w-full h-full object-cover"
                        wrapperClassName="w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-cosmos-text block">{item.product?.name ?? "Producto"} × {item.quantity}</span>
                      <span className="text-cosmos-muted">{apiOrder.currency} {Number(item.subtotal || 0).toFixed(2)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <p className="text-base font-semibold text-cosmos-text mt-4 m-0">
              Total: {apiOrder.currency} {Number(apiOrder.totalAmount).toFixed(2)}
            </p>
          </div>

          {/* Comprador: confirmar que me llegó el pedido (libera el escrow) */}
          {shipment &&
            shipment.buyerConfirmed == null &&
            (apiOrder.status === "SHIPPED" || apiOrder.status === "DELIVERED") && (
              <div className="mb-6 p-4 bg-cosmos-surface border border-cosmos-border rounded-xl">
                <h3 className="font-semibold text-cosmos-text m-0 mb-2">
                  ¿Te llegó el pedido?
                </h3>
                <p className="text-sm text-cosmos-muted m-0 mb-4">
                  Al confirmar, se libera el pago al vendedor. Si no te llegó, podés reportarlo y se abre una disputa.
                </p>
                {deliveryActionError && (
                  <p className="text-red-500 text-sm m-0 mb-3">{deliveryActionError}</p>
                )}
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={deliveryActionLoading}
                    onClick={async () => {
                      setDeliveryActionLoading(true);
                      setDeliveryActionError(null);
                      try {
                        await buyerDeliveryResponse(shipment.id, { received: true });
                        const updated = await getOrderById(apiOrder.id);
                        if (updated) setApiOrder(updated);
                        setShipment(undefined);
                      } catch (err) {
                        setDeliveryActionError(getErrorMessage(err, "Error al confirmar"));
                      } finally {
                        setDeliveryActionLoading(false);
                      }
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 disabled:opacity-60"
                  >
                    {deliveryActionLoading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <CheckCircle size={16} />
                    )}
                    Confirmar que me llegó
                  </button>
                  <button
                    type="button"
                    disabled={deliveryActionLoading}
                    onClick={async () => {
                      setDeliveryActionLoading(true);
                      setDeliveryActionError(null);
                      try {
                        await buyerDeliveryResponse(shipment.id, {
                          received: false,
                          reason: "No recibí el pedido",
                        });
                        const updated = await getOrderById(apiOrder.id);
                        if (updated) setApiOrder(updated);
                        setShipment(undefined);
                      } catch (err) {
                        setDeliveryActionError(getErrorMessage(err, "Error al reportar"));
                      } finally {
                        setDeliveryActionLoading(false);
                      }
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 disabled:opacity-60"
                  >
                    No me llegó (abrir disputa)
                  </button>
                </div>
              </div>
            )}

          {shipment && shipment.buyerConfirmed === true && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
              <CheckCircle size={20} className="text-emerald-500 shrink-0" />
              <p className="text-sm text-cosmos-text m-0">Confirmaste la recepción. El pago fue liberado al vendedor.</p>
            </div>
          )}

          <Link to="/perfil" className="inline-flex items-center gap-2 text-cosmos-accent font-medium hover:underline">
            <ArrowLeft size={18} className="rotate-180" />
            Volver a mis compras
          </Link>
        </div>
      </div>
    );
  }

  const order = localOrder!;
  const stepIndex = PASOS_LOCAL.findIndex((s) => s.id === order.estado);

  const handleConfirmarCodigo = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!codigo.trim()) {
      setError("Ingresá el código");
      return;
    }
    const ok = ingresarCodigoComprador(order.id, codigo);
    if (ok) {
      setEnviado(true);
      setCodigo("");
      setLocalOrder(getOrder(order.id));
    } else {
      setError("Código incorrecto");
    }
  };

  return (
    <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
      <div className="max-w-[720px] mx-auto px-6">
        <nav className="flex items-center gap-2 text-sm text-cosmos-muted mb-8">
          <Link to="/perfil" className="hover:text-cosmos-accent flex items-center gap-1">
            <ArrowLeft size={16} /> Perfil
          </Link>
          <span>/</span>
          <Link to="/perfil" className="hover:text-cosmos-accent">Mis compras</Link>
          <span>/</span>
          <span className="text-cosmos-text">#{order.id}</span>
        </nav>

        <div className="mb-8">
          <h1 className="font-display font-semibold text-cosmos-text text-2xl m-0 mb-1">
            Seguimiento de compra
          </h1>
          <p className="text-cosmos-muted text-sm m-0">
            Pedido {order.id} · {new Date(order.fecha).toLocaleDateString("es-AR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="mb-10 p-6 bg-cosmos-surface border border-cosmos-border rounded-2xl">
          <div className="flex justify-between items-start gap-4">
            {PASOS_LOCAL.map((paso, i) => {
              const Icon = paso.icon;
              const activo = order.estado === paso.id;
              const completado = stepIndex > i || (order.estado === "confirmado" && i < 3);
              return (
                <div key={paso.id} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${
                      completado
                        ? "bg-emerald-500/20 text-emerald-400"
                        : activo
                        ? "bg-cosmos-accent-soft text-cosmos-accent"
                        : "bg-cosmos-surface-elevated text-cosmos-muted"
                    }`}
                  >
                    <Icon size={24} />
                  </div>
                  <span
                    className={`text-sm font-medium text-center ${
                      completado ? "text-emerald-400" : activo ? "text-cosmos-text" : "text-cosmos-muted"
                    }`}
                  >
                    {paso.label}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-cosmos-muted">
            <span className="flex-1 text-center">Pago recibido</span>
            <span className="flex-1 text-center">Envío en curso</span>
            <span className="flex-1 text-center">Entrega confirmada</span>
          </div>
        </div>

        <div className="mb-8 p-6 bg-cosmos-surface border border-cosmos-border rounded-2xl">
          <h3 className="font-semibold text-cosmos-text m-0 mb-4">Detalles</h3>
          <p className="text-sm text-cosmos-muted m-0 mb-1">Tienda: {order.tienda}</p>
          <p className="text-sm text-cosmos-muted m-0 mb-4">Envío a: {order.direccionEnvio}</p>
          <ul className="space-y-3 m-0 p-0 list-none">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 text-sm">
                <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-cosmos-surface-elevated">
                  <ProductImage
                    src={getProductById(item.id)?.image ?? ""}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    wrapperClassName="w-full h-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-cosmos-text block">{item.name} × {item.quantity}</span>
                  <span className="text-cosmos-muted">US$ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </li>
            ))}
          </ul>
          <p className="text-base font-semibold text-cosmos-text mt-4 m-0">
            Total: US$ {order.monto.toFixed(2)}
          </p>
        </div>

        {order.estado === "comprado" && (
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <p className="text-sm text-cosmos-muted m-0 mb-3">
              El vendedor marca el pedido como enviado. Para la demo:
            </p>
            <button
              type="button"
              onClick={() => {
                marcarEnCamino(order.id);
                setLocalOrder(getOrder(order.id)!);
              }}
              className="px-4 py-2 text-sm font-medium bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-colors"
            >
              Marcar como En Camino
            </button>
          </div>
        )}

        {order.estado === "en_camino" && (
          <div className="p-6 bg-cosmos-surface border border-cosmos-border rounded-2xl">
            <h3 className="font-semibold text-cosmos-text m-0 mb-2">Confirmar recepción</h3>
            <p className="text-sm text-cosmos-muted m-0 mb-4">
              Cuando recibas el pedido, ingresá el código único que ambas partes deben ingresar para confirmar la transacción.
            </p>
            <p className="text-xs text-amber-500/90 mb-4">
              Demo: el código es <strong className="font-mono">{order.codigoConfirmacion}</strong>
            </p>
            {order.codigoCompradorIngresado ? (
              <p className="text-emerald-400 text-sm font-medium m-0">✓ Código ingresado correctamente.</p>
            ) : (
              <form onSubmit={handleConfirmarCodigo} className="flex gap-3">
                <input
                  type="text"
                  value={codigo}
                  onChange={(e) => {
                    setCodigo(e.target.value);
                    setError("");
                  }}
                  placeholder="Código de 6 caracteres"
                  className="flex-1 px-4 py-3 border border-cosmos-border bg-cosmos-surface-elevated text-cosmos-text rounded-xl focus:outline-none focus:border-cosmos-accent uppercase"
                  maxLength={8}
                />
                <button
                  type="submit"
                  disabled={enviado}
                  className="px-6 py-3 font-medium bg-cosmos-accent text-cosmos-bg rounded-xl hover:bg-cosmos-accent-hover disabled:opacity-50"
                >
                  Confirmar
                </button>
              </form>
            )}
            {error && <p className="text-red-400 text-sm mt-2 m-0">{error}</p>}
          </div>
        )}

        {order.estado === "confirmado" && (
          <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center">
            <CheckCircle size={40} className="text-emerald-400 mx-auto mb-2" />
            <p className="font-semibold text-cosmos-text m-0 mb-1">Transacción confirmada</p>
            <p className="text-sm text-cosmos-muted m-0">Ambas partes han confirmado la entrega.</p>
          </div>
        )}

        <div className="mt-8">
          <Link to="/perfil" className="inline-flex items-center gap-2 text-cosmos-accent font-medium hover:underline">
            <ArrowLeft size={18} className="rotate-180" />
            Volver a mis compras
          </Link>
        </div>
      </div>
    </div>
  );
}
