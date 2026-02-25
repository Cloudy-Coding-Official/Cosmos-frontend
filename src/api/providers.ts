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
  requireStoreApproval?: boolean;
  whitelistedStoreIds?: string[];
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
  requireStoreApproval?: boolean;
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

export type ShippingInfo = {
  recipientName?: string;
  email?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
};

export type ProviderStoreOrder = {
  id: string;
  storeId: string | null;
  totalAmount: string | number;
  currency: string;
  status: string;
  createdAt: string;
  shippingInfo?: ShippingInfo | null;
  store?: { id: string; name: string; slug: string };
  orderItems?: Array<{
    id: string;
    quantity: number;
    unitPrice: string | number;
    subtotal: string | number;
    product?: { id: string; name: string };
  }>;
};

export type ProviderSale = ProviderStoreOrder;

export async function getProviderSales(): Promise<ProviderSale[]> {
  const data = await apiRequest<ProviderSale[]>("/providers/me/sales", {
    method: "GET",
  });
  return Array.isArray(data) ? data : [];
}

export type ProviderStoreRequestItem = {
  id: string;
  storeId: string;
  productId: string;
  requestedPrice: number | string;
  currency: string;
  status: string;
  createdAt: string;
  product: { id: string; name: string; sku: string; imageUrl: string | null };
  store: { id: string; name: string; slug: string };
};

export async function getProviderStoreRequests(): Promise<ProviderStoreRequestItem[]> {
  const data = await apiRequest<ProviderStoreRequestItem[]>(
    "/providers/me/store-requests",
    { method: "GET" }
  );
  return Array.isArray(data) ? data : [];
}

export async function approveProviderStoreRequest(
  requestId: string,
  options?: { whitelist?: boolean }
): Promise<{ message: string; whitelisted?: boolean }> {
  return apiRequest(`/providers/me/store-requests/${encodeURIComponent(requestId)}/approve`, {
    method: "POST",
    body: JSON.stringify(options ?? {}),
  });
}

export async function rejectProviderStoreRequest(requestId: string): Promise<{ message: string }> {
  return apiRequest(`/providers/me/store-requests/${encodeURIComponent(requestId)}/reject`, {
    method: "POST",
  });
}

export type ProviderWhitelistedStore = {
  id: string;
  storeId: string;
  providerId: string;
  createdAt: string;
  store: { id: string; name: string; slug: string };
};

export async function getProviderWhitelistedStores(): Promise<ProviderWhitelistedStore[]> {
  const data = await apiRequest<ProviderWhitelistedStore[]>(
    "/providers/me/whitelisted-stores",
    { method: "GET" }
  );
  return Array.isArray(data) ? data : [];
}

export async function removeProviderWhitelistedStore(storeId: string): Promise<{ message: string }> {
  return apiRequest(`/providers/me/whitelisted-stores/${encodeURIComponent(storeId)}`, {
    method: "DELETE",
  });
}
