import React from 'react';
import { Settings, Lock, Mail, Phone, MessageCircle } from 'lucide-react';
import { useSettingsStore } from '../store/useSettingsStore';

export const Maintenance: React.FC = () => {
  const { settings } = useSettingsStore();

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-border overflow-hidden text-center p-8 md:p-12 relative">
        {/* Background Accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent/5 rounded-full blur-3xl"></div>
        
        <div className="relative">
          <div className="w-24 h-24 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-8 animate-pulse">
            <Settings className="w-12 h-12" />
          </div>
          
          <h1 className="text-3xl font-black text-text mb-4">الموقع في وضع الصيانة</h1>
          <p className="text-text-muted text-lg leading-relaxed mb-8">
            نحن نقوم حالياً ببعض التحديثات والتحسينات في {settings.name} لنقدم لكم تجربة أفضل. نعتذر عن أي إزعاج، سنعود قريباً جداً.
          </p>
          
          <div className="space-y-4 border-t border-border pt-8">
            <p className="text-sm font-bold text-text mb-4">يمكنكم التواصل معنا عبر:</p>
            <div className="flex flex-col gap-3">
              <a href={`tel:${settings.phone}`} className="flex items-center gap-3 justify-center text-text hover:text-primary transition-colors py-2 px-4 bg-gray-50 rounded-xl">
                <Phone className="w-5 h-5 text-primary" />
                <span dir="ltr">{settings.phone}</span>
              </a>
              <a href={`mailto:${settings.email}`} className="flex items-center gap-3 justify-center text-text hover:text-primary transition-colors py-2 px-4 bg-gray-50 rounded-xl">
                <Mail className="w-5 h-5 text-primary" />
                <span dir="ltr">{settings.email}</span>
              </a>
              <a href={`https://wa.me/${settings.whatsapp?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 justify-center text-white bg-[#25D366] hover:bg-[#128C7E] transition-colors py-3 px-4 rounded-xl shadow-lg font-bold">
                <MessageCircle className="w-5 h-5" />
                مراسلتنا عبر واتساب
              </a>
            </div>
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-2 text-xs text-text-muted">
            <Lock className="w-3 h-3" />
            <span>نظام الشفاء المطور</span>
          </div>
        </div>
      </div>
    </div>
  );
};
