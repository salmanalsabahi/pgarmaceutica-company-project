import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, ShoppingCart, User } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useUserStore } from '../store/useUserStore';

export const MobileNav: React.FC = () => {
  const location = useLocation();
  const { items } = useCartStore();
  const { user } = useUserStore();
  
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const navItems = [
    { name: 'الرئيسية', path: '/', icon: Home },
    { name: 'الأقسام', path: '/products', icon: LayoutGrid },
    { name: 'السلة', path: '/cart', icon: ShoppingCart, count: cartItemCount },
    { 
      name: user?.role === 'admin' ? 'لوحة التحكم' : 'حسابي', 
      path: user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/auth', 
      icon: User 
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 ${
                isActive ? 'text-primary' : 'text-text-muted hover:text-primary'
              }`}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
                {item.count !== undefined && item.count > 0 && (
                  <span className="absolute -top-1 -right-2 bg-danger text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {item.count}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
