import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PromoCode {
  id: string;
  code: string;
  discountPercentage: number;
  isActive: boolean;
}

interface PromoState {
  promos: PromoCode[];
  addPromo: (promo: PromoCode) => void;
  updatePromo: (id: string, data: Partial<PromoCode>) => void;
  deletePromo: (id: string) => void;
  getPromoByCode: (code: string) => PromoCode | undefined;
}

const defaultPromos: PromoCode[] = [
  { id: 'promo-1', code: 'SHIFA10', discountPercentage: 10, isActive: true },
  { id: 'promo-2', code: 'WELCOME20', discountPercentage: 20, isActive: true }
];

export const usePromoStore = create<PromoState>()(
  persist(
    (set, get) => ({
      promos: defaultPromos,
      addPromo: (promo) => set((state) => ({ promos: [...state.promos, promo] })),
      updatePromo: (id, data) => set((state) => ({
        promos: state.promos.map(p => p.id === id ? { ...p, ...data } : p)
      })),
      deletePromo: (id) => set((state) => ({
        promos: state.promos.filter(p => p.id !== id)
      })),
      getPromoByCode: (code) => {
        return get().promos.find(p => p.code.toUpperCase() === code.toUpperCase() && p.isActive);
      }
    }),
    {
      name: 'alshifa-promo-storage',
    }
  )
);
