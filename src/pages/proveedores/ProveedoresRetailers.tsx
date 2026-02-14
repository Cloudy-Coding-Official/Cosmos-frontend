import { Link } from "react-router-dom";
import { Store } from "lucide-react";

const MOCK_RETAILERS = [
  { id: "1", name: "TechStore", ordersCount: 12, status: "Activo" },
  { id: "2", name: "ModaLatam", ordersCount: 8, status: "Activo" },
  { id: "3", name: "DeportesYA", ordersCount: 0, status: "Solicitud pendiente" },
];

export function ProveedoresRetailers() {
  return (
    <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <nav className="flex items-center gap-2 text-sm text-cosmos-muted mb-6">
          <Link to="/proveedores" className="hover:text-emerald-400 transition-colors">Proveedores</Link>
          <span>/</span>
          <span className="text-cosmos-text">Retailers</span>
        </nav>

        <h1 className="font-display font-semibold text-cosmos-text text-2xl md:text-3xl m-0 mb-2">
          Listado de retailers
        </h1>
        <p className="text-cosmos-muted m-0 mb-10">
          Retailers que compran tus productos. Envía solicitudes directas y ofréceles precios especiales.
        </p>

        <div className="space-y-4">
          {MOCK_RETAILERS.map((retailer) => (
            <div
              key={retailer.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-cosmos-surface border border-cosmos-border rounded-2xl hover:border-emerald-500/30 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Store size={24} className="text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-cosmos-text text-lg m-0 mb-1">
                    {retailer.name}
                  </h3>
                  <p className="text-sm text-cosmos-muted m-0 mb-1">
                    {retailer.ordersCount} pedidos realizados
                  </p>
                  <span
                    className={`inline-block px-3 py-1 text-xs font-medium rounded-lg ${
                      retailer.status === "Activo"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {retailer.status}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 text-sm font-medium text-emerald-400 border border-emerald-500/30 rounded-xl hover:bg-emerald-500/10 transition-colors">
                  Solicitar conexión
                </button>
                <button className="px-4 py-2 text-sm font-medium text-cosmos-text border border-cosmos-border rounded-xl hover:border-emerald-500/30 transition-colors">
                  Precios especiales
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
