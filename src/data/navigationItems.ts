import type { NavigationItem } from "../types/types";
import type { AuthUser } from "../api/auth";

export const ROUTES: Array<NavigationItem & { roles: string[] }> = [
  { title: "Comprar", href: "/tienda", roles: ["BUYER"] },
  { title: "Vender", href: "/vender", roles: ["RETAILER"] },
  { title: "Mi tienda", href: "/retailer", roles: ["RETAILER"] },
  { title: "Proveedores", href: "/proveedores", roles: ["PROVIDER"] },
];

const COMMON_ROUTES: NavigationItem[] = [
  { title: "Cómo funciona", href: "/como-funciona" },
];

const GUEST_NAV_ITEMS: NavigationItem[] = [
  { title: "Comprar", href: "/tienda" },
  { title: "Vender", href: "/vender" },
  { title: "Proveedores", href: "/proveedores" },
  ...COMMON_ROUTES,
];

/** Devuelve ítems de nav fusionando todos los roles del usuario. Incluye Mi tienda y Proveedores para que pueda ver la preview aunque no tenga el rol. */
export function getNavigationItems(user: AuthUser | null): NavigationItem[] {
  if (!user) return GUEST_NAV_ITEMS;

  const hasBuyer = !!user.hasBuyerProfile;
  const hasRetailer = !!user.hasStoreProfile;
  const hasProvider = !!user.hasProviderProfile || !!user.pendingProvider;

  const byRole: Record<string, boolean> = {
    BUYER: hasBuyer,
    RETAILER: hasRetailer,
    PROVIDER: hasProvider,
  };

  const seen = new Set<string>();
  const items: NavigationItem[] = [];

  for (const route of ROUTES) {
    const showByRole = route.roles.some((r) => byRole[r]);
    const isPreviewLink = route.href === "/retailer" || route.href === "/proveedores";
    if ((showByRole || isPreviewLink) && !seen.has(route.href)) {
      seen.add(route.href);
      items.push({ title: route.title, href: route.href });
    }
  }

  return [...items, ...COMMON_ROUTES];
}
