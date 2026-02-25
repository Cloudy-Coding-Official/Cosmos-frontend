import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  getProductForEdit,
  updateProduct,
  getProductCategories,
  type UpdateProductPayload,
} from "../../api/products";
import { getErrorMessage } from "../../api/client";
import { ImageUpload } from "../../components/ImageUpload";

export function ProveedoresProductoEditar() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<UpdateProductPayload & { sku?: string }>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([getProductForEdit(id), getProductCategories()])
      .then(([product, cats]) => {
        if (cancelled) return;
        if (product) {
          setForm({
            name: product.name,
            description: product.description,
            sku: product.sku,
            basePrice: product.basePrice,
            wholesalePrice: product.wholesalePrice,
            wholesaleMinQuantity: product.wholesaleMinQuantity ?? 1,
            suggestedPrice: product.suggestedPrice,
            currency: product.currency,
            stock: product.stock,
            category: product.category,
            imageUrl: product.imageUrl,
          });
        }
        setCategories(cats);
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err, "Error al cargar producto"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    const payload: UpdateProductPayload = {
      name: form.name?.trim(),
      description: form.description?.trim() ?? undefined,
      basePrice: form.basePrice != null ? Number(form.basePrice) : undefined,
      wholesalePrice: form.wholesalePrice != null ? Number(form.wholesalePrice) : undefined,
      wholesaleMinQuantity: form.wholesaleMinQuantity != null ? Math.max(1, Number(form.wholesaleMinQuantity)) : undefined,
      suggestedPrice: form.suggestedPrice != null ? Number(form.suggestedPrice) : undefined,
      category: form.category?.trim() || undefined,
      stock: form.stock != null ? Number(form.stock) : undefined,
      imageUrl: form.imageUrl?.trim() || undefined,
    };
    if (payload.basePrice !== undefined && payload.basePrice <= 0) {
      setError("Precios deben ser mayores a 0.");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await updateProduct(id, payload);
      navigate("/proveedores/productos");
    } catch (err) {
      setError(getErrorMessage(err, "Error al guardar"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cosmos-bg py-8">
        <div className="w-full max-w-[640px] mx-auto px-6">
          <p className="text-cosmos-muted">Cargando…</p>
        </div>
      </div>
    );
  }

  if (error && !form.name) {
    return (
      <div className="min-h-screen bg-cosmos-bg py-8">
        <div className="w-full max-w-[640px] mx-auto px-6">
          <p className="text-red-500 mb-4">{error}</p>
          <Link to="/proveedores/productos" className="text-cosmos-accent hover:underline">
            Volver al catálogo
          </Link>
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
          <span className="text-cosmos-text">Editar</span>
        </nav>

        <h1 className="font-display font-semibold text-cosmos-text text-2xl m-0 mb-6">
          Editar producto
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
              value={form.name ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full px-4 py-2.5 bg-cosmos-surface border border-cosmos-border text-cosmos-text rounded-lg focus:outline-none focus:border-cosmos-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-cosmos-text mb-2">SKU</label>
            <input
              type="text"
              value={form.sku ?? ""}
              readOnly
              className="w-full px-4 py-2.5 bg-cosmos-surface-elevated border border-cosmos-border text-cosmos-muted rounded-lg"
            />
            <p className="text-xs text-cosmos-muted mt-1">No editable</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-cosmos-text mb-2">Descripción</label>
            <textarea
              value={form.description ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2.5 bg-cosmos-surface border border-cosmos-border text-cosmos-text rounded-lg focus:outline-none focus:border-cosmos-accent resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-cosmos-text mb-2">Categoría *</label>
            <input
              type="text"
              list="categories-list"
              value={form.category ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full px-4 py-2.5 bg-cosmos-surface border border-cosmos-border text-cosmos-text rounded-lg focus:outline-none focus:border-cosmos-accent"
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
                value={form.basePrice ?? ""}
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
                value={form.wholesalePrice ?? ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, wholesalePrice: parseFloat(e.target.value) || 0 }))
                }
                className="w-full px-4 py-2.5 bg-cosmos-surface border border-cosmos-border text-cosmos-text rounded-lg focus:outline-none focus:border-cosmos-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cosmos-text mb-2">Mín. cantidad para precio mayorista</label>
              <input
                type="number"
                min={1}
                value={form.wholesaleMinQuantity ?? 1}
                onChange={(e) =>
                  setForm((f) => ({ ...f, wholesaleMinQuantity: Math.max(1, parseInt(e.target.value, 10) || 1) }))
                }
                className="w-full px-4 py-2.5 bg-cosmos-surface border border-cosmos-border text-cosmos-text rounded-lg focus:outline-none focus:border-cosmos-accent"
              />
              <p className="text-xs text-cosmos-muted mt-1">A partir de esta cantidad se cobra el precio mayorista al retailer.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-cosmos-text mb-2">Precio sugerido (US$) *</label>
              <input
                type="number"
                min={0}
                step={0.01}
                required
                value={form.suggestedPrice ?? ""}
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
              disabled={saving}
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
              disabled={saving}
              className="px-6 py-2.5 font-medium bg-cosmos-accent text-cosmos-bg rounded-lg hover:bg-cosmos-accent-hover disabled:opacity-50"
            >
              {saving ? "Guardando…" : "Guardar cambios"}
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
