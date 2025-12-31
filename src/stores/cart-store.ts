import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CartItem } from "@/types/shop";

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.productId === item.productId && i.size === item.size);

          if (existingItem) {
            const newItems = state.items.map((i) =>
              i.productId === item.productId && i.size === item.size ? { ...i, qty: i.qty + item.qty } : i,
            );
            return {
              items: newItems,
              totalItems: newItems.reduce((sum, item) => sum + item.qty, 0),
              subtotal: newItems.reduce((sum, item) => sum + item.price * item.qty, 0),
            };
          }

          const newItems = [...state.items, item];
          return {
            items: newItems,
            totalItems: newItems.reduce((sum, item) => sum + item.qty, 0),
            subtotal: newItems.reduce((sum, item) => sum + item.price * item.qty, 0),
          };
        }),

      removeItem: (productId, size) =>
        set((state) => {
          const newItems = state.items.filter((i) => !(i.productId === productId && i.size === size));
          return {
            items: newItems,
            totalItems: newItems.reduce((sum, item) => sum + item.qty, 0),
            subtotal: newItems.reduce((sum, item) => sum + item.price * item.qty, 0),
          };
        }),

      updateQuantity: (productId, size, qty) =>
        set((state) => {
          const newItems = state.items.map((i) =>
            i.productId === productId && i.size === size ? { ...i, qty: Math.max(1, qty) } : i,
          );
          return {
            items: newItems,
            totalItems: newItems.reduce((sum, item) => sum + item.qty, 0),
            subtotal: newItems.reduce((sum, item) => sum + item.price * item.qty, 0),
          };
        }),

      clearCart: () => set({ items: [], totalItems: 0, subtotal: 0 }),

      totalItems: 0,
      subtotal: 0,
    }),
    {
      name: "yeezy-cart-storage",
    },
  ),
);
