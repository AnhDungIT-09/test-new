import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  thumbnail?: string;
  spicyLevel?: string;
  size?: string;
}

export interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "bunbo-cart";

const loadInitialCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored) as CartItem[];
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item) =>
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        typeof item.price === "number" &&
        typeof item.quantity === "number",
    );
  } catch (error) {
    console.warn("Unable to parse stored cart", error);
    return [];
  }
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [items, setItems] = useState<CartItem[]>(loadInitialCart);

  // Lưu vào localStorage mỗi khi items thay đổi
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // ======== ADD ITEM ========
  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">, quantity: number = 1) => {
      if (quantity <= 0) return;

      setItems((prev) => {
        const existing = prev.find((cartItem) => cartItem.id === item.id);
        if (existing) {
          const nextQuantity = Math.min(existing.quantity + quantity, 99);
          toast.success("Đã cập nhật giỏ hàng", { description: item.name });

          return prev.map((cartItem) =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: nextQuantity }
              : cartItem,
          );
        }

        toast.success("Đã thêm vào giỏ hàng", { description: item.name });
        return [...prev, { ...item, quantity: Math.min(quantity, 99) }];
      });
    },
    [],
  );

  // ======== UPDATE QUANTITY ========
  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (!item) return prev;

      const nextQuantity = Math.max(0, Math.min(quantity, 99));

      // Nếu giảm xuống 0 → xóa khỏi giỏ + hiện toast
      if (nextQuantity === 0) {
        toast("Đã xóa món khỏi giỏ hàng", { description: item.name });
        return prev.filter((i) => i.id !== id);
      }

      toast.success("Đã cập nhật số lượng", {
        description: `${item.name}: ${nextQuantity}`,
      });

      return prev.map((i) =>
        i.id === id ? { ...i, quantity: nextQuantity } : i,
      );
    });
  }, []);

  // ======== REMOVE ITEM ========
  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) {
        toast("Đã xóa món khỏi giỏ hàng", { description: item.name });
      }
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  // ======== CLEAR CART ========
  const clearCart = useCallback(() => {
    setItems((prev) => {
      if (prev.length > 0) {
        toast("Đã làm trống giỏ hàng", {
          description: "Bạn có thể tiếp tục chọn món khác.",
        });
      }
      return [];
    });
  }, []);

  // ======== COMPUTED VALUES ========
  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      itemCount: items.reduce((total, item) => total + item.quantity, 0),
      subtotal,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [items, subtotal, addItem, updateQuantity, removeItem, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// ======== HOOK ========
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
