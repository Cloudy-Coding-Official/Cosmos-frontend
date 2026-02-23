import type { NavigationItem } from "../types/types";

export const ROUTES: Array<NavigationItem & { roles: string[] }> = [
    {
        title: "Comprar",
        href: "/tienda",
        roles: ["BUYER"],
    },
    {
        title: "Vender",
        href: "/vender",
        roles: ["RETAILER"],
    },
    {
        title: "Proveedores",
        href: "/proveedores",
        roles: ["PROVIDER"],
    },
];

const COMMON_ROUTES: NavigationItem[] = [
    {
        title: "Cómo funciona",
        href: "/como-funciona",
    },
];

export const NavigationConfig: Record<string, NavigationItem[]> = {};

const ROLES = ["USER", "BUYER", "RETAILER", "PROVIDER"];

ROLES.forEach((role) => {
    NavigationConfig[role] = [
        ...ROUTES.filter((route) => route.roles.includes(role)),
        ...COMMON_ROUTES,
    ];
});
