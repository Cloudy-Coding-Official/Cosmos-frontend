import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { createProduct, getProductCategories, type CreateProductPayload } from "../../api/products";
import { getErrorMessage } from "../../api/client";
import { ImageUpload } from "../../components/ImageUpload";

const defaultForm: CreateProductPayload = {
  name: "",
  description: "",
  sku: "",
  basePrice: 0,
  wholesalePrice: 0,
  suggestedPrice: 0,
  currency: "USD",
  stock: 0,
  category: "",
  imageUrl: "",
};

export function ProveedoresProductoNuevo() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const providerId = user?.providerProfileId ?? null;
  const [form, setForm] = useState<CreateProductPayload>(defaultForm);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProductCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!providerId) return;
    setError(null);
    setLoading(true);
    try {
      const payload: CreateProductPayload = {
        name: form.name.trim(),
        sku: form.sku.trim(),
        basePrice: Number(form.basePrice) || 0,
        wholesalePrice: Number(form.wholesalePrice) || 0,
        suggestedPrice: Number(form.suggestedPrice) || 0,
        category: form.category.trim() || "General",
        currency: form.currency || "USD",
        stock: Number(form.stock) || 0,
      };
      if (form.description?.trim()) payload.description = form.description.trim();
      if (form.imageUrl?.trim()) payload.imageUrl = form.imageUrl.trim();
      if (payload.basePrice <= 0 || payload.wholesalePrice <= 0 || payload.suggestedPrice <= 0) {
        setError("Precios deben ser mayores a 0.");
        setLoading(false);
        return;
      }
      await createProduct(providerId, payload);
      navigate("/proveedores/productos");
    } catch (err) {
      setError(getErrorMessage(err, "Error al crear el producto"));
    } finally {
      setLoading(false);
    }
  };

  if (!providerId) {
    return (
      <div className="min-h-screen bg-cosmos-bg py-8">
        <div className="w-full max-w-[1200px] mx-auto px-6">
          <p className="text-cosmos-muted">No tenés un perfil de proveedor.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
      <div className="w-full max-w-[640px] mx-auto px-6">
        <nav className="flex items-center gap-2 text-sm text-cosmos-muted mb-8">
          <Link to="/proveedores" className="hover:text-cosmos-accent">Proveedores</Link>
          <span>/</span>
          <Link to="/proveedores/productos" className="hover:text-cosmos-accent">Catálogo</Link>
          <span>/</span>
          <span className="text-cosmos-text">Nuevo producto</span>
        </nav>

        <h1 className="font-display font-semibold text-cosmos-text text-2xl m-0 mb-6">
          Nuevo producto
        </h1>

        {error && (
          <p className="text-red-500 mb-4" role="alert">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-cosmos-text mb-2">Nombre *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full px-4 py-2.5 bg-cosmos-surface border border-cosmos-border text-cosmos-text rounded-lg focus:outline-none focus:border-cosmos-accent"
              placeholder="Ej. Auriculares inalámbricos"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-cosmos-text mb-2">SKU *</label>
            <input
              type="text"
              required
              value={form.sku}
              onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
              className="w-full px-4 py-2.5 bg-cosmos-surface border border-cosmos-border text-cosmos-text rounded-lg focus:outline-none focus:border-cosmos-accent"
              placeholder="Ej. AUD-001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-cosmos-text mb-2">Descripción</label>
            <textarea
              value={form.description ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2.5 bg-cosmos-surface border border-cosmos-border text-cosmos-text rounded-lg focus:outline-none focus:border-cosmos-accent resize-none"
              placeholder="Descripción opcional"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-cosmos-text mb-2">Categoría *</label>
            <input
              type="text"
              list="categories-list"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full px-4 py-2.5 bg-cosmos-surface border border-cosmos-border text-cosmos-text rounded-lg focus:outline-none focus:border-cosmos-accent"
              placeholder="Ej. Electrónica"
            />
            <datalist id="categories-list">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-cosmos-text mb-2">Precio base (US$) *</label>
              <input
                type="number"
                min={0}
                step={0.01}
                required
                value={form.basePrice || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, basePrice: parseFloat(e.target.value) || 0 }))
                }
                className="w-full px-4 py-2.5 bg-cosmos-surface border border-cosmos-border text-cosmos-text rounded-lg focus:outline-none focus:border-cosmos-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cosmos-text mb-2">Precio mayorista (US$) *</label>
              <input
                type="number"
                min={0}
                step={0.01}
                required
                value={form.wholesalePrice || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, wholesalePrice: parseFloat(e.target.value) || 0 }))
                }
                className="w-full px-4 py-2.5 bg-cosmos-surface border border-cosmos-border text-cosmos-text rounded-lg focus:outline-none focus:border-cosmos-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cosmos-text mb-2">Precio sugerido (US$) *</label>
              <input
                type="number"
                min={0}
                step={0.01}
                required
                value={form.suggestedPrice || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, suggestedPrice: parseFloat(e.target.value) || 0 }))
                }
                className="w-full px-4 py-2.5 bg-cosmos-surface border border-cosmos-border text-cosmos-text rounded-lg focus:outline-none focus:border-cosmos-accent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-cosmos-text mb-2">Imagen del producto</label>
            <ImageUpload
              value={form.imageUrl ?? ""}
              onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-cosmos-text mb-2">Stock</label>
            <input
              type="number"
              min={0}
              value={form.stock ?? ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, stock: parseInt(e.target.value, 10) || 0 }))
              }
              className="w-full px-4 py-2.5 bg-cosmos-surface border border-cosmos-border text-cosmos-text rounded-lg focus:outline-none focus:border-cosmos-accent"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 font-medium bg-cosmos-accent text-cosmos-bg rounded-lg hover:bg-cosmos-accent-hover disabled:opacity-50"
            >
              {loading ? "Guardando…" : "Publicar producto"}
            </button>
            <Link
              to="/proveedores/productos"
              className="px-6 py-2.5 font-medium border border-cosmos-border text-cosmos-text rounded-lg hover:bg-cosmos-surface-elevated"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
