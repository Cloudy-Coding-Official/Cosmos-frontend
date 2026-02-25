import { apiRequest } from "./client";

export type ProviderCatalogItem = {
  id: string;
  legalName: string;
  slug: string;
  country: string;
  verified: boolean;
  _count: { products: number };
};

export type ProviderProfile = {
  id: string;
  legalName: string;
  slug: string;
  taxId: string;
  country: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  products?: Array<{
    id: string;
    name: string;
    description: string | null;
    sku: string;
    suggestedPrice: number | string;
    wholesalePrice: number | string;
    basePrice: number | string;
    currency: string;
    category: string;
    active: boolean;
    imageUrl: string | null;
    stock: number;
  }>;
};

export async function getProvidersCatalog(): Promise<ProviderCatalogItem[]> {
  const data = await apiRequest<ProviderCatalogItem[]>("/providers/catalog", { method: "GET" });
  return Array.isArray(data) ? data : [];
}

export async function getProviderById(id: string): Promise<ProviderProfile | null> {
  try {
    const data = await apiRequest<ProviderProfile>(`/providers/${encodeURIComponent(id)}`, {
      method: "GET",
    });
    return data ?? null;
  } catch (err) {
    const e = err as { status?: number };
    if (e.status === 404) return null;
    throw err;
  }
}

export async function getProviderBySlug(slug: string): Promise<ProviderProfile | null> {
  try {
    const data = await apiRequest<ProviderProfile>(`/providers/by-slug/${encodeURIComponent(slug)}`, {
      method: "GET",
    });
    return data ?? null;
  } catch (err) {
    const e = err as { status?: number };
    if (e.status === 404) return null;
    throw err;
  }
}

export type UpdateProviderPayload = {
  legalName?: string;
  taxId?: string;
  country?: string;
};

export async function updateProvider(
  id: string,
  payload: UpdateProviderPayload
): Promise<ProviderProfile> {
  return apiRequest<ProviderProfile>(`/providers/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
