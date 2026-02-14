import { Link } from "react-router-dom";
import { Trash2, ShoppingBag, Shield } from "lucide-react";

const MOCK_ITEMS = [
  { id: "1", name: "Auriculares inalámbricos", price: 49.99, quantity: 1, image: null },
  { id: "2", name: "Cargador rápido 65W", price: 22.0, quantity: 2, image: null },
];

export function Cart() {
  const subtotal = MOCK_ITEMS.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const fee = MOCK_ITEMS.length * 0.1 + subtotal * 0.01;
  const total = subtotal + fee;

  return (
    <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-cosmos-accent-soft flex items-center justify-center">
            <ShoppingBag size={24} className="text-cosmos-accent" />
          </div>
          <div>
            <h1 className="font-display font-semibold text-cosmos-text text-2xl md:text-3xl m-0">
              Tu carrito
            </h1>
            <p className="text-cosmos-muted text-sm m-0">
              {MOCK_ITEMS.length} {MOCK_ITEMS.length === 1 ? "producto" : "productos"}
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="flex flex-col gap-4">
            {MOCK_ITEMS.map((item) => (
              <article
                key={item.id}
                className="flex flex-wrap gap-5 p-6 bg-cosmos-surface border border-cosmos-border text-cosmos-text rounded-2xl hover:border-cosmos-border-strong transition-colors"
              >
                <div className="w-24 h-24 shrink-0 bg-gradient-to-br from-cosmos-surface-elevated to-cosmos-surface rounded-xl" />
                <div className="flex-1 min-w-[200px]">
                  <Link
                    to={`/producto/${item.id}`}
                    className="font-semibold text-cosmos-text hover:text-cosmos-accent block mb-1 transition-colors"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-cosmos-muted m-0 mb-3">
                    US$ {item.price.toFixed(2)} × {item.quantity}
                  </p>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 text-sm text-cosmos-muted hover:text-red-400 transition-colors"
                    aria-label="Quitar"
                  >
                    <Trash2 size={18} />
                    Quitar
                  </button>
                </div>
                <div className="font-semibold text-cosmos-text text-lg">
                  US$ {(item.price * item.quantity).toFixed(2)}
                </div>
              </article>
            ))}
          </div>

          <aside className="h-fit">
            <div className="sticky top-24 p-6 bg-cosmos-surface border border-cosmos-border rounded-2xl">
              <div className="flex items-center gap-2 mb-6">
                <Shield size={20} className="text-cosmos-accent" />
                <h2 className="font-semibold text-lg text-cosmos-text m-0">Resumen</h2>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm py-2">
                  <span className="text-cosmos-muted">Subtotal</span>
                  <span className="text-cosmos-text">US$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm py-2">
                  <span className="text-cosmos-muted">Protección Cosmos (1% + $0.10)</span>
                  <span className="text-cosmos-text">US$ {fee.toFixed(2)}</span>
                </div>
                <div className="h-px bg-cosmos-border my-2" />
                <div className="flex justify-between font-semibold py-2 text-lg text-cosmos-text">
                  <span>Total</span>
                  <span>US$ {total.toFixed(2)}</span>
                </div>
              </div>
              <Link
                to="/checkout"
                className="block w-full text-center px-6 py-4 font-semibold bg-cosmos-accent text-cosmos-bg border-0 rounded-xl hover:bg-cosmos-accent-hover transition-all shadow-lg shadow-cosmos-accent/20"
              >
                Ir a pagar
              </Link>
              <Link
                to="/tienda"
                className="block text-center text-sm text-cosmos-accent mt-4 hover:text-cosmos-accent-hover transition-colors"
              >
                Seguir comprando
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
