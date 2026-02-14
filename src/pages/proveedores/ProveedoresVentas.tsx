import { Link } from "react-router-dom";
import { TrendingUp, FileText } from "lucide-react";

export function ProveedoresVentas() {
  return (
    <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <nav className="flex items-center gap-2 text-sm text-cosmos-muted mb-6">
          <Link to="/proveedores" className="hover:text-emerald-400 transition-colors">Proveedores</Link>
          <span>/</span>
          <span className="text-cosmos-text">Ventas y transacciones</span>
        </nav>

        <h1 className="font-display font-semibold text-cosmos-text text-2xl md:text-3xl m-0 mb-2">
          Ventas y transacciones
        </h1>
        <p className="text-cosmos-muted m-0 mb-10">
          Listado de ventas realizadas y transacciones con retailers.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-6 bg-cosmos-surface border border-cosmos-border rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp size={24} className="text-emerald-400" />
              </div>
              <h3 className="font-display font-semibold text-cosmos-text text-lg m-0">
                Listado de ventas
              </h3>
            </div>
            <p className="text-sm text-cosmos-muted m-0">
              Historial de ventas a retailers y clientes finales.
            </p>
          </div>

          <div className="p-6 bg-cosmos-surface border border-cosmos-border rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <FileText size={24} className="text-emerald-400" />
              </div>
              <h3 className="font-display font-semibold text-cosmos-text text-lg m-0">
                Listado de transacciones
              </h3>
            </div>
            <p className="text-sm text-cosmos-muted m-0">
              Detalle de cada transacción y su estado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
