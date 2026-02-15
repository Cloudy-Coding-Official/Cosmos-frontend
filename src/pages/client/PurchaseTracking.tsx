import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Package, Truck, CheckCircle, ChevronRight, ArrowLeft } from "lucide-react";
import type { Order } from "../../data/orders";
import { getOrder, ingresarCodigoComprador, marcarEnCamino } from "../../data/orders";

const PASOS: { id: "comprado" | "en_camino" | "confirmado"; label: string; icon: typeof Package }[] = [
  { id: "comprado", label: "Comprado", icon: Package },
  { id: "en_camino", label: "En Camino", icon: Truck },
  { id: "confirmado", label: "Confirmado", icon: CheckCircle },
];

export function PurchaseTracking() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | undefined>(undefined);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (id) setOrder(getOrder(id));
  }, [id]);
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [enviado, setEnviado] = useState(false);

  if (!order) {
    return (
      <div className="min-h-screen bg-cosmos-bg py-16 text-center">
        <p className="text-cosmos-muted m-0 mb-6">No se encontró la compra.</p>
        <Link to="/perfil" className="text-cosmos-accent font-medium hover:underline">
          Volver al perfil
        </Link>
      </div>
    );
  }

  const stepIndex = PASOS.findIndex((s) => s.id === order.estado);

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
      setOrder(getOrder(order.id));
    } else {
      setError("Código incorrecto");
    }
  };

  return (
    <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
      <div className="w-full max-w-[720px] mx-auto px-6">
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
            {PASOS.map((paso, i) => {
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
          <ul className="space-y-2 m-0 p-0 list-none">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between text-sm">
                <span className="text-cosmos-text">
                  {item.name} × {item.quantity}
                </span>
                <span className="text-cosmos-muted">US$ {(item.price * item.quantity).toFixed(2)}</span>
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
                setOrder(getOrder(order.id)!);
              }}
              className="px-4 py-2 text-sm font-medium bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30"
            >
              Marcar como En Camino
            </button>
          </div>
        )}

        {order.estado === "en_camino" && (
          <div className="p-6 bg-cosmos-surface border border-cosmos-border rounded-2xl">
            <h3 className="font-semibold text-cosmos-text m-0 mb-2">
              Confirmar recepción
            </h3>
            <p className="text-sm text-cosmos-muted m-0 mb-4">
              Cuando recibas el pedido, ingresá el código único que ambas partes deben ingresar para confirmar la transacción.
              El vendedor te lo enviará por email o mensaje.
            </p>
            <p className="text-xs text-amber-500/90 mb-4">
              Demo: el código es <strong className="font-mono">{order.codigoConfirmacion}</strong>
            </p>
            {order.codigoCompradorIngresado ? (
              <p className="text-emerald-400 text-sm font-medium m-0">
                ✓ Código ingresado correctamente.
              </p>
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
            <p className="text-sm text-cosmos-muted m-0">
              Ambas partes han confirmado la entrega.
            </p>
          </div>
        )}

        <div className="mt-8">
          <Link
            to="/perfil"
            className="inline-flex items-center gap-2 text-cosmos-accent font-medium hover:underline"
          >
            <ChevronRight size={18} className="rotate-180" />
            Volver a mis compras
          </Link>
        </div>
      </div>
    </div>
  );
}
