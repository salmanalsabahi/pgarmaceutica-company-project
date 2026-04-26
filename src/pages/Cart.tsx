import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useNotificationStore } from '../store/useNotificationStore';

export const Cart: React.FC = () => {
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    getTotalYer, 
    getTotalUsd,
    getFinalTotalYer,
    getFinalTotalUsd,
    promoCode,
    discount,
    applyPromoCode,
    removePromoCode
  } = useCartStore();
  
  const { addToast } = useNotificationStore();
  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState('');

  const handleApplyPromo = () => {
    if (!promoInput.trim()) return;
    
    const success = applyPromoCode(promoInput);
    if (success) {
      addToast('تم تطبيق كود الخصم بنجاح', 'success');
      setPromoInput('');
    } else {
      addToast('كود الخصم غير صالح', 'error');
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-bg min-h-screen py-16">
        <div className="container mx-auto px-4 text-center max-w-md">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
            <ShoppingBag className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold mb-4">سلة المشتريات فارغة</h2>
          <p className="text-text-muted mb-8">لم تقم بإضافة أي منتجات إلى سلة المشتريات بعد. تصفح منتجاتنا وأضف ما تحتاجه.</p>
          <Link to="/products" className="bg-primary hover:bg-primary-light text-white font-bold py-3 px-8 rounded-lg transition-colors inline-block w-full">
            تصفح المنتجات
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-text mb-8">سلة المشتريات</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-border font-bold text-sm text-text-muted">
                <div className="col-span-6">المنتج</div>
                <div className="col-span-2 text-center">السعر</div>
                <div className="col-span-2 text-center">الكمية</div>
                <div className="col-span-2 text-left">الإجمالي</div>
              </div>

              <div className="divide-y divide-border">
                {items.map((item) => (
                  <div key={item.product.id} className="p-4 flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
                    {/* Product Info */}
                    <div className="col-span-6 flex items-center gap-4 w-full">
                      <div className="w-20 h-20 bg-gray-50 rounded-lg p-2 shrink-0">
                        <img src={item.product.image} alt={item.product.nameAr} className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div>
                        <Link to={`/product/${item.product.id}`} className="font-bold text-text hover:text-primary transition-colors line-clamp-1">
                          {item.product.nameAr}
                        </Link>
                        <p className="text-xs text-text-muted mb-1" dir="ltr">{item.product.nameEn}</p>
                        <p className="text-xs text-text-muted">الوحدة: {item.product.unit}</p>
                      </div>
                    </div>

                    {/* Price (Mobile & Desktop) */}
                    <div className="col-span-2 text-center w-full md:w-auto flex justify-between md:block">
                      <span className="md:hidden text-text-muted text-sm">السعر:</span>
                      <div>
                        <div className="font-bold">{item.product.price_yer.toLocaleString()} ريال</div>
                        <div className="text-xs text-text-muted">${item.product.price_usd.toFixed(2)}</div>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="col-span-2 flex justify-center w-full md:w-auto mt-2 md:mt-0">
                      <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-white shadow-sm" dir="ltr">
                        <button 
                          className="w-12 h-10 flex items-center justify-center bg-gray-100 text-gray-800 font-bold hover:bg-gray-200 hover:text-primary transition-colors border-r border-gray-300 active:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => updateQuantity(item.product.id, Math.max(item.product.minOrder, item.quantity - 1))}
                          disabled={item.quantity <= item.product.minOrder}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input
                          type="number"
                          min={item.product.minOrder}
                          value={item.quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val) && val >= item.product.minOrder) {
                              updateQuantity(item.product.id, val);
                            }
                          }}
                          className="w-14 text-center font-bold text-sm h-10 bg-white focus:outline-none focus:ring-inset focus:ring-2 focus:ring-primary appearance-none m-0"
                          style={{ MozAppearance: 'textfield' }}
                        />
                        <button 
                          className="w-12 h-10 flex items-center justify-center bg-gray-100 text-gray-800 font-bold hover:bg-gray-200 hover:text-primary transition-colors border-l border-gray-300 active:bg-gray-300"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Total & Remove */}
                    <div className="col-span-2 flex items-center justify-between md:justify-end w-full md:w-auto gap-4">
                      <span className="md:hidden text-text-muted text-sm">الإجمالي:</span>
                      <div className="text-left">
                        <div className="font-bold text-primary">{(item.product.price_yer * item.quantity).toLocaleString()} ريال</div>
                        <div className="text-xs text-text-muted">${(item.product.price_usd * item.quantity).toFixed(2)}</div>
                      </div>
                      <button 
                        onClick={() => removeItem(item.product.id)}
                        className="text-text-muted hover:text-danger transition-colors p-2"
                        title="حذف المنتج"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6">
              <Link to="/products" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
                <ArrowRight className="w-4 h-4" />
                متابعة التسوق
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl border border-border p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6 pb-4 border-b border-border">ملخص الطلب</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-text-muted">
                  <span>المجموع الفرعي</span>
                  <span className="font-medium text-text">{getTotalYer().toLocaleString()} ريال</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>الخصم ({discount * 100}%)</span>
                    <span className="font-medium">-{(getTotalYer() * discount).toLocaleString()} ريال</span>
                  </div>
                )}
                
                <div className="flex justify-between text-text-muted">
                  <span>تكلفة الشحن</span>
                  <span className="text-sm">تحدد في خطوة الدفع</span>
                </div>
              </div>

              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between items-end mb-1">
                  <span className="font-bold text-lg">الإجمالي</span>
                  <span className="font-bold text-2xl text-primary">{getFinalTotalYer().toLocaleString()} ريال</span>
                </div>
                <div className="text-left text-sm text-text-muted">
                  المعادل: ${getFinalTotalUsd().toFixed(2)}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-text mb-2">رمز الخصم (إن وجد)</label>
                {promoCode ? (
                  <div className="flex items-center justify-between bg-success/10 border border-success/20 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-2 text-success font-medium">
                      <Tag className="w-4 h-4" />
                      <span dir="ltr">{promoCode}</span>
                    </div>
                    <button onClick={removePromoCode} className="text-success hover:text-danger text-sm">
                      إزالة
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                      placeholder="أدخل الرمز (مثال: SHIFA10)"
                      dir="ltr"
                    />
                    <button 
                      onClick={handleApplyPromo}
                      className="bg-gray-100 hover:bg-gray-200 text-text font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                      تطبيق
                    </button>
                  </div>
                )}
              </div>

              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-primary hover:bg-primary-light text-white font-bold py-3 px-4 rounded-lg transition-colors text-lg"
              >
                إتمام الطلب
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
