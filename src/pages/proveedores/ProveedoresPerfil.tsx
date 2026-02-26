import { Link } from "react-router-dom";
import { User, MapPin, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getProviderById,
  createProvider,
  updateProvider,
  type ProviderProfile,
  type CreateProviderPayload,
} from "../../api/providers";
import { getErrorMessage } from "../../api/client";
import { COUNTRIES } from "../../data/countries";

const inputBase =
  "w-full px-4 py-2.5 bg-cosmos-bg border border-cosmos-border text-cosmos-text rounded-lg focus:outline-none focus:border-cosmos-accent";
const selectBase = `${inputBase} appearance-none cursor-pointer`;

export function ProveedoresPerfil() {
  const { user, refreshUser } = useAuth();
  const providerId = user?.providerProfileId ?? null;
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [form, setForm] = useState<{
    legalName: string;
    taxId: string;
    country: string;
    requireStoreApproval?: boolean;
  }>({
    legalName: "",
    taxId: "",
    country: user?.country && user.country !== "XX" ? user.country : "",
    requireStoreApproval: true,
  });
  const [loading, setLoading] = useState(!!providerId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!providerId) {
      setLoading(false);
      setForm((f) => ({
        ...f,
        country: user?.country && user.country !== "XX" ? user.country : "",
      }));
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
            requireStoreApproval: data.requireStoreApproval ?? true,
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
  }, [providerId, user?.country]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);
    const countryCode = form.country?.trim() || user?.country || "AR";
    try {
      if (!providerId) {
        const payload: CreateProviderPayload = {
          legalName: (form.legalName ?? "").trim(),
          taxId: (form.taxId ?? "").trim(),
          country: countryCode,
          requireStoreApproval: form.requireStoreApproval !== false,
        };
        if (!payload.legalName || !payload.taxId) {
          setError("Razón social y CUIT son obligatorios.");
          setSaving(false);
          return;
        }
        const created = await createProvider(payload);
        setProfile(created);
        await refreshUser();
        setSuccess(true);
      } else {
        const updated = await updateProvider(providerId, {
          legalName: form.legalName?.trim(),
          taxId: form.taxId?.trim(),
          country: countryCode,
          requireStoreApproval: form.requireStoreApproval,
        });
        setProfile(updated);
        setSuccess(true);
      }
    } catch (err) {
      setError(getErrorMessage(err, "Error al guardar"));
    } finally {
      setSaving(false);
    }
  };

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
              {providerId ? "Mi perfil" : "Completar datos de tu empresa"}
            </h1>
            <p className="text-cosmos-muted text-sm m-0">
              {providerId
                ? "Es lo que ven los retailers cuando entran a tu perfil."
                : "Cargá razón social, CUIT y país para crear tu perfil de proveedor."}
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
            {providerId ? "Perfil actualizado." : "Perfil creado. Ya podés usar el panel de proveedor."}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
          <div className="p-6 bg-cosmos-surface border border-cosmos-border rounded-xl space-y-4">
            <div>
              <label className="block text-sm font-medium text-cosmos-text mb-2">Razón social *</label>
              <input
                type="text"
                required
                value={form.legalName}
                onChange={(e) => setForm((f) => ({ ...f, legalName: e.target.value }))}
                className={inputBase}
                placeholder="Ej. Mi Empresa S.A."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cosmos-text mb-2">CUIT / NIF / Tax ID *</label>
              <input
                type="text"
                required
                value={form.taxId}
                onChange={(e) => setForm((f) => ({ ...f, taxId: e.target.value }))}
                className={inputBase}
                placeholder="Ej. 30-12345678-9"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cosmos-text mb-2 flex items-center gap-2">
                <MapPin size={14} />
                País *
              </label>
              <select
                required
                value={form.country || ""}
                onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                className={selectBase}
              >
                <option value="">Seleccionar país</option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="requireStoreApproval"
                checked={form.requireStoreApproval !== false}
                onChange={(e) => setForm((f) => ({ ...f, requireStoreApproval: e.target.checked }))}
                className="w-4 h-4 rounded border-cosmos-border text-cosmos-accent focus:ring-cosmos-accent"
              />
              <label htmlFor="requireStoreApproval" className="text-sm text-cosmos-text cursor-pointer">
                Requerir que las tiendas soliciten acceso para vender mis productos (recomendado).
              </label>
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
              className="px-6 py-2.5 font-medium bg-cosmos-accent text-cosmos-bg rounded-lg hover:bg-cosmos-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Guardando…" : providerId ? "Guardar cambios" : "Crear perfil de proveedor"}
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
