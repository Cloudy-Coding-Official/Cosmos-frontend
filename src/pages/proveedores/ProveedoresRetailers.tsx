import { Link } from "react-router-dom";
import { Users } from "lucide-react";

const MOCK_RETAILERS = [
  { name: "TechStore", pedidos: 12, ultimo: "Hace 3 días" },
  { name: "ModaLatam", pedidos: 8, ultimo: "Hace 1 semana" },
  { name: "DeportesYA", pedidos: 0, ultimo: "—" },
];

export function ProveedoresRetailers() {
  return (
    <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <nav className="flex items-center gap-2 text-sm text-cosmos-muted mb-8">
          <Link to="/proveedores" className="hover:text-cosmos-accent">Proveedores</Link>
          <span>/</span>
          <span className="text-cosmos-text">Retailers</span>
        </nav>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg bg-cosmos-accent-soft flex items-center justify-center">
            <Users size={20} className="text-cosmos-accent" />
          </div>
          <div>
            <h1 className="font-display font-semibold text-cosmos-text text-2xl m-0 mb-1">
              Retailers
            </h1>
            <p className="text-cosmos-muted text-sm m-0">
              Tiendas que te compran o a las que podés enviar solicitud.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {MOCK_RETAILERS.map((r) => (
            <div
              key={r.name}
              className="flex items-center justify-between p-4 bg-cosmos-surface border border-cosmos-border rounded-xl"
            >
              <div>
                <p className="font-medium text-cosmos-text m-0">{r.name}</p>
                <p className="text-sm text-cosmos-muted m-0">
                  {r.pedidos} pedidos · último {r.ultimo}
                </p>
              </div>
              {r.pedidos > 0 ? (
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium bg-cosmos-accent-soft text-cosmos-accent rounded-lg hover:bg-cosmos-accent/20"
                >
                  Ver precios
                </button>
              ) : (
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium border border-cosmos-border rounded-lg text-cosmos-text hover:border-cosmos-accent"
                >
                  Enviar solicitud
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
