import { Link } from "react-router-dom";
import { Users, MapPin, DollarSign, ChevronRight } from "lucide-react";

const MOCK_SUPPLIERS = [
  {
    id: "1",
    name: "ElectroPlus LATAM",
    region: "Buenos Aires, Argentina",
    productsCount: 45,
    avgCost: 32.5,
    minCost: 18,
    maxCost: 120,
  },
  {
    id: "2",
    name: "ModaImport SA",
    region: "São Paulo, Brasil",
    productsCount: 78,
    avgCost: 28.0,
    minCost: 12,
    maxCost: 85,
  },
  {
    id: "3",
    name: "TechGlobal MX",
    region: "Ciudad de México",
    productsCount: 120,
    avgCost: 45.0,
    minCost: 22,
    maxCost: 200,
  },
];

export function RetailerSuppliers() {
  return (
    <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <nav className="flex items-center gap-2 text-sm text-cosmos-muted mb-6">
          <Link to="/retailer" className="hover:text-cosmos-accent transition-colors">Mi tienda</Link>
          <span>/</span>
          <span className="text-cosmos-text">Proveedores</span>
        </nav>

        <h1 className="font-display font-semibold text-cosmos-text text-2xl md:text-3xl m-0 mb-2">
          Listado de proveedores
        </h1>
        <p className="text-cosmos-muted m-0 mb-10">
          Selecciona proveedores y compara costos por región.
        </p>

        {/* Variación de costos entre proveedores */}
        <div className="mb-10 p-6 bg-cosmos-surface border border-cosmos-accent/20 rounded-2xl">
          <h3 className="font-display font-semibold text-cosmos-text m-0 mb-3 flex items-center gap-2">
            <DollarSign size={20} className="text-cosmos-accent" />
            Variación entre proveedores
          </h3>
          <p className="text-sm text-cosmos-muted m-0">
            Compara precios entre proveedores para el mismo producto y elige la mejor opción para tu margen.
          </p>
        </div>

        <div className="space-y-4">
          {MOCK_SUPPLIERS.map((supplier) => (
            <Link
              key={supplier.id}
              to={`/retailer/proveedores/${supplier.id}`}
              className="block p-6 bg-cosmos-surface border border-cosmos-border rounded-2xl hover:border-cosmos-accent/40 hover:shadow-lg transition-all group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cosmos-accent-soft flex items-center justify-center shrink-0">
                    <Users size={24} className="text-cosmos-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-cosmos-text text-lg m-0 mb-1 group-hover:text-cosmos-accent transition-colors">
                      {supplier.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-cosmos-muted">
                      <MapPin size={14} />
                      {supplier.region}
                    </div>
                    <p className="text-sm text-cosmos-muted mt-1 m-0">
                      {supplier.productsCount} productos · Costo promedio US$ {supplier.avgCost}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="text-sm">
                    <span className="text-cosmos-muted">Rango: </span>
                    <span className="text-cosmos-text font-medium">
                      US$ {supplier.minCost} - US$ {supplier.maxCost}
                    </span>
                  </div>
                  <ChevronRight size={20} className="text-cosmos-muted group-hover:text-cosmos-accent transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
