import { Link } from "react-router-dom";
import {
  Building2,
  Package,
  Users,
  TrendingUp,
  DollarSign,
  Truck,
  ArrowRight,
} from "lucide-react";

export function ProveedoresDashboard() {
  return (
    <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
            <Building2 size={28} className="text-emerald-400" />
          </div>
          <div>
            <h1 className="font-display font-semibold text-cosmos-text text-2xl md:text-3xl m-0">
              Portal Proveedores
            </h1>
            <p className="text-cosmos-muted text-sm m-0">
              Llega a retailers y clientes en todo Latinoamérica
            </p>
          </div>
        </div>

        {/* Flujo: Proveedor → Retailers → Clientes */}
        <div className="mb-12 p-6 bg-cosmos-surface border border-cosmos-border rounded-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-cosmos-muted mb-4">
            Tu lugar en Cosmos
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 py-4">
            <span className="px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-xl font-semibold border border-emerald-500/20">
              Tú (Proveedor)
            </span>
            <ArrowRight size={24} className="text-cosmos-muted shrink-0" />
            <span className="px-4 py-2 bg-cosmos-surface-elevated rounded-xl text-cosmos-text font-medium border border-cosmos-border">
              Retailers
            </span>
            <ArrowRight size={24} className="text-cosmos-muted shrink-0" />
            <span className="px-4 py-2 bg-cosmos-surface-elevated rounded-xl text-cosmos-text font-medium border border-cosmos-border">
              Clientes finales
            </span>
          </div>
          <p className="text-center text-sm text-cosmos-muted mt-2">
            Canal principal: abasteces a retailers. Canal limitado: venta directa a clientes.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/proveedores/productos"
            className="group block p-6 bg-cosmos-surface border border-cosmos-border rounded-2xl hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Package className="text-emerald-400" size={24} />
            </div>
            <h3 className="font-display font-semibold text-cosmos-text text-lg m-0 mb-2">
              Subir productos
            </h3>
            <p className="text-sm text-cosmos-muted m-0 mb-4">
              Publica tu catálogo para que los retailers puedan venderlo.
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400">
              Ir <ArrowRight size={16} />
            </span>
          </Link>

          <Link
            to="/proveedores/perfil"
            className="group block p-6 bg-cosmos-surface border border-cosmos-border rounded-2xl hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Building2 className="text-emerald-400" size={24} />
            </div>
            <h3 className="font-display font-semibold text-cosmos-text text-lg m-0 mb-2">
              Perfil de proveedor
            </h3>
            <p className="text-sm text-cosmos-muted m-0 mb-4">
              Tu perfil único visible por retailers.
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400">
              Ver perfil <ArrowRight size={16} />
            </span>
          </Link>

          <Link
            to="/proveedores/retailers"
            className="group block p-6 bg-cosmos-surface border border-cosmos-border rounded-2xl hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="text-emerald-400" size={24} />
            </div>
            <h3 className="font-display font-semibold text-cosmos-text text-lg m-0 mb-2">
              Listado de retailers
            </h3>
            <p className="text-sm text-cosmos-muted m-0 mb-4">
              Retailers que compran o a los que puedes solicitar.
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400">
              Ver retailers <ArrowRight size={16} />
            </span>
          </Link>

          <Link
            to="/proveedores/ventas"
            className="group block p-6 bg-cosmos-surface border border-cosmos-border rounded-2xl hover:border-emerald-500/40 transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
              <TrendingUp className="text-emerald-400" size={24} />
            </div>
            <h3 className="font-display font-semibold text-cosmos-text text-lg m-0 mb-2">
              Ventas y transacciones
            </h3>
            <p className="text-sm text-cosmos-muted m-0 mb-4">
              Listado de ventas y transacciones.
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400">
              Ver <ArrowRight size={16} />
            </span>
          </Link>

          <div className="group block p-6 bg-cosmos-surface border border-cosmos-border rounded-2xl hover:border-emerald-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
              <DollarSign className="text-emerald-400" size={24} />
            </div>
            <h3 className="font-display font-semibold text-cosmos-text text-lg m-0 mb-2">
              Precios y competencia
            </h3>
            <p className="text-sm text-cosmos-muted m-0 mb-4">
              Precios especiales a retailers y análisis de competencia.
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400">
              Ver <ArrowRight size={16} />
            </span>
          </div>

          <div className="group block p-6 bg-cosmos-surface border border-cosmos-border rounded-2xl hover:border-emerald-500/40 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
              <Truck className="text-emerald-400" size={24} />
            </div>
            <h3 className="font-display font-semibold text-cosmos-text text-lg m-0 mb-2">
              Seguimiento de envíos
            </h3>
            <p className="text-sm text-cosmos-muted m-0 mb-4">
              Estado de pedidos y envíos a retailers.
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400">
              Ver <ArrowRight size={16} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
