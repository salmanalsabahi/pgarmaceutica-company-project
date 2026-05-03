import { create } from 'zustand';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface NotificationState {
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  sendEmailNotification: (to: string, subject: string, html: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  toasts: [],
  addToast: (message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
  sendEmailNotification: async (to, subject, html) => {
    try {
      await addDoc(collection(db, 'mail'), {
        to,
        message: {
          subject,
          html,
        }
      });
    } catch (error) {
      console.error("Error sending email notification:", error);
    }
  }
}));
