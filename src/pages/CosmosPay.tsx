import { Link } from "react-router-dom";
import { CreditCard, ChevronRight } from "lucide-react";
import { CosmosPayMockup } from "../components/CosmosPayMockup";

export function CosmosPay() {
  return (
    <div className="min-h-screen bg-cosmos-bg py-10 md:py-16">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <nav className="flex items-center gap-2 text-sm text-cosmos-muted mb-10">
          <Link to="/" className="hover:text-cosmos-accent">Inicio</Link>
          <span>/</span>
          <span className="text-cosmos-text">Cosmos Pay</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 text-xs font-semibold uppercase tracking-wider text-cosmos-accent bg-cosmos-accent-soft rounded-lg">
              <CreditCard size={14} />
              Cosmos Pay
            </span>
            <h1 className="font-display font-semibold text-cosmos-text text-[clamp(1.75rem,4vw,2.5rem)] m-0 mb-4 leading-tight">
              Tu pasarela de pagos
              <br />
              <span className="text-cosmos-muted font-normal">On Ramp · Off Ramp</span>
            </h1>
            <p className="text-cosmos-muted leading-relaxed mb-6">
              Convierte moneda local a cripto y viceversa de forma segura. Paga y cobra en USDT,
              recibe en tu cuenta bancaria. Todo integrado en un solo flujo, con protección
              Cosmos en cada transacción.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Depósitos y retiros en moneda local",
                "Conversión automática USDT ↔ USD/Local",
                "Tarifas transparentes · Sin sorpresas",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-cosmos-text">
                  <span className="w-1.5 h-1.5 rounded-full bg-cosmos-accent shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-xs text-cosmos-muted">
              Protección estándar: 1% + US$ 0,10 por transacción
            </p>
          </div>
          <div className="relative lg:pl-4 flex justify-end">
            <CosmosPayMockup />
          </div>
        </div>

        <div className="mt-16 pt-12 border-t border-cosmos-border text-center">
          <Link
            to="/onboard"
            className="inline-flex items-center gap-2 px-6 py-3.5 font-semibold bg-cosmos-accent text-cosmos-bg rounded-xl hover:bg-cosmos-accent-hover transition-all"
          >
            Crear cuenta para usar Cosmos Pay
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
