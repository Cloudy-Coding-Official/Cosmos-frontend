import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";

const MOCK_ITEMS = [
  { id: "1", name: "Auriculares inalámbricos", price: 49.99, quantity: 1, image: null },
  { id: "2", name: "Cargador rápido 65W", price: 22.0, quantity: 2, image: null },
];

export function Cart() {
  const subtotal = MOCK_ITEMS.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const fee = MOCK_ITEMS.length * 0.1 + subtotal * 0.01;
  const total = subtotal + fee;

  return (
    <div className="py-8 bg-cosmos-bg">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <h1 className="font-display font-medium text-cosmos-text text-2xl md:text-3xl m-0 mb-8">Tu carrito</h1>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col gap-4">
            {MOCK_ITEMS.map((item) => (
              <article
                key={item.id}
                className="flex flex-wrap gap-4 p-4 bg-cosmos-surface border border-cosmos-border text-cosmos-text rounded-xl"
              >
                <div className="w-24 h-24 shrink-0 bg-cosmos-surface-elevated rounded-lg" />
                <div className="flex-1 min-w-[180px]">
                  <Link to={`/producto/${item.id}`} className="font-medium text-cosmos-text hover:text-cosmos-accent block mb-1 transition-colors">
                    {item.name}
                  </Link>
                  <p className="text-sm text-cosmos-muted m-0 mb-2">US$ {item.price.toFixed(2)} × {item.quantity}</p>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-sm text-cosmos-muted hover:text-red-400 transition-colors"
                    aria-label="Quitar"
                  >
                    <Trash2 size={18} /> Quitar
                  </button>
                </div>
                <div className="font-medium text-cosmos-text">US$ {(item.price * item.quantity).toFixed(2)}</div>
              </article>
            ))}
          </div>

          <aside className="h-fit p-6 bg-cosmos-surface border border-cosmos-border rounded-xl">
            <h2 className="font-semibold text-lg text-cosmos-text m-0 mb-4">Resumen</h2>
            <div className="flex justify-between text-sm py-2 border-b border-cosmos-border">
              <span className="text-cosmos-muted">Subtotal</span>
              <span className="text-cosmos-text">US$ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm py-2 border-b border-cosmos-border">
              <span className="text-cosmos-muted">Protección Cosmos (1% + $0.10)</span>
              <span className="text-cosmos-text">US$ {fee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold py-3 text-cosmos-text">
              <span>Total</span>
              <span>US$ {total.toFixed(2)}</span>
            </div>
            <Link
              to="/checkout"
              className="block w-full text-center px-6 py-3.5 mt-4 font-medium bg-cosmos-accent text-cosmos-bg border-0 rounded-lg hover:bg-cosmos-accent-hover transition-colors shadow-lg"
            >
              Ir a pagar
            </Link>
            <Link to="/tienda" className="block text-center text-sm text-cosmos-accent mt-3 hover:text-cosmos-accent-hover transition-colors">
              Seguir comprando
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
