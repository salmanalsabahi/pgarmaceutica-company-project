import { create } from 'zustand';
import { db } from '../firebase';
import { collection, doc, setDoc, updateDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

export interface Booking {
  id: string;
  userId?: string; // Optional, in case they book as guest or we link it later
  name: string;
  facilityName: string;
  phone: string;
  serviceType: string;
  date: string;
  time: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

interface BookingState {
  bookings: Booking[];
  initialize: () => void;
  addBooking: (booking: Booking) => Promise<void>;
  updateBookingStatus: (id: string, status: Booking['status']) => Promise<void>;
}

export const useBookingStore = create<BookingState>((set) => ({
  bookings: [],
  
  initialize: () => {
    const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    onSnapshot(q, (snapshot) => {
      const bookingsData = snapshot.docs.map(doc => doc.data() as Booking);
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
  }
}));
