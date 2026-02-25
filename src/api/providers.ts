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

export type ProviderRetailerStoreProduct = {
  productId: string;
  productName: string;
  sku: string;
};

export type ProviderRetailerStore = {
  storeId: string;
  storeName: string;
  storeSlug: string;
  productCount: number;
  orderCount: number;
  products: ProviderRetailerStoreProduct[];
};

export async function getProviderRetailerStores(): Promise<ProviderRetailerStore[]> {
  const data = await apiRequest<ProviderRetailerStore[]>("/providers/me/retailer-stores", {
    method: "GET",
  });
  return Array.isArray(data) ? data : [];
}

export async function getProviderStoreOrders(storeId: string): Promise<ProviderStoreOrder[]> {
  const data = await apiRequest<ProviderStoreOrder[]>(
    `/providers/me/retailer-stores/${encodeURIComponent(storeId)}/orders`,
    { method: "GET" }
  );
  return Array.isArray(data) ? data : [];
}

export type ProviderStoreOrder = {
  id: string;
  storeId: string | null;
  totalAmount: string | number;
  currency: string;
  status: string;
  createdAt: string;
  store?: { id: string; name: string; slug: string };
  orderItems?: Array<{
    id: string;
    quantity: number;
    unitPrice: string | number;
    subtotal: string | number;
    product?: { id: string; name: string };
  }>;
};
