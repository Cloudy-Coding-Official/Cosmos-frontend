import { apiRequest } from "./client";

export type StorePublic = {
  id: string;
  name: string;
  slug: string;
};

export async function getStoreBySlug(slug: string): Promise<StorePublic | null> {
  try {
    const data = await apiRequest<StorePublic>(
      `/stores/by-slug/${encodeURIComponent(slug)}`,
      { method: "GET", skipAuth: true }
    );
    return data ?? null;
  } catch (err) {
    const e = err as { status?: number };
    if (e.status === 404) return null;
    throw err;
  }
}
