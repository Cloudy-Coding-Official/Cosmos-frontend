import { Link } from "react-router-dom";
import { Leaf, TrendingUp } from "lucide-react";

export function CosmosFounding() {
  return (
    <div className="min-h-screen bg-cosmos-bg py-12 md:py-20">
      <div className="w-full max-w-[720px] mx-auto px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
          <Leaf size={32} className="text-emerald-400" />
        </div>
        <h1 className="font-display font-semibold text-cosmos-text text-3xl md:text-4xl m-0 mb-4">
          Cosmos Founding
        </h1>
        <p className="text-cosmos-muted text-lg m-0 mb-10">
          Financia proyectos emprendedores en América Latina. Invierte en iniciativas verificadas y genera impacto en la región.
        </p>
        <div className="p-6 bg-cosmos-surface border border-emerald-500/20 rounded-2xl mb-10 text-left">
          <h3 className="font-display font-semibold text-cosmos-text m-0 mb-2 flex items-center gap-2">
            <TrendingUp size={20} className="text-emerald-400" />
            Próximamente
          </h3>
          <p className="text-sm text-cosmos-muted m-0">
            Estamos preparando la plataforma para conectar emprendedores con inversionistas en toda Latinoamérica.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 font-medium text-emerald-400 hover:text-emerald-300"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
