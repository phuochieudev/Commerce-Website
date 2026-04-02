import { create } from 'zustand';
import { Cart } from '../types/cart';

interface CartStore {
  cart: Cart | null;
  setCart: (cart: Cart | null) => void;
  addItem: (item: any) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
}

const useCartStore = create<CartStore>((set) => ({
  cart: null,
  setCart: (cart) => set({ cart }),
  addItem: (item) =>
    set((state) => {
      if (!state.cart) return state;
      const existingItem = state.cart.items.find((i) => i.id === item.id);
      if (existingItem) {
        return {
          cart: {
            ...state.cart,
            items: state.cart.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          },
        };
      }
      return {
        cart: {
          ...state.cart,
          items: [...state.cart.items, item],
        },
      };
    }),
  removeItem: (itemId) =>
    set((state) => {
      if (!state.cart) return state;
      return {
        cart: {
          ...state.cart,
          items: state.cart.items.filter((i) => i.id !== itemId),
        },
      };
    }),
  clearCart: () => set({ cart: null }),
}));

export default useCartStore;
