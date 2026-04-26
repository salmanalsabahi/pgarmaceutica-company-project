import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Building2, ChevronLeft, Search, X } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';

export const Manufacturers: React.FC = () => {
  const { manufacturers, products } = useProductStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const filteredManufacturers = useMemo(() => {
    if (!searchQuery.trim()) return manufacturers;
    const q = searchQuery.toLowerCase();
    return manufacturers.filter(m => m.toLowerCase().includes(q));
  }, [manufacturers, searchQuery]);

  return (
    <div className="bg-bg min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
          <div className="text-right md:text-right flex-1">
            <h1 className="text-4xl font-bold text-text mb-4">الشركات المصنعة</h1>
            <p className="text-text-muted text-lg max-w-2xl">
              نتعاون مع أفضل الشركات العالمية والمحلية لتوفير منتجات طبية عالية الجودة
            </p>
          </div>

          <div ref={searchRef} className="relative flex items-center justify-end h-12 w-full md:w-auto">
            {isSearchOpen ? (
              <div className="animate-fade-in origin-left flex items-center bg-white border border-border rounded-lg shadow-sm overflow-hidden w-full md:w-80 text-sm h-full">
                <input
                  type="text"
                  placeholder="ابحث عن شركة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 focus:outline-none h-full"
                  autoFocus
                />
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchOpen(false);
                  }}
                  className="px-4 text-text-muted hover:text-danger bg-gray-50 border-r border-border transition-colors h-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="w-12 h-12 rounded-full bg-white border border-border flex items-center justify-center text-text-muted hover:text-primary hover:border-primary transition-all shadow-sm"
                aria-label="بحث"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {filteredManufacturers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredManufacturers.map((manufacturer) => {
            const productCount = products.filter(p => p.brand === manufacturer).length;
            
            return (
              <Link 
                key={manufacturer} 
                to={`/products?brand=${encodeURIComponent(manufacturer)}`}
                className="bg-white rounded-xl border border-border p-6 hover:shadow-lg transition-all group flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Building2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-text mb-2">{manufacturer}</h3>
                <p className="text-text-muted text-sm mb-4">{productCount} منتج</p>
                <span className="text-primary font-medium text-sm flex items-center gap-1 mt-auto">
                  عرض المنتجات <ChevronLeft className="w-4 h-4" />
                </span>
              </Link>
            );
          })}
        </div>
        ) : (
          <div className="bg-white rounded-xl border border-border p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">لا توجد شركات</h3>
            <p className="text-text-muted">لم يتم العثور على شركات تطابق بحثك.</p>
          </div>
        )}
      </div>
    </div>
  );
};
