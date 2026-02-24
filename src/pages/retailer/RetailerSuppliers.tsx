import { Link } from "react-router-dom";
import { Users, MapPin, DollarSign, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { getProvidersCatalog, type ProviderCatalogItem } from "../../api/providers";
import { getErrorMessage } from "../../api/client";

export function RetailerSuppliers() {
  const [suppliers, setSuppliers] = useState<ProviderCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getProvidersCatalog()
      .then((list) => {
        if (!cancelled) setSuppliers(list);
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err, "Error al cargar proveedores"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

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
          Entrá al perfil de un proveedor para ver su catálogo B2B y productos mayoristas.
        </p>

        <div className="mb-10 p-6 bg-cosmos-surface border border-cosmos-accent/20 rounded-2xl">
          <h3 className="font-display font-semibold text-cosmos-text m-0 mb-3 flex items-center gap-2">
            <DollarSign size={20} className="text-cosmos-accent" />
            Catálogo B2B
          </h3>
          <p className="text-sm text-cosmos-muted m-0">
            Los productos que ves en cada perfil son solo para retailers. No es la tienda pública.
          </p>
        </div>

        {error && (
          <p className="text-red-500 mb-6" role="alert">
            {error}
          </p>
        )}

        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 bg-cosmos-surface border border-cosmos-border rounded-2xl animate-pulse"
              />
            ))}
          </div>
        )}

        {!loading && suppliers.length === 0 && !error && (
          <div className="p-12 border border-dashed border-cosmos-border rounded-2xl text-center">
            <Users size={40} className="text-cosmos-muted mx-auto mb-4" />
            <p className="text-cosmos-muted m-0">Aún no hay proveedores con productos publicados.</p>
          </div>
        )}

        {!loading && suppliers.length > 0 && (
          <div className="space-y-4">
            {suppliers.map((supplier) => (
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
                      <h3 className="font-semibold text-cosmos-text text-lg m-0 mb-1 group-hover:text-cosmos-accent transition-colors flex items-center gap-2">
                        {supplier.legalName}
                        {supplier.verified && (
                          <span className="text-xs font-normal text-cosmos-accent">Verificado</span>
                        )}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-cosmos-muted">
                        <MapPin size={14} />
                        {supplier.country}
                      </div>
                      <p className="text-sm text-cosmos-muted mt-1 m-0">
                        {supplier._count.products} producto{supplier._count.products !== 1 ? "s" : ""} en catálogo
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-cosmos-muted group-hover:text-cosmos-accent transition-colors shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
