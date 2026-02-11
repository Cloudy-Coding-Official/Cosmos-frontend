import { useParams, Link } from "react-router-dom";
import { ShoppingCart, Shield, Truck } from "lucide-react";
import { useState } from "react";

const MOCK = {
  id: "1",
  name: "Auriculares inalámbricos con cancelación de ruido",
  price: 49.99,
  seller: "TechStore",
  description: "Sonido premium, batería hasta 30h. Compatible con Bluetooth 5.2. Incluye estuche y cable USB-C.",
  fee: "1% + US$ 0.10 (protección Cosmos)",
};

export function Product() {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);

  const total = (MOCK.price * quantity + 0.1) * 1.01;

  return (
    <div className="py-8 bg-cosmos-bg">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <nav className="flex items-center gap-2 text-sm text-cosmos-muted mb-8">
          <Link to="/" className="hover:text-cosmos-accent transition-colors">Inicio</Link>
          <span>/</span>
          <Link to="/tienda" className="hover:text-cosmos-accent transition-colors">Tienda</Link>
          <span>/</span>
          <span className="text-cosmos-text">{MOCK.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div className="aspect-square bg-cosmos-surface-elevated rounded-xl max-h-[480px]" />

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-cosmos-muted m-0 mb-1">{MOCK.seller}</p>
            <h1 className="font-display font-medium text-cosmos-text text-2xl md:text-3xl m-0 mb-4">{MOCK.name}</h1>
            <p className="text-xl text-cosmos-text m-0 mb-2">
              US$ {MOCK.price.toFixed(2)}
              <span className="text-sm font-normal text-cosmos-muted block mt-1">{MOCK.fee}</span>
            </p>

            <p className="text-cosmos-muted leading-relaxed mb-6">{MOCK.description}</p>

            <div className="flex flex-wrap gap-4 mb-6 text-sm text-cosmos-text">
              <span className="inline-flex items-center gap-2 px-3 py-2 bg-cosmos-surface rounded-lg">
                <Shield size={18} className="text-cosmos-accent shrink-0" /> Protección al comprador
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-2 bg-cosmos-surface rounded-lg">
                <Truck size={18} className="text-cosmos-accent shrink-0" /> Envío coordinado por Cosmos
              </span>
            </div>

            <div className="flex flex-wrap items-end gap-4">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium uppercase tracking-wider text-cosmos-muted">Cantidad</span>
                <select
                  className="w-24 px-4 py-3 font-sans text-base border border-cosmos-border bg-cosmos-surface-elevated text-cosmos-text focus:outline-none focus:border-cosmos-accent rounded-lg"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </label>
              <Link
                to={`/carrito?add=${id}&qty=${quantity}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 font-medium bg-cosmos-accent text-cosmos-bg border-0 rounded-lg hover:bg-cosmos-accent-hover transition-colors shadow-lg"
              >
                <ShoppingCart size={20} />
                Agregar al carrito — US$ {total.toFixed(2)}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
