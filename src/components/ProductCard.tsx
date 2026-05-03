import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Star } from 'lucide-react';
import { Product } from '../data/products';
import { useCartStore } from '../store/useCartStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { useUserStore } from '../store/useUserStore';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(product.minOrder);
  const addItem = useCartStore((state) => state.addItem);
  const { addToast } = useNotificationStore();
  const { user } = useUserStore();
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!navigator.onLine) {
      addToast('عفواً، لا يمكن إضافة منتجات إلى السلة بدون اتصال بالإنترنت.', 'error');
      return;
    }
    if (!user) {
      addToast('يجب تسجيل الدخول أولاً لإضافة المنتجات إلى السلة', 'error');
      navigate('/auth');
      return;
    }
    addItem(product, quantity);
    addToast(`تم إضافة ${quantity} من ${product.nameAr} إلى السلة`, 'success');
  };

  return (
    <Link to={`/product/${product.id}`} className="group bg-white rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 p-4">
        <img 
          src={product.image} 
          alt={product.nameAr} 
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
        />
        {!product.inStock && (
          <div className="absolute top-2 right-2 bg-danger text-white text-xs font-bold px-2 py-1 rounded">
            نفذت الكمية
          </div>
        )}
        <div className="absolute top-2 left-2 bg-primary-light/10 text-primary text-xs font-bold px-2 py-1 rounded">
          {product.brand}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs text-text-muted mb-1">{product.category}</div>
        <h3 className="font-bold text-lg mb-1 line-clamp-2" title={product.nameAr}>{product.nameAr}</h3>
        <p className="text-sm text-text-muted mb-2 line-clamp-1" dir="ltr">{product.nameEn}</p>
        
        <div className="flex items-center gap-1 mb-4">
          <div className="flex items-center text-yellow-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={`w-4 h-4 ${star <= Math.round(product.rating || 0) ? 'fill-current' : 'text-gray-300'}`} 
              />
            ))}
          </div>
          <span className="text-xs text-text-muted">
            ({product.reviewsCount || 0})
          </span>
        </div>
        
        <div className="mt-auto">
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="text-xl font-bold text-primary">{product.price_yer.toLocaleString()} <span className="text-sm font-normal">ريال</span></div>
              <div className="text-sm text-text-muted">${product.price_usd.toFixed(2)}</div>
            </div>
            <div className="text-xs text-text-muted text-left">
              الوحدة: {product.unit}
            </div>
          </div>

          {/* Add to Cart Controls */}
          {product.inStock ? (
            <div className="flex items-center gap-2" onClick={(e) => e.preventDefault()}>
              <div className="flex items-center border border-border rounded-lg bg-gray-50">
                <button 
                  className="p-2 text-text hover:text-primary transition-colors"
                  onClick={() => setQuantity(Math.max(product.minOrder, quantity - 1))}
                  disabled={quantity <= product.minOrder}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-medium text-sm">{quantity}</span>
                <button 
                  className="p-2 text-text hover:text-primary transition-colors"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-primary hover:bg-primary-light text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors font-medium text-sm"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>إضافة</span>
              </button>
            </div>
          ) : (
            <button disabled className="w-full bg-gray-200 text-text-muted py-2 px-4 rounded-lg font-medium text-sm cursor-not-allowed">
              غير متوفر حالياً
            </button>
          )}
          
          {product.inStock && (
            <div className="text-xs text-text-muted text-center mt-2">
              الحد الأدنى للطلب: {product.minOrder}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
