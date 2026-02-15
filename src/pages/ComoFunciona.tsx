import { Link } from "react-router-dom";
import { Shield, Zap, ArrowRight, Building2, Store, Users } from "lucide-react";

export function ComoFunciona() {
  return (
    <div className="min-h-screen bg-cosmos-bg py-10 md:py-16">
      <div className="w-full max-w-[800px] mx-auto px-6">
        <h1 className="font-display font-semibold text-cosmos-text text-2xl md:text-3xl m-0 mb-2">
          Cómo funciona
        </h1>
        <p className="text-cosmos-muted m-0 mb-12">
          El flujo de Cosmos y la protección de cada transacción.
        </p>

        <section className="mb-12">
          <h2 className="font-semibold text-cosmos-text text-lg m-0 mb-4">
            El flujo
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3 py-6 px-4 bg-cosmos-surface border border-cosmos-border rounded-xl mb-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-cosmos-surface-elevated rounded-lg">
              <Building2 size={18} className="text-cosmos-muted" />
              <span className="font-medium text-cosmos-text">Proveedores</span>
            </div>
            <ArrowRight size={20} className="text-cosmos-muted" />
            <div className="flex items-center gap-2 px-4 py-2 bg-cosmos-accent-soft rounded-lg border border-cosmos-accent/30">
              <Store size={18} className="text-cosmos-accent" />
              <span className="font-medium text-cosmos-text">Retailers</span>
            </div>
            <ArrowRight size={20} className="text-cosmos-muted" />
            <div className="flex items-center gap-2 px-4 py-2 bg-cosmos-surface-elevated rounded-lg">
              <Users size={18} className="text-cosmos-muted" />
              <span className="font-medium text-cosmos-text">Clientes</span>
            </div>
          </div>
          <p className="text-sm text-cosmos-muted m-0">
            Los proveedores abastecen a los retailers. Los retailers venden a los clientes. Cosmos es el intermediario que asegura que todo salga bien.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="font-semibold text-cosmos-text text-lg m-0 mb-4">
            Protección de punta a punta
          </h2>
          <p className="text-cosmos-muted mb-6 m-0">
            Cosmos retiene los fondos hasta que el comprador confirme la recepción. Si hay problema, se resuelve antes de liberar el pago.
          </p>
          <div className="space-y-4">
            <div className="flex gap-4 p-4 bg-cosmos-surface border border-cosmos-border rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-cosmos-accent-soft flex items-center justify-center shrink-0">
                <Shield size={20} className="text-cosmos-accent" />
              </div>
              <div>
                <h3 className="font-medium text-cosmos-text m-0 mb-1">Fondos asegurados</h3>
                <p className="text-sm text-cosmos-muted m-0">El dinero existe. No se libera hasta que el producto llegue.</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 bg-cosmos-surface border border-cosmos-border rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-cosmos-accent-soft flex items-center justify-center shrink-0">
                <Zap size={20} className="text-cosmos-accent" />
              </div>
              <div>
                <h3 className="font-medium text-cosmos-text m-0 mb-1">Entrega garantizada</h3>
                <p className="text-sm text-cosmos-muted m-0">El producto llega a manos del comprador. Si no llega, se reembolsa.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="font-semibold text-cosmos-text text-lg m-0 mb-4">
            Costo
          </h2>
          <p className="text-cosmos-muted m-0 mb-4">
            1% + US$ 0,10 por transacción. Eso incluye la protección al comprador.
          </p>
          <p className="text-sm text-cosmos-muted m-0">
            El vendedor paga el fee. El comprador no paga extra por la protección.
          </p>
        </section>

        <div className="pt-8 border-t border-cosmos-border">
          <Link
            to="/vender"
            className="inline-flex items-center gap-2 text-cosmos-accent font-medium hover:text-cosmos-accent-hover"
          >
            Quiero vender <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
