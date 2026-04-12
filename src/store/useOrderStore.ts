import { create } from 'zustand';
import { db } from '../firebase';
import { collection, doc, setDoc, updateDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { CartItem } from './useCartStore';

export interface Order {
  id: string;
  userId: string;
  date: string;
  items: CartItem[];
  totalYer: number;
  totalUsd: number;
  status: 'جديد' | 'قيد المعالجة' | 'تم الشحن' | 'تم التسليم' | 'مرفوض';
  shippingInfo: any;
  paymentMethod: string;
  receiptUrl?: string;
  promoCode?: string;
  discountPercentage?: number;
}

interface OrderState {
  orders: Order[];
  initialize: () => void;
  addOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  
  initialize: () => {
    const q = query(collection(db, 'orders'), orderBy('date', 'desc'));
    onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => doc.data() as Order);
      set({ orders: ordersData });
    });
  },

  addOrder: async (order) => {
    try {
      await setDoc(doc(db, 'orders', order.id), order);
    } catch (error) {
      console.error("Error adding order: ", error);
      throw error;
    }
  },

  updateOrderStatus: async (id, status) => {
    try {
      const orderRef = doc(db, 'orders', id);
      await updateDoc(orderRef, { status });
    } catch (error) {
      console.error("Error updating order status: ", error);
      throw error;
    }
  }
}));
