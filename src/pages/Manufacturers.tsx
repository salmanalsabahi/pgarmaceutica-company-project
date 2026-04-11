import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ChevronLeft } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';

export const Manufacturers: React.FC = () => {
  const { manufacturers, products } = useProductStore();

  return (
    <div className="bg-bg min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-text mb-4">الشركات المصنعة</h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            نتعاون مع أفضل الشركات العالمية والمحلية لتوفير منتجات طبية عالية الجودة
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {manufacturers.map((manufacturer) => {
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
      </div>
    </div>
  );
};
