import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, ShieldCheck, Truck, ArrowRight, Plus, Minus, Star } from 'lucide-react';
import { useProductStore } from '../store/useProductStore';
import { useCartStore } from '../store/useCartStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { useUserStore } from '../store/useUserStore';
import { ProductCard } from '../components/ProductCard';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, rateProduct } = useProductStore();
  const product = products.find(p => p.id === id);
  const navigate = useNavigate();
  
  const [quantity, setQuantity] = useState(product?.minOrder || 1);
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const addItem = useCartStore(state => state.addItem);
  const { addToast } = useNotificationStore();
  const { user, toggleWishlist } = useUserStore();

  useEffect(() => {
    if (product) {
      setQuantity(product.minOrder);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">المنتجة غير موجود</h2>
        <Link to="/products" className="text-primary hover:underline">العودة لقائمة المنتجات</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      addToast('يجب تسجيل الدخول أولاً لإضافة المنتجات إلى السلة', 'error');
      navigate('/auth');
      return;
    }
    addItem(product, quantity);
    addToast(`تم إضافة ${quantity} من ${product.nameAr} إلى السلة`, 'success');
  };

  const handleToggleWishlist = () => {
    if (!user) {
      addToast('يجب تسجيل الدخول لإضافة المنتجات للمفضلة', 'error');
      navigate('/auth');
      return;
    }
    toggleWishlist(product.id);
    const isWishlisted = user.wishlist?.includes(product.id);
    if (isWishlisted) {
      addToast('تم إزالة المنتج من المفضلة', 'info');
    } else {
      addToast('تم إضافة المنتج للمفضلة', 'success');
    }
  };

  const handleRateProduct = (rating: number) => {
    if (!user) {
      addToast('يجب تسجيل الدخول لتقييم المنتج', 'error');
      navigate('/auth');
      return;
    }
    rateProduct(product.id, rating);
    setUserRating(rating);
    addToast('تم إرسال تقييمك بنجاح', 'success');
  };

  const isWishlisted = user?.wishlist?.includes(product.id) || false;

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="bg-bg min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="flex text-sm text-text-muted mb-8">
          <Link to="/" className="hover:text-primary">الرئيسية</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-primary">المنتجات</Link>
          <span className="mx-2">/</span>
          <Link to={`/products?category=${product.category}`} className="hover:text-primary">{product.category}</Link>
          <span className="mx-2">/</span>
          <span className="text-text font-medium">{product.nameAr}</span>
        </nav>

        <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="bg-gray-50 rounded-xl p-8 flex items-center justify-center relative">
              <img 
                src={product.image} 
                alt={product.nameAr} 
                className="max-w-full max-h-[400px] object-contain mix-blend-multiply"
              />
              {!product.inStock && (
                <div className="absolute top-4 right-4 bg-danger text-white font-bold px-4 py-2 rounded-lg">
                  نفذت الكمية
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-2 flex items-center gap-2">
                <span className="bg-primary-light/10 text-primary px-3 py-1 rounded-full text-sm font-bold">
                  {product.brand}
                </span>
                <span className="text-text-muted text-sm border-r border-border pr-2">
                  رقم التسجيل: <span dir="ltr">{product.registrationNo}</span>
                </span>
              </div>
              
              <h1 className="text-3xl font-bold text-text mb-2">{product.nameAr}</h1>
              <p className="text-xl text-text-muted mb-4" dir="ltr">{product.nameEn}</p>
              
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-5 h-5 ${star <= Math.round(product.rating || 0) ? 'fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="text-sm text-text-muted">
                  ({product.reviewsCount || 0} تقييم)
                </span>
              </div>
              
              <div className="mb-8">
                <div className="text-4xl font-bold text-primary mb-1">
                  {product.price_yer.toLocaleString()} <span className="text-lg font-normal text-text-muted">ريال يمني</span>
                </div>
                <div className="text-lg text-text-muted">
                  المعادل: ${product.price_usd.toFixed(2)}
                </div>
              </div>

              <p className="text-text leading-relaxed mb-8">
                {product.description}
              </p>

              <div className="bg-gray-50 p-4 rounded-xl border border-border mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium">الكمية المطلوبة:</span>
                  <span className="text-sm text-text-muted">الحد الأدنى: {product.minOrder} {product.unit}</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border rounded-lg bg-white h-12 overflow-hidden">
                    <button 
                      className="px-4 text-text hover:text-primary transition-colors h-full bg-gray-50 border-l border-border"
                      onClick={() => setQuantity(Math.max(product.minOrder, quantity - 1))}
                      disabled={quantity <= product.minOrder}
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <input 
                      type="number"
                      min={product.minOrder}
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val) && val >= product.minOrder) {
                          setQuantity(val);
                        }
                      }}
                      className="w-16 text-center font-bold text-lg h-full focus:outline-none appearance-none"
                    />
                    <button 
                      className="px-4 text-text hover:text-primary transition-colors h-full bg-gray-50 border-r border-border"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className={`flex-1 h-12 rounded-lg flex items-center justify-center gap-2 font-bold text-lg transition-colors ${
                      product.inStock 
                        ? 'bg-primary hover:bg-primary-light text-white' 
                        : 'bg-gray-200 text-text-muted cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>إضافة للسلة</span>
                  </button>
                  
                  <button 
                    onClick={handleToggleWishlist}
                    className={`h-12 px-4 rounded-lg border flex items-center justify-center gap-2 transition-colors bg-white font-bold ${
                      isWishlisted 
                        ? 'text-danger border-danger hover:bg-danger/5' 
                        : 'border-border text-text-muted hover:text-danger hover:border-danger'
                    }`}
                  >
                    <Heart className="w-5 h-5" fill={isWishlisted ? 'currentColor' : 'none'} />
                    <span className="hidden sm:inline">{isWishlisted ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}</span>
                  </button>
                </div>
              </div>

              {/* Trust Features */}
              <div className="grid grid-cols-2 gap-4 mt-auto">
                <div className="flex items-center gap-3 text-sm text-text">
                  <ShieldCheck className="w-5 h-5 text-success" />
                  <span>منتج أصلي ومضمون</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-text">
                  <Truck className="w-5 h-5 text-primary" />
                  <span>توصيل لجميع المحافظات</span>
                </div>
              </div>
            </div>
          </div>

          {/* Specifications Table */}
          <div className="border-t border-border">
            <div className="p-8">
              <h3 className="text-xl font-bold mb-6">المواصفات الطبية</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-text-muted">الاسم العلمي</span>
                  <span className="font-medium" dir="ltr">{product.specs.scientificName}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-text-muted">الشركة المصنعة</span>
                  <span className="font-medium" dir="ltr">{product.specs.manufacturer}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-text-muted">بلد المنشأ</span>
                  <span className="font-medium">{product.specs.origin}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-text-muted">الشكل الدوائي</span>
                  <span className="font-medium">{product.specs.dosageForm}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-text-muted">التركيز</span>
                  <span className="font-medium" dir="ltr">{product.specs.concentration}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-text-muted">العبوة</span>
                  <span className="font-medium">{product.specs.packaging}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rating Section */}
          <div className="border-t border-border bg-gray-50">
            <div className="p-8">
              <h3 className="text-xl font-bold mb-4">تقييم المنتج</h3>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <span className="text-text-muted font-medium">ما هو تقييمك لهذا المنتج؟</span>
                <div className="flex items-center gap-1 bg-white px-4 py-2 rounded-xl border border-border shadow-sm">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRateProduct(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="p-1 focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star 
                        className={`w-8 h-8 ${
                          star <= (hoveredRating || userRating) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
                {userRating > 0 && (
                  <span className="text-success text-sm font-bold bg-success/10 px-3 py-1 rounded-full">
                    شكراً لتقييمك!
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-bold text-text">منتجات ذات صلة</h2>
              <Link to={`/products?category=${product.category}`} className="flex items-center gap-2 text-primary hover:text-primary-light font-medium">
                عرض المزيد <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
