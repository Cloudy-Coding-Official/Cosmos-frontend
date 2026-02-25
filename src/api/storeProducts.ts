import { apiRequest } from "./client";

export type Store = {
  id: string;
  name: string;
  slug?: string;
  active?: boolean;
  _count?: { storeProducts: number };
};

export async function getMyStores(): Promise<Store[]> {
  const data = await apiRequest<Store[]>("/store-products/my-stores", { method: "GET" });
  return Array.isArray(data) ? data : [];
}

export async function createMyStore(name: string): Promise<Store> {
  return apiRequest<Store>("/store-products/my-stores", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export type StoreProductItem = {
  id: string;
  productId: string;
  storeId: string;
  price: number | string;
  currency: string;
  product: {
    id: string;
    name: string;
    suggestedPrice: number | string;
    imageUrl: string | null;
    provider?: { id: string; legalName: string };
  };
};

export async function getMyStoreProducts(): Promise<StoreProductItem[]> {
  const data = await apiRequest<StoreProductItem[]>("/store-products/my-store-products", {
    method: "GET",
  });
  return Array.isArray(data) ? data : [];
}

/** Productos de una tienda propia por slug (para /retailer/tiendas/:storeSlug/productos). */
export async function getStoreProductsByStoreSlug(
  storeSlug: string
): Promise<StoreProductItem[]> {
  const data = await apiRequest<StoreProductItem[]>(
    `/store-products/my-stores/by-slug/${encodeURIComponent(storeSlug)}/products`,
    { method: "GET" }
  );
  return Array.isArray(data) ? data : [];
}

export async function addProductToStore(
  storeId: string,
  productId: string,
  price: number,
  currency?: string
): Promise<{ id: string; storeId: string; productId: string }> {
  return apiRequest("/store-products/stores/" + encodeURIComponent(storeId) + "/products", {
    method: "POST",
    body: JSON.stringify({ productId, price, currency }),
  });
}

export async function updateStoreProductPrice(
  storeId: string,
  productId: string,
  price: number,
  currency?: string
): Promise<StoreProductItem> {
  return apiRequest(
    `/store-products/stores/${encodeURIComponent(storeId)}/products/${encodeURIComponent(productId)}`,
    {
      method: "PATCH",
      body: JSON.stringify({ price, currency }),
    }
  );
}

export async function removeProductFromStore(
  storeId: string,
  productId: string
): Promise<void> {
  await apiRequest(
    `/store-products/stores/${encodeURIComponent(storeId)}/products/${encodeURIComponent(productId)}`,
    { method: "DELETE" }
  );
}
