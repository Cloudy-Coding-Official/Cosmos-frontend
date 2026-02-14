import { Link } from "react-router-dom";
import { CreditCard, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

export function CosmosPay() {
  return (
    <div className="min-h-screen bg-cosmos-bg py-12 md:py-20">
      <div className="w-full max-w-[720px] mx-auto px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-cosmos-accent-soft flex items-center justify-center mx-auto mb-6">
          <CreditCard size={32} className="text-cosmos-accent" />
        </div>
        <h1 className="font-display font-semibold text-cosmos-text text-3xl md:text-4xl m-0 mb-4">
          Cosmos Pay
        </h1>
        <p className="text-cosmos-muted text-lg m-0 mb-10">
          Pasarela de pagos On Ramp · Off Ramp. Convierte moneda local a USDT y viceversa de forma segura.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <div className="p-6 bg-cosmos-surface border border-cosmos-border rounded-2xl text-left">
            <div className="flex items-center gap-2 text-cosmos-muted mb-2">
              <ArrowDownToLine size={18} />
              On Ramp
            </div>
            <p className="font-semibold text-cosmos-text text-lg m-0">Local → USDT</p>
            <p className="text-sm text-cosmos-muted m-0 mt-1">Depósito desde tu banco</p>
          </div>
          <div className="p-6 bg-cosmos-surface border border-cosmos-border rounded-2xl text-left">
            <div className="flex items-center gap-2 text-cosmos-muted mb-2">
              <ArrowUpFromLine size={18} />
              Off Ramp
            </div>
            <p className="font-semibold text-cosmos-text text-lg m-0">USDT → Local</p>
            <p className="text-sm text-cosmos-muted m-0 mt-1">Retiro a tu cuenta</p>
          </div>
        </div>
        <p className="text-sm text-cosmos-muted m-0 mb-8">
          Integración con backend en desarrollo.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 font-medium text-cosmos-accent hover:text-cosmos-accent-hover"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
