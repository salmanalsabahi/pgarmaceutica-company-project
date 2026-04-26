import React, { useState } from 'react';
import { Phone, MessageCircle, Mail, X, Plus } from 'lucide-react';
import { useSettingsStore } from '../store/useSettingsStore';

export const FloatingContact: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { settings } = useSettingsStore();
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  return (
    <div ref={menuRef} className="fixed bottom-[84px] md:bottom-8 left-2 md:left-6 z-[60] flex flex-col items-center gap-3">
      {/* Expanded Menu */}
      <div className={`flex flex-col gap-3 transition-all duration-300 origin-bottom ${isOpen ? 'scale-100 opacity-100 mb-2' : 'scale-0 opacity-0 h-0 overflow-hidden'}`}>
        <a 
          href={`tel:${settings.phone}`} 
          className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all hover:scale-110 group relative"
        >
          <Phone className="w-4 h-4 md:w-5 md:h-5" />
          <span className="absolute left-12 md:left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            اتصل بنا
          </span>
        </a>
        
        <a 
          href={`https://wa.me/${(settings.whatsapp || '').replace(/\D/g, '')}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-10 h-10 md:w-12 md:h-12 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-all hover:scale-110 group relative"
        >
          <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
          <span className="absolute left-12 md:left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            واتساب
          </span>
        </a>

        <a 
          href={`mailto:${settings.email}`} 
          className="w-10 h-10 md:w-12 md:h-12 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-all hover:scale-110 group relative"
        >
          <Mail className="w-4 h-4 md:w-5 md:h-5" />
          <span className="absolute left-12 md:left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            بريد إلكتروني
          </span>
        </a>
      </div>

      {/* Main Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 relative group ${
          isOpen ? 'bg-gray-800 text-white rotate-45' : 'bg-primary text-white hover:bg-primary-light hover:scale-110'
        }`}
      >
        {/* Decorative Ring */}
        {!isOpen && (
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
        )}
        
        {isOpen ? (
          <X className="w-5 h-5 md:w-7 md:h-7" />
        ) : (
          <div className="relative">
            <Plus className="w-5 h-5 md:w-8 md:h-8 stroke-[3px]" />
          </div>
        )}
      </button>
    </div>
  );
};
