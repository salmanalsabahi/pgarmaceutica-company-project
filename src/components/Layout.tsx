import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { FloatingContact } from './FloatingContact';
import { MobileNav } from './MobileNav';
import { WifiOff } from 'lucide-react';

export const Layout: React.FC = () => {
  const [showOfflineMessage, setShowOfflineMessage] = useState(!navigator.onLine);
  const [offlineMessage, setOfflineMessage] = useState('الرجاء الاتصال بالانترنت لتحديث البيانات');

  useEffect(() => {
    let timer: number;
    if (showOfflineMessage && !navigator.onLine) {
      timer = window.setTimeout(() => setShowOfflineMessage(false), 4000);
    }
    return () => clearTimeout(timer);
  }, [showOfflineMessage]);

  useEffect(() => {
    const handleOnline = () => setShowOfflineMessage(false);
    const handleOffline = () => {
      setOfflineMessage('الرجاء الاتصال بالانترنت لتحديث البيانات');
      setShowOfflineMessage(true);
    };
    
    const handleTrigger = (e: Event) => {
      if (!navigator.onLine) {
        const customEvent = e as CustomEvent;
        if (customEvent.detail?.message) {
          setOfflineMessage(customEvent.detail.message);
        } else {
          setOfflineMessage('الرجاء الاتصال بالانترنت لتحديث البيانات');
        }
        setShowOfflineMessage(false); // trigger re-render to reset animation
        setTimeout(() => setShowOfflineMessage(true), 10);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('trigger-offline-message', handleTrigger);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('trigger-offline-message', handleTrigger);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans text-text bg-bg">
      {(showOfflineMessage && !navigator.onLine) && (
        <div className="bg-danger text-white py-3 px-5 shadow-2xl rounded-2xl flex items-center justify-center gap-2 fixed bottom-[90px] md:bottom-[110px] left-4 right-4 md:left-auto md:right-6 z-[200] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <WifiOff className="w-5 h-5 shrink-0" />
          <span className="font-bold text-sm">{offlineMessage}</span>
        </div>
      )}
      <Header />
      <main className="flex-grow pb-16 md:pb-0 relative">
        <Outlet />
      </main>
      <Footer />
      <FloatingContact />
      <MobileNav />
    </div>
  );
};
