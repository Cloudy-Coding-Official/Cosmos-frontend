export type OrderStatus = "comprado" | "en_camino" | "confirmado";

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  fecha: string;
  monto: number;
  items: OrderItem[];
  estado: OrderStatus;
  codigoConfirmacion: string;
  codigoCompradorIngresado?: string;
  codigoVendedorIngresado?: string;
  tienda: string;
  direccionEnvio: string;
};

const STORAGE_KEY = "cosmos_orders";

function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveOrders(orders: Order[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export function getOrders(): Order[] {
  return loadOrders();
}

export function getOrder(id: string): Order | undefined {
  return loadOrders().find((o) => o.id === id);
}

export function addOrder(order: Omit<Order, "id" | "codigoConfirmacion">): Order {
  const orders = loadOrders();
  const id = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const codigoConfirmacion = Math.random().toString(36).slice(2, 8).toUpperCase();
  const nueva: Order = {
    ...order,
    id,
    codigoConfirmacion,
  };
  orders.unshift(nueva);
  saveOrders(orders);
  return nueva;
}

export function updateOrderStatus(id: string, estado: OrderStatus): void {
  const orders = loadOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx >= 0) {
    orders[idx] = { ...orders[idx], estado };
    saveOrders(orders);
  }
}

export function ingresarCodigoComprador(id: string, codigo: string): boolean {
  const orders = loadOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx < 0) return false;
  const o = orders[idx];
  if (o.codigoConfirmacion.toUpperCase() !== codigo.toUpperCase().trim()) return false;
  const vendedorYaConfirmo = !!o.codigoVendedorIngresado;
  orders[idx] = {
    ...o,
    codigoCompradorIngresado: codigo,
    codigoVendedorIngresado: vendedorYaConfirmo ? o.codigoVendedorIngresado : codigo, // demo: comprador confirma = listo
    estado: "confirmado",
  };
  saveOrders(orders);
  return true;
}

export function ingresarCodigoVendedor(id: string, codigo: string): boolean {
  const orders = loadOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx < 0) return false;
  const o = orders[idx];
  if (o.codigoConfirmacion.toUpperCase() !== codigo.toUpperCase().trim()) return false;
  const compradorYaConfirmo = !!o.codigoCompradorIngresado;
  orders[idx] = {
    ...o,
    codigoVendedorIngresado: codigo,
    estado: compradorYaConfirmo ? "confirmado" : o.estado,
  };
  saveOrders(orders);
  return true;
}

export function marcarEnCamino(id: string): void {
  updateOrderStatus(id, "en_camino");
}
