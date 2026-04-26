import { create } from 'zustand';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

interface MessageState {
  messages: ContactMessage[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllMessagesAsRead: () => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
}

export const useMessageStore = create<MessageState>((set, get) => {
  // Real-time listener for messages
  onSnapshot(query(collection(db, 'messages'), orderBy('date', 'desc')), (snapshot) => {
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactMessage));
    const unreadCount = messages.filter(m => !m.read).length;
    set({ messages, unreadCount });
  });

  return {
    messages: [],
    unreadCount: 0,
    markAsRead: async (id) => {
      try {
        await updateDoc(doc(db, 'messages', id), { read: true });
      } catch (error) {
        console.error("Error marking message as read:", error);
      }
    },
    markAllMessagesAsRead: async () => {
      try {
        const { messages } = get();
        // Update local state instantly so notification badge vanishes
        const updatedMessages = messages.map(m => ({ ...m, read: true }));
        set({ messages: updatedMessages, unreadCount: 0 });

        for (const message of messages) {
          if (!message.read) {
            await updateDoc(doc(db, 'messages', message.id), { read: true });
          }
        }
      } catch (error) {
        console.error("Error marking all messages as read:", error);
      }
    },
    deleteMessage: async (id) => {
      try {
        await deleteDoc(doc(db, 'messages', id));
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    }
  };
});
