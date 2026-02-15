export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
};

export const CART_ITEMS: CartItem[] = [
  { id: "1", name: "Auriculares inalámbricos", price: 49.99, quantity: 1, image: null },
  { id: "2", name: "Cargador rápido 65W", price: 22.0, quantity: 2, image: null },
];

export function getCartSubtotal(items: CartItem[]): number {
  return items.reduce((acc, i) => acc + i.price * i.quantity, 0);
}

export function getCartFee(items: CartItem[]): number {
  const subtotal = getCartSubtotal(items);
  return items.length * 0.1 + subtotal * 0.01;
}

export function getCartTotal(items: CartItem[]): number {
  return getCartSubtotal(items) + getCartFee(items);
}
