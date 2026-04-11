import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
}

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      updateOrderStatus: (id, status) => set((state) => ({
        orders: state.orders.map(o => o.id === id ? { ...o, status } : o)
      }))
    }),
    { name: 'alshifa-orders' }
  )
);
