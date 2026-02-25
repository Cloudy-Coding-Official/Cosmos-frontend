import { apiRequest } from "./client";

type ProductBackend = {
  id: string;
  name: string;
  description?: string | null;
  suggestedPrice: number | string;
  basePrice?: number | string;
  wholesalePrice?: number | string;
  currency?: string;
  imageUrl?: string | null;
  rating?: number | string | null;
  reviews?: number | null;
  highlights?: string[] | null;
  specs?: { label: string; value: string }[] | null;
  sku?: string;
  stock?: number;
  category?: string;
  provider?: { id: string; legalName?: string; slug?: string } | null;
  slug?: string;
  storeProducts?: Array<{
    price?: number | string;
    store: { id: string; name: string; slug: string };
  }>;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  seller: string;
  rating: number;
  reviews?: number;
  description?: string;
  highlights?: string[];
  specs?: { label: string; value: string }[];
  /** Tienda (retailer) que vende este producto en /tienda; para link "Ver más de esta tienda" */
  sellerStoreId?: string;
  sellerStoreName?: string;
  sellerStoreSlug?: string;
  /** Slug del producto para URL /tienda/:storeSlug/producto/:productSlug */
  slug?: string;
  /** Proveedor del producto; para link "Ver catálogo del proveedor" (B2B) */
  providerId?: string;
  providerName?: string;
  providerSlug?: string;
};

function toNumber(v: number | string | null | undefined): number {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  const n = parseFloat(String(v));
  return Number.isFinite(n) ? n : 0;
}

/** Si se pasa storeSlug, se usa el precio de esa tienda cuando exista en storeProducts. */
function mapBackendToProduct(row: ProductBackend, storeSlug?: string): Product {
  const storeProducts = row.storeProducts ?? [];
  const storeProduct =
    storeSlug != null
      ? storeProducts.find((sp) => sp.store?.slug === storeSlug) ?? storeProducts[0]
      : storeProducts[0];
  const firstStore = storeProduct?.store;
  const seller = firstStore?.name ?? (row.provider && "legalName" in row.provider && row.provider.legalName ? row.provider.legalName : "Proveedor");
  const price =
    storeProduct != null && storeProduct.price != null
      ? toNumber(storeProduct.price)
      : toNumber(row.suggestedPrice);
  return {
    id: row.id,
    name: row.name,
    price,
    image: row.imageUrl ?? "",
    seller,
    rating: toNumber(row.rating) || 0,
    reviews: row.reviews ?? undefined,
    description: row.description ?? undefined,
    highlights: Array.isArray(row.highlights) ? row.highlights : undefined,
    specs: Array.isArray(row.specs) ? row.specs : undefined,
    sellerStoreId: firstStore?.id,
    sellerStoreName: firstStore?.name,
    sellerStoreSlug: firstStore?.slug,
    slug: row.slug,
    providerId: row.provider?.id,
    providerName: row.provider?.legalName ?? undefined,
    providerSlug: row.provider?.slug,
  };
}

export type ProductFilters = {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "price_asc" | "price_desc" | "rating" | "newest";
  providerId?: string;
  storeId?: string;
  storeSlug?: string;
};

function buildProductsQuery(filters?: ProductFilters): string {
  if (!filters || Object.keys(filters).length === 0) return "";
  const params = new URLSearchParams();
  if (filters.q?.trim()) params.set("q", filters.q.trim());
  if (filters.category?.trim()) params.set("category", filters.category.trim());
  if (filters.minPrice != null && filters.minPrice >= 0) params.set("minPrice", String(filters.minPrice));
  if (filters.maxPrice != null && filters.maxPrice >= 0) params.set("maxPrice", String(filters.maxPrice));
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.providerId) params.set("providerId", filters.providerId);
  if (filters.storeId) params.set("storeId", filters.storeId);
  if (filters.storeSlug) params.set("storeSlug", filters.storeSlug);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  const path = `/products${buildProductsQuery(filters)}`;
  const data = await apiRequest<ProductBackend[]>(path, { method: "GET", skipAuth: true });
  const list = Array.isArray(data) ? data : [];
  const storeSlug = filters?.storeSlug;
  return list.map((row) => mapBackendToProduct(row, storeSlug));
}

export async function getProductCategories(forPublicShop?: boolean): Promise<string[]> {
  const qs = forPublicShop ? "?forPublicShop=true" : "";
  const data = await apiRequest<{ category: string }[]>(`/products/categories/list${qs}`, {
    method: "GET",
    skipAuth: true,
  });
  const list = Array.isArray(data) ? data : [];
  return list.map((r) => r.category);
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const data = await apiRequest<ProductBackend>(`/products/${encodeURIComponent(id)}`, {
      method: "GET",
      skipAuth: true,
    });
    return data ? mapBackendToProduct(data) : null;
  } catch (err) {
    const e = err as { status?: number };
    if (e.status === 404) return null;
    throw err;
  }
}

export async function getProductBySlug(slug: string, storeSlug?: string): Promise<Product | null> {
  try {
    const qs = storeSlug ? `?storeSlug=${encodeURIComponent(storeSlug)}` : "";
    const data = await apiRequest<ProductBackend>(
      `/products/by-slug/${encodeURIComponent(slug)}${qs}`,
      { method: "GET", skipAuth: true }
    );
    return data ? mapBackendToProduct(data, storeSlug) : null;
  } catch (err) {
    const e = err as { status?: number };
    if (e.status === 404) return null;
    throw err;
  }
}

export type CreateProductPayload = {
  name: string;
  description?: string;
  sku: string;
  basePrice: number;
  wholesalePrice: number;
  suggestedPrice: number;
  currency?: string;
  stock?: number;
  logisticsCost?: number;
  category: string;
  imageUrl?: string;
  rating?: number;
  reviews?: number;
  highlights?: string[];
  specs?: { label: string; value: string }[];
};

export type UpdateProductPayload = Partial<
  Omit<CreateProductPayload, "sku"> & { active?: boolean }
>;

/** Datos completos del producto para edición (proveedor) */
export type ProductForEdit = CreateProductPayload & { id: string };

export async function getProductForEdit(id: string): Promise<ProductForEdit | null> {
  try {
    const data = await apiRequest<ProductBackend>(`/products/${encodeURIComponent(id)}`, {
      method: "GET",
      skipAuth: true,
    });
    if (!data) return null;
    return {
      id: data.id,
      name: data.name,
      description: data.description ?? undefined,
      sku: data.sku ?? "",
      basePrice: toNumber(data.basePrice),
      wholesalePrice: toNumber(data.wholesalePrice),
      suggestedPrice: toNumber(data.suggestedPrice),
      currency: data.currency ?? "USD",
      stock: data.stock ?? 0,
      category: data.category ?? "General",
      imageUrl: data.imageUrl ?? undefined,
    };
  } catch (err) {
    const e = err as { status?: number };
    if (e.status === 404) return null;
    throw err;
  }
}

export async function createProduct(
  providerId: string,
  payload: CreateProductPayload
): Promise<Product> {
  const data = await apiRequest<ProductBackend>(
    `/products?providerId=${encodeURIComponent(providerId)}`,
    { method: "POST", body: JSON.stringify(payload) }
  );
  return mapBackendToProduct(data);
}

export async function updateProduct(
  id: string,
  payload: UpdateProductPayload
): Promise<Product> {
  const data = await apiRequest<ProductBackend>(`/products/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return mapBackendToProduct(data);
}

export async function deleteProduct(id: string): Promise<void> {
  await apiRequest(`/products/${encodeURIComponent(id)}`, { method: "DELETE" });
}
