import { apiRequest } from "./client";

export type ShipmentDto = {
  id: string;
  orderId: string;
  escrowId: string;
  status: string;
  sellerMarkedShipped: boolean;
  sellerMarkedDelivered: boolean;
  buyerConfirmed?: boolean | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  carrier?: string | null;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  [key: string]: unknown;
};

export async function getShipmentByOrder(orderId: string): Promise<ShipmentDto> {
  return apiRequest<ShipmentDto>(
    `/shipments/order/${encodeURIComponent(orderId)}`,
    { method: "GET" }
  );
}

export type MarkShippedPayload = {
  carrier?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
  notes?: string;
};

export async function markShipmentShipped(
  shipmentId: string,
  payload?: MarkShippedPayload
): Promise<ShipmentDto> {
  return apiRequest<ShipmentDto>(
    `/shipments/${encodeURIComponent(shipmentId)}/mark-shipped`,
    {
      method: "POST",
      body: JSON.stringify(payload ?? {}),
    }
  );
}

export type MarkDeliveredPayload = {
  notes?: string;
};

export async function markShipmentDelivered(
  shipmentId: string,
  payload?: MarkDeliveredPayload
): Promise<ShipmentDto> {
  return apiRequest<ShipmentDto>(
    `/shipments/${encodeURIComponent(shipmentId)}/mark-delivered`,
    {
      method: "POST",
      body: JSON.stringify(payload ?? {}),
    }
  );
}

export type CreateShipmentPayload = {
  orderId: string;
  escrowId: string;
  carrier?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
  notes?: string;
};

export async function createShipment(
  payload: CreateShipmentPayload
): Promise<ShipmentDto> {
  return apiRequest<ShipmentDto>("/shipments", {
    method: "POST",
    body: JSON.stringify({
      ...payload,
      estimatedDelivery: payload.estimatedDelivery ?? undefined,
    }),
  });
}

/** Comprador: confirma que recibió el pedido (libera el escrow) o reporta que no llegó (abre disputa). */
export type BuyerDeliveryResponsePayload = {
  received: boolean;
  reason?: string;
};

export async function buyerDeliveryResponse(
  shipmentId: string,
  payload: BuyerDeliveryResponsePayload
): Promise<ShipmentDto> {
  return apiRequest<ShipmentDto>(
    `/shipments/${encodeURIComponent(shipmentId)}/buyer-response`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}
