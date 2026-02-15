import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { useState } from "react";

const MOCK_VENTAS = [
  { id: "V-101", fecha: "14 Feb", retailer: "TechStore", producto: "Cargador 65W x 10", total: 220, estado: "Entregado" },
  { id: "V-102", fecha: "13 Feb", retailer: "ModaLatam", producto: "Camisetas x 50", total: 450, estado: "En camino" },
  { id: "V-103", fecha: "11 Feb", retailer: "DeportesYA", producto: "Zapatillas x 5", total: 380, estado: "Entregado" },
];

const MOCK_TRANSACCIONES = [
  { id: "T-201", fecha: "14 Feb", tipo: "Venta", monto: 220, estado: "Completada" },
  { id: "T-202", fecha: "13 Feb", tipo: "Venta", monto: 450, estado: "Pendiente" },
  { id: "T-203", fecha: "12 Feb", tipo: "Reembolso", monto: -22, estado: "Completada" },
];

export function ProveedoresVentas() {
  const [tab, setTab] = useState<"ventas" | "transacciones">("ventas");
  const totalVentas = MOCK_VENTAS.reduce((acc, v) => acc + v.total, 0);

  return (
    <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <nav className="flex items-center gap-2 text-sm text-cosmos-muted mb-8">
          <Link to="/proveedores" className="hover:text-cosmos-accent">Proveedores</Link>
          <span>/</span>
          <span className="text-cosmos-text">Ventas</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cosmos-accent-soft flex items-center justify-center">
              <TrendingUp size={20} className="text-cosmos-accent" />
            </div>
            <div>
              <h1 className="font-display font-semibold text-cosmos-text text-2xl m-0 mb-1">
                Ventas
              </h1>
              <p className="text-cosmos-muted text-sm m-0">
                Pedidos de retailers y cobros.
              </p>
            </div>
          </div>
          <div className="p-4 bg-cosmos-surface border border-cosmos-border rounded-xl">
            <p className="text-xs text-cosmos-muted m-0">Este mes</p>
            <p className="font-semibold text-cosmos-text text-xl m-0">US$ {totalVentas.toFixed(2)}</p>
          </div>
        </div>

        <div className="flex gap-6 mb-6">
          <button
            type="button"
            onClick={() => setTab("ventas")}
            className={`text-sm font-medium transition-colors ${
              tab === "ventas" ? "text-cosmos-accent" : "text-cosmos-muted hover:text-cosmos-text"
            }`}
          >
            Pedidos
          </button>
          <button
            type="button"
            onClick={() => setTab("transacciones")}
            className={`text-sm font-medium transition-colors ${
              tab === "transacciones" ? "text-cosmos-accent" : "text-cosmos-muted hover:text-cosmos-text"
            }`}
          >
            Transacciones
          </button>
        </div>

        {tab === "ventas" && (
          <div className="space-y-3">
            {MOCK_VENTAS.map((v) => (
              <div
                key={v.id}
                className="flex items-center justify-between p-4 bg-cosmos-surface border border-cosmos-border rounded-xl"
              >
                <div>
                  <p className="font-medium text-cosmos-text m-0">
                    {v.retailer} · {v.producto}
                  </p>
                  <p className="text-sm text-cosmos-muted m-0">{v.fecha}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-cosmos-text m-0">US$ {v.total.toFixed(2)}</p>
                  <p className="text-xs text-cosmos-muted m-0">{v.estado}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "transacciones" && (
          <div className="space-y-3">
            {MOCK_TRANSACCIONES.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-4 bg-cosmos-surface border border-cosmos-border rounded-xl"
              >
                <div>
                  <p className="font-medium text-cosmos-text m-0">{t.tipo}</p>
                  <p className="text-sm text-cosmos-muted m-0">{t.fecha}</p>
                </div>
                <div className="text-right">
                  <p className={`font-medium m-0 ${t.monto >= 0 ? "text-cosmos-text" : "text-red-400"}`}>
                    {t.monto >= 0 ? "+" : ""}US$ {t.monto.toFixed(2)}
                  </p>
                  <p className="text-xs text-cosmos-muted m-0">{t.estado}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
