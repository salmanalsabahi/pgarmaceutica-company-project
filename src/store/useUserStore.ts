import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserNotification {
  id: string;
  message: string;
  date: string;
  read: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  businessType: string;
  role: 'user' | 'admin';
  wishlist: string[];
  notifications?: UserNotification[];
}

interface UserState {
  user: User | null;
  users: User[];
  login: (user: User) => void;
  logout: () => void;
  registerUser: (user: User) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  toggleWishlist: (productId: string) => void;
  addUserNotification: (userId: string, message: string) => void;
  markNotificationsAsRead: (userId: string) => void;
}

const defaultAdmin: User = {
  id: 'admin-1',
  name: 'مدير النظام',
  email: 'admin@alshifa.com',
  password: 'admin123',
  businessType: 'موزع',
  role: 'admin',
  wishlist: [],
  notifications: []
};

const defaultTestUser: User = {
  id: 'user-1',
  name: 'صيدلية الأمل - صنعاء',
  email: 'test@pharmacy.com',
  password: 'test123',
  businessType: 'صيدلية',
  role: 'user',
  wishlist: [],
  notifications: []
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      users: [defaultAdmin, defaultTestUser],
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
      registerUser: (newUser) => set((state) => ({ users: [...state.users, { ...newUser, notifications: [] }] })),
      updateUser: (id, data) => set((state) => {
        const updatedUsers = state.users.map(u => u.id === id ? { ...u, ...data } : u);
        const updatedCurrentUser = state.user?.id === id ? { ...state.user, ...data } : state.user;
        return { users: updatedUsers, user: updatedCurrentUser as User | null };
      }),
      toggleWishlist: (productId) => set((state) => {
        if (!state.user) return state;
        const wishlist = state.user.wishlist || [];
        const newWishlist = wishlist.includes(productId) 
          ? wishlist.filter(id => id !== productId)
          : [...wishlist, productId];
        
        const updatedUser = { ...state.user, wishlist: newWishlist };
        const updatedUsers = state.users.map(u => u.id === state.user!.id ? updatedUser : u);
        
        return { user: updatedUser, users: updatedUsers };
      }),
      addUserNotification: (userId, message) => set((state) => {
        const newNotification: UserNotification = {
          id: `notif-${Date.now()}`,
          message,
          date: new Date().toLocaleDateString('ar-YE'),
          read: false
        };
        const updatedUsers = state.users.map(u => {
          if (u.id === userId) {
            return { ...u, notifications: [newNotification, ...(u.notifications || [])] };
          }
          return u;
        });
        const updatedCurrentUser = state.user?.id === userId 
          ? { ...state.user, notifications: [newNotification, ...(state.user.notifications || [])] } 
          : state.user;
        return { users: updatedUsers, user: updatedCurrentUser };
      }),
      markNotificationsAsRead: (userId) => set((state) => {
        const updatedUsers = state.users.map(u => {
          if (u.id === userId) {
            return { ...u, notifications: (u.notifications || []).map(n => ({ ...n, read: true })) };
          }
          return u;
        });
        const updatedCurrentUser = state.user?.id === userId 
          ? { ...state.user, notifications: (state.user.notifications || []).map(n => ({ ...n, read: true })) } 
          : state.user;
        return { users: updatedUsers, user: updatedCurrentUser };
      })
    }),
    {
      name: 'alshifa-user-storage',
    }
  )
);
