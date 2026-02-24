import { apiRequest } from "./client";

type ProductBackend = {
  id: string;
  name: string;
  description?: string | null;
  suggestedPrice: number | string;
  currency?: string;
  imageUrl?: string | null;
  rating?: number | string | null;
  reviews?: number | null;
  highlights?: string[] | null;
  specs?: { label: string; value: string }[] | null;
  provider: { id: string; legalName: string } | { id: string; legalName?: string };
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
    "legalName" in row.provider && row.provider.legalName
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

export async function getProducts(providerId?: string): Promise<Product[]> {
  const path = providerId
    ? `/products?providerId=${encodeURIComponent(providerId)}`
    : "/products";
  const data = await apiRequest<ProductBackend[]>(path, { method: "GET", skipAuth: true });
  const list = Array.isArray(data) ? data : [];
  return list.map(mapBackendToProduct);
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
