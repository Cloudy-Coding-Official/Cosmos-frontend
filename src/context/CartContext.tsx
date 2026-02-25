/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { getProductBackendById } from "../api/products";

const STORAGE_KEY = "cosmos_cart";

function toNumber(v: number | string | null | undefined): number {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  const n = parseFloat(String(v));
  return Number.isFinite(n) ? n : 0;
}

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
  isValidating: boolean;
  addItem: (payload: AddToCartPayload) => void;
  removeItem: (productId: string, storeId: string) => void;
  updateQuantity: (productId: string, storeId: string, quantity: number) => void;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
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

  const [isValidating, setIsValidating] = useState(false);
  const itemsRef = useRef<CartItem[]>(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const refreshCart = useCallback(async () => {
    const current = itemsRef.current;
    const valid = current.filter(
      (i) =>
        i.productId?.length > 0 &&
        i.storeId?.length > 0 &&
        i.providerId?.length > 0 &&
        typeof i.quantity === "number" &&
        i.quantity >= 1
    );
    if (valid.length === 0) return;
    setIsValidating(true);
    try {
      const updated: CartItem[] = [];
      for (const item of valid) {
        const product = await getProductBackendById(item.productId);
        if (!product?.storeProducts?.length) continue;
        const storeProduct = product.storeProducts.find(
          (sp) => sp.store?.id === item.storeId
        );
        if (!storeProduct?.store) continue;
        if (product.provider?.id && product.provider.id !== item.providerId) continue;
        const price = toNumber(storeProduct.price ?? product.suggestedPrice);
        updated.push({
          productId: product.id,
          storeId: storeProduct.store.id,
          providerId: product.provider?.id ?? item.providerId,
          quantity: Math.min(Math.max(1, Math.floor(item.quantity)), 99),
          name: product.name ?? item.name,
          price,
          image: product.imageUrl ?? item.image,
          productSlug: product.slug ?? item.productSlug,
          storeSlug: storeProduct.store.slug ?? item.storeSlug,
          currency: product.currency ?? item.currency ?? "USD",
        });
      }
      setItems(updated);
    } finally {
      setIsValidating(false);
    }
  }, []);

  const subtotal = useMemo(() => getCartSubtotal(items), [items]);
  const fee = useMemo(() => getCartFee(items), [items]);
  const total = useMemo(() => getCartTotal(items), [items]);
  const itemCount = useMemo(() => items.reduce((acc, i) => acc + i.quantity, 0), [items]);

  const value = useMemo<CartContextType>(
    () => ({
      items,
      isValidating,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      refreshCart,
      subtotal,
      fee,
      total,
      itemCount,
    }),
    [items, isValidating, addItem, removeItem, updateQuantity, clearCart, refreshCart, subtotal, fee, total, itemCount]
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
