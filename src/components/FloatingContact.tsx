import React, { useState } from 'react';
import { Phone, MessageCircle, Mail, X, MessageSquare } from 'lucide-react';
import { useSettingsStore } from '../store/useSettingsStore';

export const FloatingContact: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { settings } = useSettingsStore();

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-center gap-4">
      {/* Expanded Menu */}
      <div className={`flex flex-col gap-3 transition-all duration-300 origin-bottom ${isOpen ? 'scale-100 opacity-100 mb-4' : 'scale-0 opacity-0 h-0 overflow-hidden'}`}>
        <a 
          href={`tel:${settings.phone}`} 
          className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors group relative"
        >
          <Phone className="w-5 h-5" />
          <span className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            اتصل بنا
          </span>
        </a>
        
        <a 
          href={`https://wa.me/${(settings.whatsapp || '').replace(/\D/g, '')}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors group relative"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            واتساب
          </span>
        </a>

        <a 
          href={`mailto:${settings.email}`} 
          className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors group relative"
        >
          <Mail className="w-5 h-5" />
          <span className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            بريد إلكتروني
          </span>
        </a>
      </div>

      {/* Main Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${isOpen ? 'bg-gray-800 text-white rotate-90' : 'bg-primary text-white hover:bg-primary-light hover:scale-110'}`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  );
};
