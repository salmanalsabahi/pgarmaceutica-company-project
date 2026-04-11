import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, LogOut, LayoutDashboard, Clock, Phone, Mail, ChevronDown, Globe, CalendarCheck, Tag, Bell } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useUserStore } from '../store/useUserStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { usePromoStore } from '../store/usePromoStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useProductStore } from '../store/useProductStore';

export const Header: React.FC = () => {
  const { items } = useCartStore();
  const { user, logout, markNotificationsAsRead } = useUserStore();
  const { addToast } = useNotificationStore();
  const { promos } = usePromoStore();
  const { settings } = useSettingsStore();
  const { products } = useProductStore();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const navigate = useNavigate();
  const searchRef = useRef<HTMLFormElement>(null);
  const mobileSearchRef = useRef<HTMLFormElement>(null);

  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const activePromos = promos.filter(p => p.isActive);
  const unreadNotificationsCount = user?.notifications?.filter(n => !n.read).length || 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchSuggestions = searchQuery.trim() === '' ? [] : products.filter(p => 
    p.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.specs.scientificName.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false);
      setShowSuggestions(false);
    }
  };

  const handleLanguageSwitch = () => {
    addToast('النسخة الإنجليزية قيد التطوير حالياً', 'info');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-border">
      {/* Promo Banner */}
      {activePromos.length > 0 && (
        <div className="bg-primary-light text-white py-2 text-sm text-center font-bold relative overflow-hidden">
          <div className="container mx-auto px-4 flex items-center justify-center gap-2 animate-pulse">
            <Tag className="w-4 h-4" />
            <span>عروض خاصة! استخدم كود الخصم:</span>
            <span className="bg-white text-primary-light px-2 py-0.5 rounded text-xs mx-1" dir="ltr">
              {activePromos[0].code}
            </span>
            <span>للحصول على خصم {activePromos[0].discountPercentage}%</span>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="bg-slate-900 text-white py-2 text-sm hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary-light" /> 
              العمل: السبت - الخميس 8 ص - 5 م
            </span>
            <span className="flex items-center gap-2" dir="ltr">
              <Phone className="w-4 h-4 text-primary-light" /> 
              {settings.phone}
            </span>
            <span className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary-light" /> 
              {settings.email}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {settings.socialLinks?.map(link => (
              link.url && link.url !== '#' && (
                <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="hover:text-primary-light transition-colors">
                  {link.platform}
                </a>
              )
            ))}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
              ش
            </div>
            <div>
              <h1 className="text-primary font-bold text-xl leading-tight">شركة الشفاء</h1>
              <p className="text-accent text-xs">لتوزيع الأدوية</p>
            </div>
          </Link>

          {/* Search Bar */}
          <form ref={searchRef} onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-xl relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="ابحث عن دواء، مادة فعالة، أو شركة مصنعة..."
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-gray-50"
            />
            <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary">
              <Search className="w-5 h-5" />
            </button>
            
            {/* Search Suggestions Dropdown */}
            {showSuggestions && searchQuery.trim() !== '' && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                {searchSuggestions.length > 0 ? (
                  <ul>
                    {searchSuggestions.map((product) => (
                      <li key={product.id} className="border-b border-border last:border-0">
                        <Link
                          to={`/product/${product.id}`}
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                          onClick={() => {
                            setShowSuggestions(false);
                            setSearchQuery('');
                          }}
                        >
                          <img src={product.image} alt={product.nameAr} className="w-10 h-10 object-contain rounded border border-border bg-white" />
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-text line-clamp-1">{product.nameAr}</h4>
                            <p className="text-xs text-text-muted line-clamp-1">{product.specs.scientificName}</p>
                          </div>
                          <div className="text-left">
                            <span className="text-sm font-bold text-primary block">{product.price_yer} ريال</span>
                          </div>
                        </Link>
                      </li>
                    ))}
                    <li>
                      <button 
                        type="submit"
                        className="w-full text-center p-3 text-sm font-bold text-primary hover:bg-primary/5 transition-colors"
                      >
                        عرض كل النتائج لـ "{searchQuery}"
                      </button>
                    </li>
                  </ul>
                ) : (
                  <div className="p-4 text-center text-text-muted text-sm">
                    لا توجد نتائج مطابقة لـ "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </form>

          {/* Actions */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Language Switcher */}
            <button onClick={handleLanguageSwitch} className="hidden md:flex items-center gap-1 text-text-muted hover:text-primary transition-colors text-sm font-medium">
              <Globe className="w-4 h-4" />
              English
            </button>

            <Link to="/cart" className="relative text-text hover:text-primary transition-colors p-2">
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-danger text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {user && (
              <div className="relative">
                <button 
                  onClick={() => {
                    setIsNotificationsOpen(!isNotificationsOpen);
                    if (!isNotificationsOpen && unreadNotificationsCount > 0) {
                      markNotificationsAsRead(user.id);
                    }
                  }}
                  className="relative text-text hover:text-primary transition-colors p-2"
                >
                  <Bell className="w-6 h-6" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-0 right-0 bg-danger text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>
                
                {isNotificationsOpen && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white shadow-xl rounded-xl border border-border z-50 overflow-hidden">
                    <div className="p-4 border-b border-border bg-gray-50">
                      <h3 className="font-bold text-text">الإشعارات</h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {user.notifications && user.notifications.length > 0 ? (
                        <div className="divide-y divide-border">
                          {user.notifications.map(notif => (
                            <div key={notif.id} className={`p-4 ${notif.read ? 'bg-white' : 'bg-primary/5'}`}>
                              <p className="text-sm text-text mb-1">{notif.message}</p>
                              <span className="text-xs text-text-muted">{notif.date}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center text-text-muted">
                          لا توجد إشعارات
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {user ? (
              <div className="hidden md:flex items-center gap-4">
                <Link
                  to={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="flex items-center gap-2 text-text hover:text-primary transition-colors"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span className="font-medium text-sm">لوحة التحكم</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-text-muted hover:text-danger transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium text-sm">خروج</span>
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="hidden md:flex items-center gap-2 text-text hover:text-primary transition-colors"
              >
                <User className="w-6 h-6" />
                <span className="font-medium text-sm">تسجيل الدخول</span>
              </Link>
            )}

            {/* Booking CTA */}
            <Link to="/booking" className="hidden md:flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-lg font-bold transition-colors text-sm shadow-sm">
              <CalendarCheck className="w-4 h-4" />
              حجز استشارة
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-text p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="hidden md:block border-t border-border bg-white">
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-8 py-3">
            <li>
              <Link to="/" className="text-text hover:text-primary font-bold transition-colors">الرئيسية</Link>
            </li>
            <li>
              <Link to="/products" className="text-text hover:text-primary font-bold transition-colors">المنتجات</Link>
            </li>
            <li>
              <Link to="/types" className="text-text hover:text-primary font-bold transition-colors">أنواع المنتجات</Link>
            </li>
            <li>
              <Link to="/manufacturers" className="text-text hover:text-primary font-bold transition-colors">الشركات المصنعة</Link>
            </li>
            
            {/* Services Dropdown */}
            <li className="relative group">
              <button className="flex items-center gap-1 text-text hover:text-primary font-bold transition-colors py-2">
                خدماتنا <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-full right-0 bg-white shadow-xl rounded-xl border border-border hidden group-hover:block w-56 py-2 z-50">
                <Link to="/services" className="block px-4 py-2 hover:bg-gray-50 text-text hover:text-primary transition-colors">توزيع الأدوية الشامل</Link>
                <Link to="/services" className="block px-4 py-2 hover:bg-gray-50 text-text hover:text-primary transition-colors">توفير الأدوية التخصصية</Link>
                <Link to="/services" className="block px-4 py-2 hover:bg-gray-50 text-text hover:text-primary transition-colors">تجهيز المستشفيات</Link>
                <Link to="/services" className="block px-4 py-2 hover:bg-gray-50 text-text hover:text-primary transition-colors">تجهيز الصيدليات</Link>
                <Link to="/services" className="block px-4 py-2 hover:bg-gray-50 text-text hover:text-primary transition-colors">عقود التوريد المستمرة</Link>
              </div>
            </li>

            <li>
              <Link to="/articles" className="text-text hover:text-primary font-bold transition-colors">المقالات</Link>
            </li>
            <li>
              <Link to="/about" className="text-text hover:text-primary font-bold transition-colors">عن الشركة</Link>
            </li>
            <li>
              <Link to="/contact" className="text-text hover:text-primary font-bold transition-colors">اتصل بنا</Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-border py-4 px-4 space-y-4 absolute w-full shadow-lg z-50">
          <form ref={mobileSearchRef} onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="ابحث..."
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary bg-gray-50"
            />
            <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary">
              <Search className="w-5 h-5" />
            </button>
            
            {/* Mobile Search Suggestions Dropdown */}
            {showSuggestions && searchQuery.trim() !== '' && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                {searchSuggestions.length > 0 ? (
                  <ul>
                    {searchSuggestions.map((product) => (
                      <li key={product.id} className="border-b border-border last:border-0">
                        <Link
                          to={`/product/${product.id}`}
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                          onClick={() => {
                            setShowSuggestions(false);
                            setSearchQuery('');
                            setIsMenuOpen(false);
                          }}
                        >
                          <img src={product.image} alt={product.nameAr} className="w-10 h-10 object-contain rounded border border-border bg-white" />
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-text line-clamp-1">{product.nameAr}</h4>
                            <p className="text-xs text-text-muted line-clamp-1">{product.specs.scientificName}</p>
                          </div>
                        </Link>
                      </li>
                    ))}
                    <li>
                      <button 
                        type="submit"
                        className="w-full text-center p-3 text-sm font-bold text-primary hover:bg-primary/5 transition-colors"
                      >
                        عرض كل النتائج
                      </button>
                    </li>
                  </ul>
                ) : (
                  <div className="p-4 text-center text-text-muted text-sm">
                    لا توجد نتائج
                  </div>
                )}
              </div>
            )}
          </form>
          <ul className="space-y-2 font-medium">
            <li><Link to="/" className="block py-2 text-text" onClick={() => setIsMenuOpen(false)}>الرئيسية</Link></li>
            <li><Link to="/products" className="block py-2 text-text" onClick={() => setIsMenuOpen(false)}>المنتجات</Link></li>
            <li><Link to="/types" className="block py-2 text-text" onClick={() => setIsMenuOpen(false)}>أنواع المنتجات</Link></li>
            <li><Link to="/manufacturers" className="block py-2 text-text" onClick={() => setIsMenuOpen(false)}>الشركات المصنعة</Link></li>
            <li><Link to="/services" className="block py-2 text-text" onClick={() => setIsMenuOpen(false)}>خدماتنا</Link></li>
            <li><Link to="/articles" className="block py-2 text-text" onClick={() => setIsMenuOpen(false)}>المقالات</Link></li>
            <li><Link to="/about" className="block py-2 text-text" onClick={() => setIsMenuOpen(false)}>عن الشركة</Link></li>
            <li><Link to="/contact" className="block py-2 text-text" onClick={() => setIsMenuOpen(false)}>اتصل بنا</Link></li>
            <li><Link to="/booking" className="block py-2 text-primary font-bold" onClick={() => setIsMenuOpen(false)}>حجز استشارة</Link></li>
            
            <li className="border-t border-border pt-2 mt-2">
              <button onClick={handleLanguageSwitch} className="flex items-center gap-2 py-2 text-text w-full">
                <Globe className="w-5 h-5" /> English
              </button>
            </li>

            {user ? (
              <>
                <li><Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="block py-2 text-text" onClick={() => setIsMenuOpen(false)}>لوحة التحكم</Link></li>
                <li><button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="block py-2 text-danger w-full text-right">تسجيل خروج</button></li>
              </>
            ) : (
              <li><Link to="/auth" className="block py-2 text-text" onClick={() => setIsMenuOpen(false)}>تسجيل الدخول</Link></li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};
