import { create } from 'zustand';
import { db } from '../firebase';
import { collection, doc, setDoc, updateDoc, onSnapshot, query, orderBy, where } from 'firebase/firestore';

export interface Booking {
  id: string;
  userId?: string; 
  name: string;
  facilityName: string;
  phone: string;
  serviceType: string;
  date: string;
  time: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  isRead?: boolean;
}

interface BookingState {
  bookings: Booking[];
  initialize: (userId?: string, isAdmin?: boolean) => void;
  addBooking: (booking: Booking) => Promise<void>;
  updateBookingStatus: (id: string, status: Booking['status']) => Promise<void>;
  markBookingAsRead: (id: string) => Promise<void>;
  markAllBookingsAsRead: () => Promise<void>;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: [],
  
  initialize: (userId, isAdmin) => {
    let q;
    if (isAdmin) {
      q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    } else if (userId) {
      q = query(collection(db, 'bookings'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
    } else {
      return;
    }
    onSnapshot(q, (snapshot) => {
      const bookingsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
      set({ bookings: bookingsData });
    });
  },

  addBooking: async (booking) => {
    try {
      await setDoc(doc(db, 'bookings', booking.id), booking);
    } catch (error) {
      console.error("Error adding booking: ", error);
      throw error;
    }
  },

  updateBookingStatus: async (id, status) => {
    try {
      const bookingRef = doc(db, 'bookings', id);
      await updateDoc(bookingRef, { status });
    } catch (error) {
      console.error("Error updating booking status: ", error);
      throw error;
    }
  },
  
  markBookingAsRead: async (id) => {
    try {
      const bookingRef = doc(db, 'bookings', id);
      await updateDoc(bookingRef, { isRead: true });
    } catch (error) {
      console.error("Error marking booking as read: ", error);
    }
  },
  
  markAllBookingsAsRead: async () => {
    try {
      const { bookings } = get();
      const updatedBookings = bookings.map(b => ({ ...b, isRead: true }));
      set({ bookings: updatedBookings }); // Update local state immediately

      for (const booking of bookings) {
        if (!booking.isRead) {
          await updateDoc(doc(db, 'bookings', booking.id), { isRead: true });
        }
      }
    } catch (error) {
      console.error("Error marking all bookings as read: ", error);
    }
  }
}));
