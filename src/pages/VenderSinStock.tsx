import { Link } from "react-router-dom";
import { Store, Users, Upload, ArrowRight, Building2 } from "lucide-react";

export function VenderSinStock() {
  return (
    <div className="min-h-screen bg-cosmos-bg py-10 md:py-16">
      <div className="w-full max-w-[900px] mx-auto px-6">
        <nav className="flex items-center gap-2 text-sm text-cosmos-muted mb-8">
          <Link to="/vender" className="hover:text-cosmos-accent">Vender</Link>
          <span>/</span>
          <span className="text-cosmos-text">Vender sin stock</span>
        </nav>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-xl bg-cosmos-accent-soft flex items-center justify-center">
            <Store size={28} className="text-cosmos-accent" />
          </div>
          <div>
            <h1 className="font-display font-semibold text-cosmos-text text-2xl md:text-3xl m-0 mb-1">
              Vender sin stock
            </h1>
            <p className="text-cosmos-muted m-0">
              Sos el intermediario. Proveedores te abastecen, vos vendés a clientes.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 py-6 px-4 bg-cosmos-surface border border-cosmos-border rounded-xl mb-10">
          <span className="px-4 py-2 bg-cosmos-surface-elevated rounded-lg text-cosmos-muted text-sm">
            Proveedores
          </span>
          <ArrowRight size={18} className="text-cosmos-muted" />
          <span className="px-4 py-2 bg-cosmos-accent-soft text-cosmos-accent rounded-lg font-medium">
            Vos (Retailer)
          </span>
          <ArrowRight size={18} className="text-cosmos-muted" />
          <span className="px-4 py-2 bg-cosmos-surface-elevated rounded-lg text-cosmos-muted text-sm">
            Clientes
          </span>
        </div>

        <div className="space-y-6 mb-10">
          <div className="flex gap-4 p-4 bg-cosmos-surface border border-cosmos-border rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-cosmos-accent-soft flex items-center justify-center shrink-0">
              <Users size={20} className="text-cosmos-accent" />
            </div>
            <div>
              <h2 className="font-semibold text-cosmos-text m-0 mb-1">Conectás con proveedores</h2>
              <p className="text-sm text-cosmos-muted m-0">
                Buscás en el catálogo de proveedores, elegís productos y los listás en tu tienda.
              </p>
            </div>
          </div>
          <div className="flex gap-4 p-4 bg-cosmos-surface border border-cosmos-border rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-cosmos-accent-soft flex items-center justify-center shrink-0">
              <Upload size={20} className="text-cosmos-accent" />
            </div>
            <div>
              <h2 className="font-semibold text-cosmos-text m-0 mb-1">Sin capital inicial</h2>
              <p className="text-sm text-cosmos-muted m-0">
                No comprás stock. El proveedor envía directo al cliente. Vos cobrás la diferencia.
              </p>
            </div>
          </div>
          <div className="flex gap-4 p-4 bg-cosmos-surface border border-cosmos-border rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-cosmos-accent-soft flex items-center justify-center shrink-0">
              <Building2 size={20} className="text-cosmos-accent" />
            </div>
            <div>
              <h2 className="font-semibold text-cosmos-text m-0 mb-1">Protección Cosmos</h2>
              <p className="text-sm text-cosmos-muted m-0">
                El comprador paga a Cosmos. Cuando recibe el producto, vos cobrás. Sin riesgo de impago.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/onboard?role=retailer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold bg-cosmos-accent text-cosmos-bg rounded-xl hover:bg-cosmos-accent-hover"
          >
            Crear cuenta
            <ArrowRight size={18} />
          </Link>
          <Link
            to="/retailer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 font-medium border border-cosmos-border rounded-xl text-cosmos-text hover:border-cosmos-accent hover:text-cosmos-accent"
          >
            Ya tengo cuenta — Ir a mi tienda
          </Link>
        </div>

        <Link to="/como-funciona" className="block mt-8 text-sm text-cosmos-muted hover:text-cosmos-accent">
          Cómo funciona la protección →
        </Link>
      </div>
    </div>
  );
}
