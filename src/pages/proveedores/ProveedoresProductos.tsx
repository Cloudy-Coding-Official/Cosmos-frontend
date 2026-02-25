import { Link, useNavigate } from "react-router-dom";
import { Package, Plus, Pencil, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getProducts, deleteProduct, type Product } from "../../api/products";
import { ProductImage } from "../../components/ProductImage";
import { getErrorMessage } from "../../api/client";

export function ProveedoresProductos() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const providerId = user?.providerProfileId ?? null;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!providerId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    getProducts({ providerId })
      .then((list) => {
        if (!cancelled) setProducts(list);
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err, "Error al cargar productos"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [providerId]);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Desactivar este producto? No se mostrará a los retailers.")) return;
    setDeletingId(id);
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(getErrorMessage(err, "Error al desactivar"));
    } finally {
      setDeletingId(null);
    }
  };

  if (!providerId) {
    return (
      <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
        <div className="w-full max-w-[1200px] mx-auto px-6">
          <p className="text-cosmos-muted">No tenés un perfil de proveedor.</p>
        </div>
      </div>
    );
  }

  const isEmpty = !loading && !error && products.length === 0;

  return (
    <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <nav className="flex items-center gap-2 text-sm text-cosmos-muted mb-8">
          <Link to="/proveedores" className="hover:text-cosmos-accent">
            Proveedores
          </Link>
          <span>/</span>
          <span className="text-cosmos-text">Catálogo</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display font-semibold text-cosmos-text text-2xl m-0 mb-1">
              Catálogo
            </h1>
            <p className="text-cosmos-muted text-sm m-0">
              Lo que subís acá lo ven los retailers en tu perfil.
            </p>
          </div>
          <Link
            to="/proveedores/productos/nuevo"
            className="inline-flex items-center gap-2 px-5 py-2.5 font-medium bg-cosmos-accent text-cosmos-bg rounded-lg hover:bg-cosmos-accent-hover transition-colors"
          >
            <Plus size={18} />
            Nuevo producto
          </Link>
        </div>

        {error && (
          <p className="text-red-500 mb-6" role="alert">
            {error}
          </p>
        )}

        {loading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-cosmos-surface border border-cosmos-border rounded-xl p-4 animate-pulse"
              >
                <div className="aspect-square bg-cosmos-surface-elevated rounded-lg mb-4" />
                <div className="h-4 bg-cosmos-surface-elevated rounded w-3/4 mb-2" />
                <div className="h-4 bg-cosmos-surface-elevated rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {isEmpty && !loading && (
          <div className="p-12 border border-dashed border-cosmos-border rounded-xl text-center">
            <div className="w-14 h-14 rounded-xl bg-cosmos-surface-elevated flex items-center justify-center mx-auto mb-4">
              <Package size={28} className="text-cosmos-muted" />
            </div>
            <p className="text-cosmos-muted m-0 mb-2">Sin productos todavía</p>
            <p className="text-sm text-cosmos-muted m-0 mb-6">
              Agregá tu primer producto para que los retailers puedan verlo.
            </p>
            <Link
              to="/proveedores/productos/nuevo"
              className="inline-flex items-center gap-2 px-5 py-2.5 font-medium bg-cosmos-accent text-cosmos-bg rounded-lg hover:bg-cosmos-accent-hover transition-colors"
            >
              <Plus size={18} />
              Nuevo producto
            </Link>
          </div>
        )}

        {!loading && !isEmpty && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-cosmos-surface border border-cosmos-border rounded-xl overflow-hidden flex flex-col"
              >
                <div className="aspect-square bg-cosmos-surface-elevated relative">
                  <ProductImage
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    wrapperClassName="w-full h-full"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-cosmos-text m-0 mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-cosmos-text font-medium m-0 mb-3">
                    US$ {(product.basePrice ?? product.price).toFixed(2)}
                  </p>
                  <div className="mt-auto flex gap-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/proveedores/productos/editar/${product.id}`)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-cosmos-accent border border-cosmos-accent/50 rounded-lg hover:bg-cosmos-accent/10"
                    >
                      <Pencil size={14} />
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(product.id)}
                      disabled={deletingId === product.id}
                      className="inline-flex items-center justify-center p-2 text-cosmos-muted hover:text-red-500 border border-cosmos-border rounded-lg hover:border-red-500/50 disabled:opacity-50"
                      title="Desactivar"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
