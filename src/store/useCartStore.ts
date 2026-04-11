import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../data/products';
import { usePromoStore } from './usePromoStore';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  promoCode: string | null;
  discount: number;
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  getTotalYer: () => number;
  getTotalUsd: () => number;
  getFinalTotalYer: () => number;
  getFinalTotalUsd: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      discount: 0,
      addItem: (product, quantity) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.product.id === product.id);
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return { items: [...state.items, { product, quantity }] };
        });
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },
      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },
      clearCart: () => set({ items: [], promoCode: null, discount: 0 }),
      applyPromoCode: (code) => {
        const promo = usePromoStore.getState().getPromoByCode(code);
        if (promo) {
          set({ promoCode: promo.code, discount: promo.discountPercentage / 100 });
          return true;
        }
        return false;
      },
      removePromoCode: () => set({ promoCode: null, discount: 0 }),
      getTotalYer: () => {
        return get().items.reduce((total, item) => total + item.product.price_yer * item.quantity, 0);
      },
      getTotalUsd: () => {
        return get().items.reduce((total, item) => total + item.product.price_usd * item.quantity, 0);
      },
      getFinalTotalYer: () => {
        const total = get().getTotalYer();
        return total - (total * get().discount);
      },
      getFinalTotalUsd: () => {
        const total = get().getTotalUsd();
        return total - (total * get().discount);
      }
    }),
    {
      name: 'alshifa-cart-storage',
    }
  )
);
