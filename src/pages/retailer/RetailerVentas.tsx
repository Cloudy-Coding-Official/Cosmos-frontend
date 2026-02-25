import { Link } from "react-router-dom";
import { DollarSign, Package, ArrowRight } from "lucide-react";

const MOCK_VENTAS = [
  { id: "V-001", fecha: "14 Feb 2025", producto: "Auriculares inalámbricos", cliente: "Cliente A", total: 49.99, estado: "Entregado" },
  { id: "V-002", fecha: "13 Feb 2025", producto: "Cargador rápido 65W", cliente: "Cliente B", total: 44.0, estado: "En camino" },
  { id: "V-003", fecha: "12 Feb 2025", producto: "Pack 3 camisetas básicas", cliente: "Cliente C", total: 24.99, estado: "Entregado" },
];

export function RetailerVentas() {
  const totalVentas = MOCK_VENTAS.reduce((acc, v) => acc + v.total, 0);

  return (
    <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <nav className="flex items-center gap-2 text-sm text-cosmos-muted mb-6">
          <Link to="/retailer" className="hover:text-cosmos-accent transition-colors">Mi tienda</Link>
          <span>/</span>
          <span className="text-cosmos-text">Ventas</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <h1 className="font-display font-semibold text-cosmos-text text-2xl md:text-3xl m-0 mb-2">
              Ventas
            </h1>
            <p className="text-cosmos-muted m-0">
              Historial de ventas a tus clientes finales.
            </p>
          </div>
          <div className="flex items-center gap-4 p-4 bg-cosmos-surface border border-cosmos-border rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-cosmos-accent-soft flex items-center justify-center">
              <DollarSign size={24} className="text-cosmos-accent" />
            </div>
            <div>
              <p className="text-xs text-cosmos-muted m-0">Total vendido</p>
              <p className="font-semibold text-cosmos-text text-xl m-0">US$ {totalVentas.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-cosmos-surface border border-cosmos-border rounded-2xl overflow-hidden">
            <thead>
              <tr className="border-b border-cosmos-border">
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-cosmos-muted px-6 py-4">
                  ID
                </th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-cosmos-muted px-6 py-4">
                  Fecha
                </th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-cosmos-muted px-6 py-4">
                  Producto
                </th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-cosmos-muted px-6 py-4">
                  Cliente
                </th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-cosmos-muted px-6 py-4">
                  Total
                </th>
                <th className="text-left text-xs font-semibold uppercase tracking-wider text-cosmos-muted px-6 py-4">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {MOCK_VENTAS.map((venta) => (
                <tr
                  key={venta.id}
                  className="border-b border-cosmos-border last:border-b-0 hover:bg-cosmos-surface-elevated/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-cosmos-text">{venta.id}</td>
                  <td className="px-6 py-4 text-cosmos-muted text-sm">{venta.fecha}</td>
                  <td className="px-6 py-4 text-cosmos-text">{venta.producto}</td>
                  <td className="px-6 py-4 text-cosmos-muted">{venta.cliente}</td>
                  <td className="px-6 py-4 font-medium text-cosmos-text">US$ {venta.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-medium rounded-lg ${
                        venta.estado === "Entregado"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {venta.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {MOCK_VENTAS.length === 0 && (
          <div className="p-12 bg-cosmos-surface border border-cosmos-border rounded-2xl text-center">
            <Package size={48} className="text-cosmos-muted mx-auto mb-4" />
            <p className="text-cosmos-muted m-0">Aún no tienes ventas.</p>
            <Link to="/retailer/tiendas" className="inline-flex items-center gap-2 mt-4 text-cosmos-accent hover:text-cosmos-accent-hover">
              Ver mis tiendas y productos <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
