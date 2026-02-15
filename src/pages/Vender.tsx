import { Link } from "react-router-dom";
import { Store, Package, ArrowRight } from "lucide-react";

export function Vender() {
  return (
    <div className="min-h-screen bg-cosmos-bg py-10 md:py-16">
      <div className="w-full max-w-[900px] mx-auto px-6">
        <h1 className="font-display font-semibold text-cosmos-text text-2xl md:text-3xl m-0 mb-2">
          Vender en Cosmos
        </h1>
        <p className="text-cosmos-muted m-0 mb-12">
          Podés vender de dos formas. Elegí la que te corresponde.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <Link
            to="/vender/sin-stock"
            className="block p-6 bg-cosmos-surface border border-cosmos-border rounded-xl hover:border-cosmos-accent/40 transition-colors group"
          >
            <div className="w-12 h-12 rounded-xl bg-cosmos-accent-soft flex items-center justify-center mb-4">
              <Store size={24} className="text-cosmos-accent" />
            </div>
            <h2 className="font-semibold text-cosmos-text text-lg m-0 mb-2 group-hover:text-cosmos-accent transition-colors">
              Vender sin stock
            </h2>
            <p className="text-sm text-cosmos-muted m-0 mb-4">
              Conectás con proveedores, elegís qué vender y revendés a clientes. Sin capital inicial.
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-cosmos-accent">
              Crear cuenta de vendedor <ArrowRight size={14} />
            </span>
          </Link>

          <Link
            to="/proveedores"
            className="block p-6 bg-cosmos-surface border border-cosmos-border rounded-xl hover:border-cosmos-accent/40 transition-colors group"
          >
            <div className="w-12 h-12 rounded-xl bg-cosmos-accent-soft flex items-center justify-center mb-4">
              <Package size={24} className="text-cosmos-accent" />
            </div>
            <h2 className="font-semibold text-cosmos-text text-lg m-0 mb-2 group-hover:text-cosmos-accent transition-colors">
              Tenés productos
            </h2>
            <p className="text-sm text-cosmos-muted m-0 mb-4">
              Sos productor o importador. Vendés a retailers que revenden en sus tiendas.
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-cosmos-accent">
              Ir a Proveedores <ArrowRight size={14} />
            </span>
          </Link>
        </div>

        <div className="mt-12 p-6 bg-cosmos-surface/50 border border-cosmos-border rounded-xl">
          <p className="text-sm text-cosmos-muted m-0">
            <strong className="text-cosmos-text">Flujo:</strong> Proveedores abastecen a Retailers, y Retailers venden a Clientes. La plataforma protege cada transacción.
          </p>
        </div>
      </div>
    </div>
  );
}
