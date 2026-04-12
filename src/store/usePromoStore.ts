import { create } from 'zustand';
import { db } from '../firebase';
import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

export interface PromoCode {
  id: string;
  code: string;
  discountPercentage: number;
  isActive: boolean;
}

interface PromoState {
  promos: PromoCode[];
  initialize: () => void;
  addPromo: (promo: PromoCode) => Promise<void>;
  updatePromo: (id: string, data: Partial<PromoCode>) => Promise<void>;
  deletePromo: (id: string) => Promise<void>;
  getPromoByCode: (code: string) => PromoCode | undefined;
}

export const usePromoStore = create<PromoState>((set, get) => ({
  promos: [],
  
  initialize: () => {
    onSnapshot(collection(db, 'promos'), (snapshot) => {
      const promosData = snapshot.docs.map(doc => doc.data() as PromoCode);
      set({ promos: promosData });
    });
  },

  addPromo: async (promo) => {
    try {
      await setDoc(doc(db, 'promos', promo.id), promo);
    } catch (error) {
      console.error("Error adding promo: ", error);
      throw error;
    }
  },

  updatePromo: async (id, data) => {
    try {
      const promoRef = doc(db, 'promos', id);
      await updateDoc(promoRef, data);
    } catch (error) {
      console.error("Error updating promo: ", error);
      throw error;
    }
  },

  deletePromo: async (id) => {
    try {
      await deleteDoc(doc(db, 'promos', id));
    } catch (error) {
      console.error("Error deleting promo: ", error);
      throw error;
    }
  },

  getPromoByCode: (code) => {
    return get().promos.find(p => p.code.toUpperCase() === code.toUpperCase() && p.isActive);
  }
}));
