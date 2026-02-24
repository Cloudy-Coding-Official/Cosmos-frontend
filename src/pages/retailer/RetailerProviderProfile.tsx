import { Link, useParams } from "react-router-dom";
import { Building2, MapPin, Package, ArrowLeft, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { getProviderById, type ProviderProfile } from "../../api/providers";
import { ProductImage } from "../../components/ProductImage";
import { getErrorMessage } from "../../api/client";

function toNum(v: number | string | null | undefined): number {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  const n = parseFloat(String(v));
  return Number.isFinite(n) ? n : 0;
}

export function RetailerProviderProfile() {
  const { id } = useParams<{ id: string }>();
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getProviderById(id)
      .then((data) => {
        if (!cancelled) setProvider(data ?? null);
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err, "Error al cargar proveedor"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!id) {
    return (
      <div className="min-h-screen bg-cosmos-bg py-8">
        <div className="w-full max-w-[1200px] mx-auto px-6">
          <p className="text-cosmos-muted">Proveedor no especificado.</p>
          <Link to="/retailer/proveedores" className="text-cosmos-accent hover:underline mt-2 inline-block">
            Volver a proveedores
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cosmos-bg py-8">
        <div className="w-full max-w-[1200px] mx-auto px-6">
          <p className="text-cosmos-muted">Cargando perfil del proveedor…</p>
        </div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="min-h-screen bg-cosmos-bg py-8">
        <div className="w-full max-w-[1200px] mx-auto px-6">
          <p className="text-red-500 mb-4">{error ?? "Proveedor no encontrado."}</p>
          <Link to="/retailer/proveedores" className="text-cosmos-accent hover:underline">
            Volver a proveedores
          </Link>
        </div>
      </div>
    );
  }

  const products = provider.products ?? [];

  return (
    <div className="min-h-screen bg-cosmos-bg">
      {/* Header B2B: distinto a /tienda, sin gradientes ni “Explora productos” */}
      <div className="border-b border-cosmos-border bg-cosmos-surface/50">
        <div className="w-full max-w-[1200px] mx-auto px-6 py-6">
          <nav className="flex items-center gap-2 text-sm text-cosmos-muted mb-6">
            <Link to="/retailer" className="hover:text-cosmos-accent transition-colors">Mi tienda</Link>
            <span>/</span>
            <Link to="/retailer/proveedores" className="hover:text-cosmos-accent transition-colors">
              Proveedores
            </Link>
            <span>/</span>
            <span className="text-cosmos-text">Catálogo B2B</span>
          </nav>

          <Link
            to="/retailer/proveedores"
            className="inline-flex items-center gap-2 text-sm text-cosmos-muted hover:text-cosmos-accent mb-6"
          >
            <ArrowLeft size={16} />
            Volver al listado
          </Link>

          <div className="flex flex-wrap items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Building2 size={28} className="text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h1 className="font-display font-semibold text-cosmos-text text-2xl m-0 mb-1 flex items-center gap-2">
                {provider.legalName}
                {provider.verified && (
                  <span className="inline-flex items-center gap-1 text-sm font-normal text-cosmos-accent">
                    <CheckCircle size={16} />
                    Verificado
                  </span>
                )}
              </h1>
              <div className="flex items-center gap-2 text-cosmos-muted">
                <MapPin size={16} />
                <span>País: {provider.country}</span>
              </div>
              <p className="text-sm text-cosmos-muted mt-2 m-0">
                Catálogo mayorista · Solo visible para retailers
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1200px] mx-auto px-6 py-8">
        <h2 className="font-semibold text-cosmos-text text-lg m-0 mb-6 flex items-center gap-2">
          <Package size={20} className="text-cosmos-accent" />
          Productos del proveedor ({products.length})
        </h2>

        {products.length === 0 ? (
          <div className="p-12 border border-dashed border-cosmos-border rounded-xl text-center bg-cosmos-surface/30">
            <Package size={40} className="text-cosmos-muted mx-auto mb-4" />
            <p className="text-cosmos-muted m-0">Este proveedor aún no tiene productos publicados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-cosmos-border">
                  <th className="py-3 pr-4 text-sm font-medium text-cosmos-muted">Producto</th>
                  <th className="py-3 pr-4 text-sm font-medium text-cosmos-muted">SKU</th>
                  <th className="py-3 pr-4 text-sm font-medium text-cosmos-muted">Categoría</th>
                  <th className="py-3 pr-4 text-sm font-medium text-cosmos-muted">Mayorista (US$)</th>
                  <th className="py-3 pr-4 text-sm font-medium text-cosmos-muted">P. sugerido (US$)</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-cosmos-border/60 hover:bg-cosmos-surface/50 transition-colors"
                  >
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-cosmos-surface-elevated overflow-hidden shrink-0">
                          <ProductImage
                            src={p.imageUrl ?? ""}
                            alt={p.name}
                            className="w-full h-full object-cover"
                            wrapperClassName="w-full h-full"
                          />
                        </div>
                        <span className="font-medium text-cosmos-text">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-sm text-cosmos-muted">{p.sku}</td>
                    <td className="py-4 pr-4 text-sm text-cosmos-muted">{p.category}</td>
                    <td className="py-4 pr-4 text-cosmos-text font-medium">
                      {toNum(p.wholesalePrice).toFixed(2)}
                    </td>
                    <td className="py-4 pr-4 text-cosmos-text">
                      {toNum(p.suggestedPrice).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
