/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Auth } from './pages/Auth';
import { UserDashboard } from './pages/UserDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Services } from './pages/Services';
import { Terms } from './pages/Terms';
import { Articles } from './pages/Articles';
import { Booking } from './pages/Booking';
import { Maintenance } from './pages/Maintenance';
import { Manufacturers } from './pages/Manufacturers';
import { ProductTypes } from './pages/ProductTypes';
import { ToastContainer } from './components/Toast';
import { InstallPrompt } from './components/InstallPrompt';
import { useProductStore } from './store/useProductStore';
import { useOrderStore } from './store/useOrderStore';
import { usePromoStore } from './store/usePromoStore';
import { useSettingsStore } from './store/useSettingsStore';
import { useBookingStore } from './store/useBookingStore';
import { useUserStore } from './store/useUserStore';
import { useNotificationStore } from './store/useNotificationStore';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

export default function App() {
  const { initialize: initProducts } = useProductStore();
  const { initialize: initOrders } = useOrderStore();
  const { initialize: initPromos } = usePromoStore();
  const { initialize: initSettings } = useSettingsStore();
  const { initialize: initBookings } = useBookingStore();
  const { user } = useUserStore();
  const { settings } = useSettingsStore();
  const { addToast } = useNotificationStore();

  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    initProducts();
    initOrders();
    initPromos();
    initSettings();
  }, [initProducts, initOrders, initPromos, initSettings]);

  useEffect(() => {
    initBookings(user?.id, user?.role === 'admin');
  }, [user, initBookings]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      addToast('عاد الاتصال بالإنترنت. تتم مزامنة البيانات الآن.', 'success');
    };
    const handleOffline = () => {
      setIsOffline(true);
      addToast('أنت غير متصل بالإنترنت. يمكنك الاستمرار في العمل، وسيتم حفظ بياناتك ومزامنتها لاحقاً.', 'error');
    };

    const handleCustomOfflineMessage = (e: any) => {
      addToast(e.detail?.message || 'عفواً، لا يتوفر اتصال بالإنترنت.', 'error');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('trigger-offline-message', handleCustomOfflineMessage);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('trigger-offline-message', handleCustomOfflineMessage);
    };
  }, [addToast]);

  // Maintenance mode bypass for admin or auth pages
  const isAdmin = user?.role === 'admin';
  const isAuthPage = window.location.pathname === '/auth';
  const isAdminPage = window.location.pathname.startsWith('/admin');
  const showMaintenance = settings?.isMaintenanceMode && !isAdmin && !isAuthPage && !isAdminPage;

  if (showMaintenance) {
    return <Maintenance />;
  }


  return (
    <BrowserRouter>
      <ScrollToTop />
      <ToastContainer />
      <InstallPrompt />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Catalog />} />
          <Route path="product/:id" element={<ProductDetail />} />
          <Route path="manufacturers" element={<Manufacturers />} />
          <Route path="types" element={<ProductTypes />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="auth" element={<Auth />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="services" element={<Services />} />
          <Route path="terms" element={<Terms />} />
          <Route path="articles" element={<Articles />} />
          <Route path="booking" element={<Booking />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
