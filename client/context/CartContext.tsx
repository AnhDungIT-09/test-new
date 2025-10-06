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

const createToastId = () => {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const loadInitialCart = (): CartItem[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored) as CartItem[];
    if (!Array.isArray(parsed)) {
      return [];
    }

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

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">, quantity: number = 1) => {
      if (quantity <= 0) {
        return;
      }

      let notification: {
        title: string;
        description?: string;
        variant?: "success" | "info";
        id: string;
      } | null = null;

      setItems((prev) => {
        const existing = prev.find((cartItem) => cartItem.id === item.id);
        if (existing) {
          const nextQuantity = Math.min(existing.quantity + quantity, 99);
          notification = {
            title: `${item.name}`,
            description: `Đã cập nhật số lượng (${nextQuantity}) trong giỏ hàng.`,
            variant: "info",
            id: createToastId(),
          };
          return prev.map((cartItem) =>
            cartItem.id === item.id
              ? {
                  ...cartItem,
                  quantity: nextQuantity,
                }
              : cartItem,
          );
        }

        notification = {
          title: `${item.name}`,
          description: "Đã thêm vào giỏ hàng.",
          variant: "success",
          id: createToastId(),
        };

        return [
          ...prev,
          {
            ...item,
            quantity: Math.min(quantity, 99),
          },
        ];
      });

      if (notification) {
        const { title, description, variant = "success", id } = notification;
        const showToast = variant === "info" ? toast.info : toast.success;
        showToast(title, {
          description,
          id,
        });
      }
    },
    [],
  );

  const updateQuantity = useCallback((id: string, quantity: number) => {
    let removedItem: CartItem | null = null;

    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id !== id) {
            return item;
          }

          const nextQuantity = Math.max(0, Math.min(quantity, 99));
          if (nextQuantity === 0) {
            removedItem = item;
          }

          return {
            ...item,
            quantity: nextQuantity,
          };
        })
        .filter((item) => item.quantity > 0),
    );

    if (removedItem) {
      toast("Đã xóa món khỏi giỏ hàng", {
        description: removedItem.name,
        id: createToastId(),
      });
    }
  }, []);

  const removeItem = useCallback((id: string) => {
    let removedItem: CartItem | null = null;

    setItems((prev) => {
      removedItem = prev.find((item) => item.id === id) ?? null;
      return prev.filter((item) => item.id !== id);
    });

    if (removedItem) {
      toast("Đã xóa món khỏi giỏ hàng", {
        description: removedItem.name,
      });
    }
  }, []);

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
    [addItem, clearCart, items, removeItem, subtotal, updateQuantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
