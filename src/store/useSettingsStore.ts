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
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  socialLinks: SocialLink[];
  paymentAccounts: PaymentAccount[];
}

interface SettingsState {
  settings: CompanySettings;
  initialize: () => void;
  updateSettings: (settings: Partial<CompanySettings>) => Promise<void>;
}

const defaultSettings: CompanySettings = {
  name: 'شركة الشفاء لتوزيع الأدوية',
  phone: '+967 1 234 567',
  email: 'info@alshifa-pharma.com',
  address: 'المركز الرئيسي: شارع الزبيري، صنعاء، الجمهورية اليمنية',
  whatsapp: '+967700000000',
  socialLinks: [
    { id: '1', platform: 'Facebook', url: '#' },
    { id: '2', platform: 'Twitter', url: '#' },
    { id: '3', platform: 'Instagram', url: '#' },
    { id: '4', platform: 'LinkedIn', url: '#' }
  ],
  paymentAccounts: [
    { id: '1', type: 'bank', providerName: 'بنك الكريمي', accountName: 'شركة الشفاء', accountNumber: '123456789' },
    { id: '2', type: 'wallet', providerName: 'جوالي', accountName: 'شركة الشفاء', accountNumber: '777000000' }
  ]
};

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: defaultSettings,
  
  initialize: () => {
    const settingsRef = doc(db, 'config', 'settings');
    onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        set({ settings: docSnap.data() as CompanySettings });
      } else {
        // Initialize with default settings if not exists
        setDoc(settingsRef, defaultSettings);
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
