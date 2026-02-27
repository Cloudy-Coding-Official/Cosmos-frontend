import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Shield, CreditCard, Truck, ChevronRight, Wallet } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useStellarWallet } from "../../context/StellarWalletContext";
import { createOrder } from "../../api/orders";
import { getErrorMessage } from "../../api/client";
import { ProductImage } from "../../components/ProductImage";
import { CheckoutTrustlessPayment } from "../../components/CheckoutTrustlessPayment";

const PASOS = [
  { id: 1, label: "Envío", icon: Truck },
  { id: 2, label: "Pago", icon: CreditCard },
  { id: 3, label: "Confirmar", icon: Shield },
];

export function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { address: stellarAddress, connect: connectStellar, isConnecting: stellarConnecting } = useStellarWallet();
  const { items, isValidating, refreshCart, subtotal, fee, total, clearCart } = useCart();
  const [paso, setPaso] = useState(1);
  const [showTrustlessPayment, setShowTrustlessPayment] = useState(false);
  const [orderIdToPay, setOrderIdToPay] = useState<string | null>(null);
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
  const [errorOrden, setErrorOrden] = useState<string | null>(null);
  const hasRefreshed = useRef(false);

  useEffect(() => {
    if (items.length > 0 && !hasRefreshed.current) {
      hasRefreshed.current = true;
      refreshCart();
    }
    if (items.length === 0) {
      hasRefreshed.current = false;
    }
  }, [items.length, refreshCart]);

  useEffect(() => {
    if (items.length === 0 && !isValidating) {
      navigate("/carrito", { replace: true });
    }
  }, [items.length, isValidating, navigate]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cosmos-bg py-8 md:py-12 flex items-center justify-center">
        <p className="text-cosmos-muted">
          {isValidating ? "Actualizando carrito…" : "Redirigiendo al carrito…"}
        </p>
      </div>
    );
  }

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
    if (!user?.buyerProfileId) {
      setErrorOrden("Necesitás iniciar sesión con una cuenta de comprador para finalizar.");
      return;
    }
    setErrorOrden(null);
    setEnviando(true);
    try {
      const shippingInfo = {
        recipientName: datos.nombre,
        email: datos.email,
        address: datos.direccion,
        city: datos.ciudad,
        postalCode: datos.codigoPostal,
        country: datos.pais,
      };
      const byStore = new Map<string, typeof items>();
      for (const item of items) {
        const key = `${item.storeId}:${item.providerId}`;
        if (!byStore.has(key)) byStore.set(key, []);
        byStore.get(key)!.push(item);
      }
      const orderIds: string[] = [];
      for (const [, groupItems] of byStore) {
        const storeId = groupItems[0].storeId;
        const providerId = groupItems[0].providerId;
        const currency = groupItems[0].currency ?? "USD";
        const order = await createOrder({
          buyerId: user.buyerProfileId,
          storeId,
          providerId,
          items: groupItems.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            unitPrice: i.price,
          })),
          currency,
          shippingInfo,
        });
        orderIds.push(order.id);
      }

      if (datos.metodoPago === "cosmos-pay" && orderIds.length > 0) {
        setOrderIdToPay(orderIds[0]);
        setShowTrustlessPayment(true);
        setEnviando(false);
        return;
      }

      clearCart();
      navigate("/perfil/compras/" + orderIds[0]);
    } catch (err) {
      setErrorOrden(getErrorMessage(err, "Error al crear el pedido. Intentá de nuevo."));
    } finally {
      setEnviando(false);
    }
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

        {showTrustlessPayment && orderIdToPay && (
          <CheckoutTrustlessPayment
            orderId={orderIdToPay}
            onSuccess={() => {
              clearCart();
              navigate("/perfil/compras/" + orderIdToPay);
            }}
            onBack={() => {
              setShowTrustlessPayment(false);
              setOrderIdToPay(null);
            }}
          />
        )}

        {!showTrustlessPayment && (
        <>
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
                    <div className="flex-1">
                      <p className="font-medium text-cosmos-text m-0">Cosmos Pay (Stellar / USDC)</p>
                      <p className="text-sm text-cosmos-muted m-0">
                        Pagá con tu wallet Stellar. Los fondos quedan en custodia hasta que confirmes la entrega.
                      </p>
                      {datos.metodoPago === "cosmos-pay" && (
                        <div className="mt-3">
                          {stellarAddress ? (
                            <p className="text-sm text-cosmos-muted m-0">
                              Wallet: <span className="font-mono text-cosmos-text">{stellarAddress.slice(0, 8)}…{stellarAddress.slice(-6)}</span>
                            </p>
                          ) : (
                            <button
                              type="button"
                              onClick={() => connectStellar()}
                              disabled={stellarConnecting}
                              className="inline-flex items-center gap-2 mt-1 px-3 py-2 rounded-lg bg-cosmos-surface-elevated border border-cosmos-border text-cosmos-text hover:border-cosmos-accent text-sm font-medium"
                            >
                              <Wallet size={16} />
                              {stellarConnecting ? "Conectando…" : "Conectar wallet Stellar"}
                            </button>
                          )}
                        </div>
                      )}
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
                {items.map((item) => (
                  <div key={`${item.productId}-${item.storeId}`} className="flex items-center gap-3 text-sm">
                    <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-cosmos-surface-elevated">
                      <ProductImage
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        wrapperClassName="w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-cosmos-text block truncate">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-cosmos-muted">{(item.currency ?? "USD")} {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-2 py-4 border-t border-cosmos-border">
                <div className="flex justify-between text-sm">
                  <span className="text-cosmos-muted">Subtotal</span>
                  <span className="text-cosmos-text">{(items[0]?.currency ?? "USD")} {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-cosmos-muted">Servicio</span>
                  <span className="text-cosmos-text">{(items[0]?.currency ?? "USD")} {fee.toFixed(2)}</span>
                </div>
                <p className="text-xs text-cosmos-muted mt-2">
                  Comisión Cosmos (1% o 2% según modalidad del proveedor) incluida en el flujo de pago.
                </p>
              </div>
              <div className="flex justify-between font-semibold text-lg py-2 text-cosmos-text">
                <span>Total</span>
                <span>{(items[0]?.currency ?? "USD")} {total.toFixed(2)}</span>
              </div>

              {errorOrden && (
                <div className="mt-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
                  {errorOrden}
                </div>
              )}
              <div className="flex gap-3 mt-6">
                {paso > 1 && (
                  <button
                    type="button"
                    onClick={handleAnterior}
                    className="flex-1 py-3 font-medium border border-cosmos-border rounded-lg text-cosmos-text hover:border-cosmos-accent hover:text-cosmos-accent hover:bg-cosmos-surface-elevated transition-colors"
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
                    className="flex-1 py-3 font-medium bg-cosmos-accent text-cosmos-bg rounded-lg hover:bg-cosmos-accent-hover transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {enviando ? "Procesando…" : "Confirmar y pagar"}
                  </button>
                )}
              </div>
            </div>
          </aside>
        </div>
        </>
        )}
      </div>
    </div>
  );
}
