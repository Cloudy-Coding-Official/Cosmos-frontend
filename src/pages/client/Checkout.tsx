import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Shield, CreditCard, Truck, ChevronRight } from "lucide-react";
import { CART_ITEMS, getCartSubtotal, getCartFee, getCartTotal } from "../../data/cart";

const PASOS = [
  { id: 1, label: "Envío", icon: Truck },
  { id: 2, label: "Pago", icon: CreditCard },
  { id: 3, label: "Confirmar", icon: Shield },
];

export function Checkout() {
  const navigate = useNavigate();
  const [paso, setPaso] = useState(1);
  const [datos, setDatos] = useState({
    nombre: "",
    email: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
    pais: "",
    metodoPago: "cosmos-pay" as "cosmos-pay" | "tarjeta",
  });
  const [enviando, setEnviando] = useState(false);

  const subtotal = getCartSubtotal(CART_ITEMS);
  const fee = getCartFee(CART_ITEMS);
  const total = getCartTotal(CART_ITEMS);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setDatos((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const puedeAvanzar = () => {
    if (paso === 1) {
      return datos.nombre && datos.email && datos.direccion && datos.ciudad && datos.codigoPostal && datos.pais;
    }
    return true;
  };

  const handleSiguiente = () => {
    if (paso < 3) setPaso(paso + 1);
  };

  const handleAnterior = () => {
    if (paso > 1) setPaso(paso - 1);
  };

  const handleConfirmar = async () => {
    setEnviando(true);
    await new Promise((r) => setTimeout(r, 1500));
    setEnviando(false);
    navigate("/checkout/exito", { state: { total } });
  };

  return (
    <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
      <div className="w-full max-w-[1000px] mx-auto px-6">
        <nav className="flex items-center gap-2 text-sm text-cosmos-muted mb-8">
          <Link to="/" className="hover:text-cosmos-accent">Inicio</Link>
          <span>/</span>
          <Link to="/carrito" className="hover:text-cosmos-accent">Carrito</Link>
          <span>/</span>
          <span className="text-cosmos-text">Checkout</span>
        </nav>

        <h1 className="font-display font-semibold text-cosmos-text text-2xl m-0 mb-8">
          Checkout
        </h1>

        <div className="flex gap-4 mb-8">
          {PASOS.map((p) => {
            const Icon = p.icon;
            const activo = paso === p.id;
            const completado = paso > p.id;
            return (
              <div
                key={p.id}
                className={`flex items-center gap-2 ${activo ? "text-cosmos-accent" : completado ? "text-cosmos-muted" : "text-cosmos-muted opacity-60"}`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${
                    activo ? "bg-cosmos-accent text-cosmos-bg" : completado ? "bg-cosmos-surface-elevated" : "bg-cosmos-surface"
                  }`}
                >
                  {completado ? "✓" : <Icon size={16} />}
                </div>
                <span className="font-medium">{p.label}</span>
                {p.id < 3 && <ChevronRight size={16} className="text-cosmos-muted" />}
              </div>
            );
          })}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-8">
            {paso === 1 && (
              <section className="p-6 bg-cosmos-surface border border-cosmos-border rounded-xl">
                <h2 className="font-semibold text-cosmos-text text-lg m-0 mb-4">Datos de envío</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="sm:col-span-2">
                    <span className="block text-xs text-cosmos-muted mb-1">Nombre completo</span>
                    <input
                      type="text"
                      name="nombre"
                      value={datos.nombre}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-cosmos-bg border border-cosmos-border rounded-lg text-cosmos-text focus:outline-none focus:border-cosmos-accent"
                      placeholder="María García"
                    />
                  </label>
                  <label className="sm:col-span-2">
                    <span className="block text-xs text-cosmos-muted mb-1">Email</span>
                    <input
                      type="email"
                      name="email"
                      value={datos.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-cosmos-bg border border-cosmos-border rounded-lg text-cosmos-text focus:outline-none focus:border-cosmos-accent"
                      placeholder="maria@ejemplo.com"
                    />
                  </label>
                  <label className="sm:col-span-2">
                    <span className="block text-xs text-cosmos-muted mb-1">Dirección</span>
                    <input
                      type="text"
                      name="direccion"
                      value={datos.direccion}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-cosmos-bg border border-cosmos-border rounded-lg text-cosmos-text focus:outline-none focus:border-cosmos-accent"
                      placeholder="Av. Corrientes 1234"
                    />
                  </label>
                  <label>
                    <span className="block text-xs text-cosmos-muted mb-1">Ciudad</span>
                    <input
                      type="text"
                      name="ciudad"
                      value={datos.ciudad}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-cosmos-bg border border-cosmos-border rounded-lg text-cosmos-text focus:outline-none focus:border-cosmos-accent"
                      placeholder="Buenos Aires"
                    />
                  </label>
                  <label>
                    <span className="block text-xs text-cosmos-muted mb-1">Código postal</span>
                    <input
                      type="text"
                      name="codigoPostal"
                      value={datos.codigoPostal}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-cosmos-bg border border-cosmos-border rounded-lg text-cosmos-text focus:outline-none focus:border-cosmos-accent"
                      placeholder="1043"
                    />
                  </label>
                  <label className="sm:col-span-2">
                    <span className="block text-xs text-cosmos-muted mb-1">País</span>
                    <input
                      type="text"
                      name="pais"
                      value={datos.pais}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-cosmos-bg border border-cosmos-border rounded-lg text-cosmos-text focus:outline-none focus:border-cosmos-accent"
                      placeholder="Argentina"
                    />
                  </label>
                </div>
              </section>
            )}

            {paso === 2 && (
              <section className="p-6 bg-cosmos-surface border border-cosmos-border rounded-xl">
                <h2 className="font-semibold text-cosmos-text text-lg m-0 mb-4">Método de pago</h2>
                <div className="space-y-3">
                  <label
                    className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer hover:border-cosmos-accent/50 ${
                      datos.metodoPago === "cosmos-pay"
                        ? "border-cosmos-accent bg-cosmos-accent-soft"
                        : "border-cosmos-border"
                    }`}
                  >
                    <input
                      type="radio"
                      name="metodoPago"
                      value="cosmos-pay"
                      checked={datos.metodoPago === "cosmos-pay"}
                      onChange={handleChange}
                      className="accent-cosmos-accent"
                    />
                    <div>
                      <p className="font-medium text-cosmos-text m-0">Cosmos Pay (USDT)</p>
                      <p className="text-sm text-cosmos-muted m-0">Paga con USDT. On/Off ramp integrado.</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-4 p-4 border border-cosmos-border rounded-xl cursor-pointer hover:border-cosmos-accent/50 opacity-60">
                    <input type="radio" disabled className="accent-cosmos-accent" />
                    <div>
                      <p className="font-medium text-cosmos-text m-0">Tarjeta de crédito/débito</p>
                      <p className="text-sm text-cosmos-muted m-0">Próximamente</p>
                    </div>
                  </label>
                </div>
              </section>
            )}

            {paso === 3 && (
              <section className="p-6 bg-cosmos-surface border border-cosmos-border rounded-xl">
                <h2 className="font-semibold text-cosmos-text text-lg m-0 mb-4">Resumen del pedido</h2>
                <div className="space-y-3 text-sm">
                  <p className="text-cosmos-muted m-0">
                    <strong className="text-cosmos-text">Envío a:</strong> {datos.nombre}, {datos.direccion}, {datos.ciudad}
                  </p>
                  <p className="text-cosmos-muted m-0 mb-5">
                    <strong className="text-cosmos-text">Pago:</strong> Cosmos Pay (USDT)
                  </p>
                  <div className="pt-4 border-t border-cosmos-border">
                    <p className="text-cosmos-muted m-0 mb-1">
                      Tus fondos están protegidos hasta que recibas el pedido.
                    </p>
                    <p className="text-xs text-cosmos-muted m-0">
                      Al confirmar serás redirigido a Cosmos Pay para completar el pago.
                    </p>
                  </div>
                </div>
              </section>
            )}
          </div>

          <aside className="h-fit">
            <div className="sticky top-24 p-6 bg-cosmos-surface border border-cosmos-border rounded-xl">
              <h2 className="font-semibold text-cosmos-text m-0 mb-4">Tu pedido</h2>
              <div className="space-y-3 mb-4 max-h-[200px] overflow-y-auto">
                {CART_ITEMS.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-cosmos-text">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="text-cosmos-muted">US$ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-2 py-4 border-t border-cosmos-border">
                <div className="flex justify-between text-sm">
                  <span className="text-cosmos-muted">Subtotal</span>
                  <span className="text-cosmos-text">US$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-cosmos-muted">Protección (1% + $0.10)</span>
                  <span className="text-cosmos-text">US$ {fee.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between font-semibold text-lg py-2 text-cosmos-text">
                <span>Total</span>
                <span>US$ {total.toFixed(2)}</span>
              </div>

              <div className="flex gap-3 mt-6">
                {paso > 1 && (
                  <button
                    type="button"
                    onClick={handleAnterior}
                    className="flex-1 py-3 font-medium border border-cosmos-border rounded-lg text-cosmos-text hover:border-cosmos-accent hover:text-cosmos-accent"
                  >
                    Atrás
                  </button>
                )}
                {paso < 3 ? (
                  <button
                    type="button"
                    onClick={handleSiguiente}
                    disabled={!puedeAvanzar()}
                    className="flex-1 py-3 font-medium bg-cosmos-accent text-cosmos-bg rounded-lg hover:bg-cosmos-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleConfirmar}
                    disabled={enviando}
                    className="flex-1 py-3 font-medium bg-cosmos-accent text-cosmos-bg rounded-lg hover:bg-cosmos-accent-hover disabled:opacity-70"
                  >
                    {enviando ? "Procesando…" : "Confirmar y pagar"}
                  </button>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
