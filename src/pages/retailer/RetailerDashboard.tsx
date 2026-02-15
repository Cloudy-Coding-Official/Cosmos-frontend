import { Link } from "react-router-dom";
import {
  Store,
  Users,
  BarChart3,
  Upload,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export function RetailerDashboard() {
  return (
    <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-14 h-14 rounded-2xl bg-cosmos-accent-soft flex items-center justify-center">
            <Store size={28} className="text-cosmos-accent" />
          </div>
          <div>
            <h1 className="font-display font-semibold text-cosmos-text text-2xl md:text-3xl m-0">
              Mi tienda (Retailer)
            </h1>
            <p className="text-cosmos-muted text-sm m-0">
              Gestiona productos, proveedores y tus tiendas
            </p>
          </div>
        </div>

        <div className="mb-12 p-6 bg-cosmos-surface border border-cosmos-border rounded-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-cosmos-muted mb-4">
            Tu lugar en Cosmos
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 py-4">
            <span className="px-4 py-2 bg-cosmos-surface-elevated rounded-xl text-cosmos-text font-medium border border-cosmos-border">
              Proveedores
            </span>
            <ArrowRight size={24} className="text-cosmos-muted shrink-0" />
            <span className="px-4 py-2 bg-cosmos-accent-soft text-cosmos-accent rounded-xl font-semibold border border-cosmos-accent/30">
              Tú (Retailer)
            </span>
            <ArrowRight size={24} className="text-cosmos-muted shrink-0" />
            <span className="px-4 py-2 bg-cosmos-surface-elevated rounded-xl text-cosmos-text font-medium border border-cosmos-border">
              Clientes finales
            </span>
          </div>
          <p className="text-center text-sm text-cosmos-muted mt-2">
            Recibes de proveedores, vendes a clientes. Sin capital inicial.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/retailer/productos"
            className="group block p-6 bg-cosmos-surface border border-cosmos-border rounded-2xl hover:border-cosmos-accent/40 hover:shadow-xl hover:shadow-cosmos-accent/5 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-cosmos-accent-soft flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Upload className="text-cosmos-accent" size={24} />
            </div>
            <h3 className="font-display font-semibold text-cosmos-text text-lg m-0 mb-2">
              Subir productos
            </h3>
            <p className="text-sm text-cosmos-muted m-0 mb-4">
              Sube productos propios o selecciona del catálogo de proveedores.
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-cosmos-accent">
              Ir <ArrowRight size={16} />
            </span>
          </Link>

          <Link
            to="/retailer/proveedores"
            className="group block p-6 bg-cosmos-surface border border-cosmos-border rounded-2xl hover:border-cosmos-accent/40 hover:shadow-xl hover:shadow-cosmos-accent/5 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-cosmos-accent-soft flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="text-cosmos-accent" size={24} />
            </div>
            <h3 className="font-display font-semibold text-cosmos-text text-lg m-0 mb-2">
              Proveedores
            </h3>
            <p className="text-sm text-cosmos-muted m-0 mb-4">
              Explora, selecciona proveedores y compara costos entre ellos.
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-cosmos-accent">
              Ver listado <ArrowRight size={16} />
            </span>
          </Link>

          <Link
            to="/retailer/ventas"
            className="group block p-6 bg-cosmos-surface border border-cosmos-border rounded-2xl hover:border-cosmos-accent/40 hover:shadow-xl hover:shadow-cosmos-accent/5 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-cosmos-accent-soft flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="text-cosmos-accent" size={24} />
            </div>
            <h3 className="font-display font-semibold text-cosmos-text text-lg m-0 mb-2">
              Ventas
            </h3>
            <p className="text-sm text-cosmos-muted m-0 mb-4">
              Historial de ventas a tus clientes finales.
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-cosmos-accent">
              Ver ventas <ArrowRight size={16} />
            </span>
          </Link>

          <Link
            to="/retailer/tiendas"
            className="group block p-6 bg-cosmos-surface border border-cosmos-border rounded-2xl hover:border-cosmos-accent/40 hover:shadow-xl hover:shadow-cosmos-accent/5 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-cosmos-accent-soft flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Store className="text-cosmos-accent" size={24} />
            </div>
            <h3 className="font-display font-semibold text-cosmos-text text-lg m-0 mb-2">
              Mis tiendas
            </h3>
            <p className="text-sm text-cosmos-muted m-0 mb-4">
              Gestiona varios perfiles de tienda distintos.
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-cosmos-accent">
              Ver tiendas <ArrowRight size={16} />
            </span>
          </Link>

          <div className="group block p-6 bg-cosmos-surface border border-cosmos-border rounded-2xl hover:border-cosmos-accent/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
              <BarChart3 className="text-amber-500" size={24} />
            </div>
            <h3 className="font-display font-semibold text-cosmos-text text-lg m-0 mb-2">
              Análisis de mercado
            </h3>
            <p className="text-sm text-cosmos-muted m-0 mb-4">
              Tendencias, competitividad y vendedores en tu zona.
            </p>
            <span className="text-xs text-amber-500 font-medium">Próximamente</span>
          </div>
        </div>
      </div>
    </div>
  );
}
