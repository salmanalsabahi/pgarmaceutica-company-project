import { create } from 'zustand';
import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface PaymentAccount {
  id: string;
  type: 'bank' | 'wallet';
  providerName: string; // e.g., الكريمي، بنك التضامن، جوالي، فلوسك
  accountName: string;
  accountNumber: string;
}

export interface CompanySettings {
  name: string;
  logo?: string;
  phone: string;
  email: string;
  email2?: string;
  address: string;
  whatsapp: string;
  workingHours: string;
  isMaintenanceMode: boolean;
  mapLink: string;
  socialLinks: SocialLink[];
  paymentAccounts: PaymentAccount[];
}

interface SettingsState {
  settings: CompanySettings;
  initialize: () => void;
  updateSettings: (settings: Partial<CompanySettings>) => Promise<void>;
}

const defaultSettings: CompanySettings = {
  name: 'جاري التحميل...',
  logo: '',
  phone: '',
  email: '',
  email2: '',
  address: '',
  whatsapp: '',
  workingHours: '',
  isMaintenanceMode: false,
  mapLink: '',
  socialLinks: [],
  paymentAccounts: []
};

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: defaultSettings,
  
  initialize: () => {
    const settingsRef = doc(db, 'config', 'settings');
    onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        set({ settings: docSnap.data() as CompanySettings });
      } else {
        // We do not overwrite with defaults automatically to prevent data loss
        // if offline. It just stays empty until admin saves.
      }
    });
  },

  updateSettings: async (newSettings) => {
    try {
      const settingsRef = doc(db, 'config', 'settings');
      await updateDoc(settingsRef, newSettings);
    } catch (error) {
      console.error("Error updating settings: ", error);
      throw error;
    }
  }
}));
