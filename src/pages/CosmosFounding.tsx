import { Link } from "react-router-dom";
import { TrendingUp, ChevronRight, Leaf } from "lucide-react";

const PROYECTOS = [
  { nombre: "BioPack", categoria: "Producción", pais: "Argentina", meta: 15000, recaudado: 72, desc: "Empaques biodegradables para retail" },
  { nombre: "Café Andino", categoria: "Retail", pais: "Colombia", meta: 8000, recaudado: 45, desc: "Cadena de cafeterías de origen local" },
  { nombre: "LogiSur", categoria: "Logística", pais: "Chile", meta: 25000, recaudado: 18, desc: "Red de entrega última milla en Cono Sur" },
];

export function CosmosFounding() {
  return (
    <div className="min-h-screen bg-cosmos-bg py-10 md:py-16">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <nav className="flex items-center gap-2 text-sm text-cosmos-muted mb-10">
          <Link to="/" className="hover:text-cosmos-accent">Inicio</Link>
          <span>/</span>
          <span className="text-cosmos-text">Cosmos Founding</span>
        </nav>

        <div className="mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
            <TrendingUp size={14} />
            Cosmos Founding
          </span>
          <h1 className="font-display font-semibold text-cosmos-text text-[clamp(1.75rem,4vw,2.5rem)] m-0 mb-4 leading-tight">
            Financia proyectos en América Latina
          </h1>
          <p className="text-cosmos-muted leading-relaxed max-w-[600px] m-0">
            Cosmos Founding conecta emprendedores con inversionistas. Proyectos de retail,
            producción y logística validados por la comunidad.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          {PROYECTOS.map((p) => (
            <div
              key={p.nombre}
              className="p-6 bg-cosmos-surface border border-cosmos-border rounded-2xl hover:border-emerald-500/40 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="px-2.5 py-1 text-xs font-semibold text-emerald-400 bg-emerald-500/15 rounded-lg">
                  {p.categoria}
                </span>
                <span className="text-xs text-cosmos-muted font-medium">{p.pais}</span>
              </div>
              <h3 className="font-display font-semibold text-cosmos-text text-lg m-0 mb-2">{p.nombre}</h3>
              <p className="text-sm text-cosmos-muted m-0 mb-4 line-clamp-2 leading-relaxed">{p.desc}</p>
              <div className="space-y-2">
                <div className="h-2 bg-cosmos-bg rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                    style={{ width: `${p.recaudado}%` }}
                  />
                </div>
                <p className="text-xs text-cosmos-muted m-0">
                  <span className="font-semibold text-cosmos-text">
                    US$ {(p.meta * p.recaudado / 100).toLocaleString()}
                  </span>
                  {" · "}meta US$ {p.meta.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-8 bg-cosmos-surface border border-cosmos-border rounded-2xl flex flex-col sm:flex-row gap-6 items-start mb-12">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <Leaf className="text-emerald-400" size={28} />
          </div>
          <div>
            <h2 className="font-display font-semibold text-cosmos-text text-xl m-0 mb-2">¿Qué es Cosmos Founding?</h2>
            <p className="text-cosmos-muted leading-relaxed m-0 mb-4">
              Apoyá proyectos emprendedores verificados en América Latina. Invertí en iniciativas
              con retornos transparentes y contribuí al ecosistema regional.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Proyectos verificados", "Retornos transparentes", "LATAM first"].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 text-xs font-medium bg-cosmos-surface-elevated rounded-lg text-cosmos-text border border-cosmos-border"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/onboard"
            className="inline-flex items-center gap-2 px-6 py-3.5 font-semibold bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-colors border border-emerald-500/30"
          >
            Crear cuenta para invertir
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
