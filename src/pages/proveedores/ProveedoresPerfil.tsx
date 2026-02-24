import { Link } from "react-router-dom";
import { User, MapPin, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getProviderById, updateProvider, type ProviderProfile, type UpdateProviderPayload } from "../../api/providers";
import { getErrorMessage } from "../../api/client";

export function ProveedoresPerfil() {
  const { user } = useAuth();
  const providerId = user?.providerProfileId ?? null;
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [form, setForm] = useState<UpdateProviderPayload>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!providerId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getProviderById(providerId)
      .then((data) => {
        if (!cancelled && data) {
          setProfile(data);
          setForm({
            legalName: data.legalName,
            taxId: data.taxId,
            country: data.country,
          });
        }
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err, "Error al cargar perfil"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [providerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!providerId) return;
    setError(null);
    setSuccess(false);
    setSaving(true);
    try {
      const updated = await updateProvider(providerId, {
        legalName: form.legalName?.trim(),
        taxId: form.taxId?.trim(),
        country: form.country?.trim(),
      });
      setProfile(updated);
      setSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err, "Error al guardar"));
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
        <div className="w-full max-w-[1200px] mx-auto px-6">
          <p className="text-cosmos-muted">Cargando perfil…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cosmos-bg py-8 md:py-12">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <nav className="flex items-center gap-2 text-sm text-cosmos-muted mb-8">
          <Link to="/proveedores" className="hover:text-cosmos-accent">Proveedores</Link>
          <span>/</span>
          <span className="text-cosmos-text">Mi perfil</span>
        </nav>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-cosmos-accent-soft flex items-center justify-center shrink-0">
            <User size={24} className="text-cosmos-accent" />
          </div>
          <div>
            <h1 className="font-display font-semibold text-cosmos-text text-2xl m-0 mb-1">
              Mi perfil
            </h1>
            <p className="text-cosmos-muted text-sm m-0">
              Es lo que ven los retailers cuando entran a tu perfil.
            </p>
          </div>
        </div>

        {error && (
          <p className="text-red-500 mb-6" role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-6" role="status">
            <CheckCircle size={18} />
            Perfil actualizado.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
          <div className="p-6 bg-cosmos-surface border border-cosmos-border rounded-xl space-y-4">
            <div>
              <label className="block text-sm font-medium text-cosmos-text mb-2">Razón social *</label>
              <input
                type="text"
                required
                value={form.legalName ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, legalName: e.target.value }))}
                className="w-full px-4 py-2.5 bg-cosmos-bg border border-cosmos-border text-cosmos-text rounded-lg focus:outline-none focus:border-cosmos-accent"
                placeholder="Ej. Mi Empresa S.A."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cosmos-text mb-2">CUIT / NIF / Tax ID *</label>
              <input
                type="text"
                required
                value={form.taxId ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, taxId: e.target.value }))}
                className="w-full px-4 py-2.5 bg-cosmos-bg border border-cosmos-border text-cosmos-text rounded-lg focus:outline-none focus:border-cosmos-accent"
                placeholder="Ej. 30-12345678-9"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cosmos-text mb-2 flex items-center gap-2">
                <MapPin size={14} />
                País *
              </label>
              <input
                type="text"
                required
                value={form.country ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                className="w-full px-4 py-2.5 bg-cosmos-bg border border-cosmos-border text-cosmos-text rounded-lg focus:outline-none focus:border-cosmos-accent"
                placeholder="Ej. AR, MX, UY"
              />
            </div>
          </div>

          {profile?.verified && (
            <p className="flex items-center gap-2 text-cosmos-accent text-sm">
              <CheckCircle size={16} />
              Proveedor verificado
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 font-medium bg-cosmos-accent text-cosmos-bg rounded-lg hover:bg-cosmos-accent-hover disabled:opacity-50"
            >
              {saving ? "Guardando…" : "Guardar cambios"}
            </button>
          </div>
        </form>

        <div className="mt-10 p-4 bg-cosmos-surface/50 border border-cosmos-border rounded-lg max-w-xl">
          <p className="text-sm text-cosmos-muted m-0">
            Podés ofrecer precios especiales o beneficios a retailers que compran seguido. Se configura en cada relación.
          </p>
        </div>
      </div>
    </div>
  );
}
