import { useParams, Link } from "react-router-dom";
import { ShoppingCart, Shield, Truck, Star, Check } from "lucide-react";
import { useState } from "react";

const MOCK = {
  id: "1",
  name: "Auriculares inalámbricos con cancelación de ruido",
  price: 49.99,
  seller: "TechStore",
  rating: 4.8,
  reviews: 124,
  description: "Sonido premium, batería hasta 30h. Compatible con Bluetooth 5.2. Incluye estuche y cable USB-C.",
  highlights: [
    "Cancelación de ruido activa",
    "Batería 30 horas",
    "Bluetooth 5.2",
    "Estuche incluido",
  ],
  specs: [
    { label: "Conectividad", value: "Bluetooth 5.2" },
    { label: "Batería", value: "Hasta 30 h" },
    { label: "Driver", value: "40 mm" },
    { label: "Impedancia", value: "32 Ω" },
    { label: "Rango de frecuencia", value: "20 Hz - 20 kHz" },
    { label: "Peso", value: "250 g" },
    { label: "Incluye", value: "Estuche, cable USB-C" },
  ],
};

export function Product() {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);

  const total = (MOCK.price * quantity + 0.1) * 1.01;

  return (
    <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <nav className="flex items-center gap-2 text-sm text-cosmos-muted mb-8">
          <Link to="/" className="hover:text-cosmos-accent transition-colors">Inicio</Link>
          <span>/</span>
          <Link to="/tienda" className="hover:text-cosmos-accent transition-colors">Tienda</Link>
          <span>/</span>
          <span className="text-cosmos-text line-clamp-1">{MOCK.name}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-cosmos-surface-elevated to-cosmos-surface rounded-2xl overflow-hidden border border-cosmos-border max-h-[520px]">
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-cosmos-accent/90 rounded-lg">
                <Shield size={16} className="text-white" />
                <span className="text-sm font-medium text-white">Protegido por Cosmos</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-cosmos-muted m-0 mb-2">
              {MOCK.seller}
            </p>
            <h1 className="font-display font-semibold text-cosmos-text text-2xl md:text-3xl m-0 mb-3 leading-tight">
              {MOCK.name}
            </h1>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                <Star size={18} className="text-amber-400 fill-amber-400" />
                <span className="font-medium text-cosmos-text">{MOCK.rating}</span>
              </div>
              <span className="text-cosmos-muted">({MOCK.reviews} valoraciones)</span>
            </div>

            <p className="text-2xl font-bold text-cosmos-text m-0 mb-6">
              US$ {MOCK.price.toFixed(2)}
            </p>

            <p className="text-cosmos-muted leading-relaxed mb-6">{MOCK.description}</p>

            {MOCK.highlights && (
              <ul className="space-y-2 mb-6">
                {MOCK.highlights.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-cosmos-text">
                    <span className="w-5 h-5 rounded-full bg-cosmos-accent-soft flex items-center justify-center shrink-0">
                      <Check size={12} className="text-cosmos-accent" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            )}

            <div className="flex flex-wrap gap-3 mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2.5 bg-cosmos-surface rounded-xl border border-cosmos-border">
                <Shield size={18} className="text-cosmos-accent shrink-0" />
                Protección al comprador
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2.5 bg-cosmos-surface rounded-xl border border-cosmos-border">
                <Truck size={18} className="text-cosmos-accent shrink-0" />
                Envío coordinado por Cosmos
              </span>
            </div>

            <div className="flex flex-wrap items-end gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium uppercase tracking-wider text-cosmos-muted">
                  Cantidad
                </span>
                <select
                  className="w-24 px-4 py-3 font-sans text-base border border-cosmos-border bg-cosmos-surface-elevated text-cosmos-text focus:outline-none focus:border-cosmos-accent focus:ring-2 focus:ring-cosmos-accent/20 rounded-xl transition-all"
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
                className="inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold bg-cosmos-accent text-cosmos-bg border-0 rounded-xl hover:bg-cosmos-accent-hover transition-all shadow-lg shadow-cosmos-accent/20 hover:shadow-xl hover:shadow-cosmos-accent/25"
              >
                <ShoppingCart size={22} />
                Agregar al carrito — US$ {total.toFixed(2)}
              </Link>
            </div>
          </div>
        </div>

        <section className="mt-16 pt-12 border-t border-cosmos-border">
          <h2 className="font-display font-semibold text-cosmos-text text-xl m-0 mb-6">
            Especificaciones
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MOCK.specs.map((s) => (
              <div
                key={s.label}
                className="flex justify-between items-baseline gap-4 py-3 px-4 bg-cosmos-surface rounded-xl border border-cosmos-border"
              >
                <span className="text-sm text-cosmos-muted">{s.label}</span>
                <span className="text-cosmos-text font-medium text-right">{s.value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
