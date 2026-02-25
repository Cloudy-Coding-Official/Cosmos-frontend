import { apiRequest } from "./client";

export type OrderStatusBackend =
  | "PENDING"
  | "FUNDED"
  | "ESCROW_DEPLOYED"
  | "SHIPPED"
  | "DELIVERED"
  | "RELEASED"
  | "CANCELLED"
  | "DISPUTED";

export type OrderItemBackend = {
  id: string;
  quantity: number;
  unitPrice: string;
  subtotal: string;
  product?: { id: string; name: string };
};

export type OrderBackend = {
  id: string;
  buyerId: string;
  providerId: string;
  totalAmount: string;
  currency: string;
  status: OrderStatusBackend;
  createdAt: string;
  orderItems?: OrderItemBackend[];
};

export type RetailerSale = {
  id: string;
  storeId: string | null;
  buyerId: string | null;
  totalAmount: string | number;
  currency: string;
  status: string;
  createdAt: string;
  buyer?: { id: string; firstName: string | null; lastName: string | null } | null;
  orderItems?: OrderItemBackend[];
};

export async function getRetailerSales(): Promise<RetailerSale[]> {
  const data = await apiRequest<RetailerSale[]>("/orders/retailer/sales", { method: "GET" });
  return Array.isArray(data) ? data : [];
}

export async function getOrdersByBuyer(buyerId: string): Promise<OrderBackend[]> {
  return apiRequest<OrderBackend[]>(`/orders/buyer/${encodeURIComponent(buyerId)}`, {
    method: "GET",
  });
}

const STATUS_LABELS: Record<OrderStatusBackend, string> = {
  PENDING: "Pendiente",
  FUNDED: "Pagado",
  ESCROW_DEPLOYED: "En custodia",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  RELEASED: "Completado",
  CANCELLED: "Cancelado",
  DISPUTED: "En disputa",
};

export function orderStatusLabel(status: OrderStatusBackend): string {
  return STATUS_LABELS[status] ?? status;
}
