import { Link, useLocation } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export function CheckoutSuccess() {
  const location = useLocation();
  const total = (location.state as { total?: number })?.total ?? 0;

  return (
    <div className="min-h-screen bg-cosmos-bg py-16 md:py-24 flex items-center justify-center">
      <div className="w-full max-w-[480px] mx-auto px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-emerald-400" />
        </div>
        <h1 className="font-display font-semibold text-cosmos-text text-2xl m-0 mb-2">
          ¡Pedido confirmado!
        </h1>
        <p className="text-cosmos-muted m-0 mb-8">
          Tu pago de US$ {total.toFixed(2)} fue procesado. Recibirás un email con los detalles del envío.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/tienda"
            className="inline-flex justify-center px-6 py-3 font-medium bg-cosmos-accent text-cosmos-bg rounded-lg hover:bg-cosmos-accent-hover"
          >
            Seguir comprando
          </Link>
          <Link
            to="/perfil"
            className="inline-flex justify-center px-6 py-3 font-medium border border-cosmos-border rounded-lg text-cosmos-text hover:border-cosmos-accent hover:text-cosmos-accent"
          >
            Ver mi perfil
          </Link>
        </div>
      </div>
    </div>
  );
}
