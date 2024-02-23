import { Product } from "@/payload-types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type cartItem = {
  product: Product;
};

export type cartState = {
  items: cartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

export const useCart = create<cartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) => {
        set((state) => {
          return { items: [...state.items, { product }] };
        });
      },
      removeItem: (id) => {
        set((state) => {
          return {
            items: state.items.filter((item) => item.product.id !== id),
          };
        });
      },
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
