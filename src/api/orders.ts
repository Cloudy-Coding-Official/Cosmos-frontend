import { apiRequest } from "./client";

export type ShippingInfoPayload = {
  recipientName?: string;
  email?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
};

export type CreateOrderItemPayload = {
  productId: string;
  quantity: number;
  unitPrice: number;
};

export type CreateOrderPayload = {
  buyerId: string;
  storeId: string;
  providerId: string;
  items: CreateOrderItemPayload[];
  currency?: string;
  shippingInfo?: ShippingInfoPayload;
};

export type OrderCreated = {
  id: string;
  buyerId: string | null;
  storeId: string | null;
  providerId: string;
  totalAmount: string | number;
  currency: string;
  status: string;
  createdAt: string;
  orderItems?: OrderItemBackend[];
};

export async function createOrder(payload: CreateOrderPayload): Promise<OrderCreated> {
  return apiRequest<OrderCreated>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

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
  buyerId: string | null;
  storeId: string | null;
  providerId: string;
  totalAmount: string;
  currency: string;
  status: OrderStatusBackend;
  createdAt: string;
  shippingInfo?: ShippingInfoPayload | null;
  orderItems?: OrderItemBackend[];
  buyer?: { id: string; firstName: string | null; lastName: string | null } | null;
  store?: { id: string; name: string; slug: string } | null;
};

export async function getOrderById(orderId: string): Promise<OrderBackend | null> {
  try {
    return await apiRequest<OrderBackend>(`/orders/${encodeURIComponent(orderId)}`, {
      method: "GET",
    });
  } catch (err) {
    const e = err as { status?: number };
    if (e.status === 404) return null;
    throw err;
  }
}

export type RetailerSale = {
  id: string;
  storeId: string | null;
  buyerId: string | null;
  totalAmount: string | number;
  currency: string;
  status: string;
  createdAt: string;
  shippingInfo?: ShippingInfoPayload | null;
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
