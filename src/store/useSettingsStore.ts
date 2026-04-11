import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface CompanySettings {
  name: string;
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  socialLinks: SocialLink[];
}

interface SettingsState {
  settings: CompanySettings;
  updateSettings: (settings: Partial<CompanySettings>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: {
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
        ]
      },
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      }))
    }),
    { name: 'alshifa-settings' }
  )
);
