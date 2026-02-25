/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";

const STORAGE_KEY = "cosmos_cart";

export type CartItem = {
  productId: string;
  storeId: string;
  providerId: string;
  quantity: number;
  name: string;
  price: number;
  image: string;
  productSlug?: string;
  storeSlug?: string;
  currency?: string;
};

function cartItemKey(item: { productId: string; storeId: string }): string {
  return `${item.productId}:${item.storeId}`;
}

function loadCartFromStorage(): CartItem[] {
  try {
    const raw = typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCartToStorage(items: CartItem[]) {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  } catch {
    // ignore
  }
}

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

export type AddToCartPayload = {
  productId: string;
  storeId: string;
  providerId: string;
  quantity: number;
  name: string;
  price: number;
  image: string;
  productSlug?: string;
  storeSlug?: string;
  currency?: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (payload: AddToCartPayload) => void;
  removeItem: (productId: string, storeId: string) => void;
  updateQuantity: (productId: string, storeId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  fee: number;
  total: number;
  itemCount: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => loadCartFromStorage());

  useEffect(() => {
    saveCartToStorage(items);
  }, [items]);

  const addItem = useCallback((payload: AddToCartPayload) => {
    setItems((prev) => {
      const key = cartItemKey({ productId: payload.productId, storeId: payload.storeId });
      const existing = prev.find(
        (i) => cartItemKey(i) === key
      );
      if (existing) {
        return prev.map((i) =>
          cartItemKey(i) === key
            ? { ...i, quantity: i.quantity + payload.quantity }
            : i
        );
      }
      return [
        ...prev,
        {
          productId: payload.productId,
          storeId: payload.storeId,
          providerId: payload.providerId,
          quantity: payload.quantity,
          name: payload.name,
          price: payload.price,
          image: payload.image,
          productSlug: payload.productSlug,
          storeSlug: payload.storeSlug,
          currency: payload.currency,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((productId: string, storeId: string) => {
    const key = `${productId}:${storeId}`;
    setItems((prev) => prev.filter((i) => cartItemKey(i) !== key));
  }, []);

  const updateQuantity = useCallback((productId: string, storeId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(productId, storeId);
      return;
    }
    const key = `${productId}:${storeId}`;
    setItems((prev) =>
      prev.map((i) =>
        cartItemKey(i) === key ? { ...i, quantity } : i
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const subtotal = useMemo(() => getCartSubtotal(items), [items]);
  const fee = useMemo(() => getCartFee(items), [items]);
  const total = useMemo(() => getCartTotal(items), [items]);
  const itemCount = useMemo(() => items.reduce((acc, i) => acc + i.quantity, 0), [items]);

  const value = useMemo<CartContextType>(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      subtotal,
      fee,
      total,
      itemCount,
    }),
    [items, addItem, removeItem, updateQuantity, clearCart, subtotal, fee, total, itemCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
