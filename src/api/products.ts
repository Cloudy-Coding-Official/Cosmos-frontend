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
  provider?: { id: string; legalName?: string } | null;
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
};

function toNumber(v: number | string | null | undefined): number {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  const n = parseFloat(String(v));
  return Number.isFinite(n) ? n : 0;
}

function mapBackendToProduct(row: ProductBackend): Product {
  const seller =
    row.provider && "legalName" in row.provider && row.provider.legalName
      ? row.provider.legalName
      : "Proveedor";
  return {
    id: row.id,
    name: row.name,
    price: toNumber(row.suggestedPrice),
    image: row.imageUrl ?? "",
    seller,
    rating: toNumber(row.rating) || 0,
    reviews: row.reviews ?? undefined,
    description: row.description ?? undefined,
    highlights: Array.isArray(row.highlights) ? row.highlights : undefined,
    specs: Array.isArray(row.specs) ? row.specs : undefined,
  };
}

export type ProductFilters = {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "price_asc" | "price_desc" | "rating" | "newest";
  providerId?: string;
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
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  const path = `/products${buildProductsQuery(filters)}`;
  const data = await apiRequest<ProductBackend[]>(path, { method: "GET", skipAuth: true });
  const list = Array.isArray(data) ? data : [];
  return list.map(mapBackendToProduct);
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
