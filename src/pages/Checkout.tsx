import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, CreditCard, Truck, MapPin } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useOrderStore, Order } from '../store/useOrderStore';
import { useUserStore } from '../store/useUserStore';
import { useNotificationStore } from '../store/useNotificationStore';

const governorates = [
  "صنعاء", "عدن", "تعز", "الحديدة", "إب", "حضرموت", "ذمار", "حجة", 
  "عمران", "صعدة", "البيضاء", "لحج", "أبين", "شبوة", "المهرة", 
  "الضالع", "الجوف", "مأرب", "المحويت", "ريمة", "سقطرى"
];

export const Checkout: React.FC = () => {
  const { items, getFinalTotalYer, getFinalTotalUsd, clearCart } = useCartStore();
  const { addOrder } = useOrderStore();
  const { user } = useUserStore();
  const { addToast } = useNotificationStore();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [orderId, setOrderId] = useState('');
  
  // Form state
  const [shippingInfo, setShippingInfo] = useState({
    name: user?.name || '',
    business: user?.businessType || '',
    phone: '',
    governorate: '',
    district: '',
    address: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('تحويل بنكي');

  if (items.length === 0 && step !== 3) {
    navigate('/cart');
    return null;
  }

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) setStep((s) => (s + 1) as 1 | 2 | 3);
  };

  const handleComplete = () => {
    if (!user) {
      addToast('يجب تسجيل الدخول لإتمام الطلب', 'error');
      navigate('/auth');
      return;
    }

    const newOrderId = `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    setOrderId(newOrderId);

    const newOrder: Order = {
      id: newOrderId,
      userId: user.id,
      date: new Date().toISOString().split('T')[0],
      items: [...items],
      totalYer: getFinalTotalYer(),
      totalUsd: getFinalTotalUsd(),
      status: 'جديد',
      shippingInfo,
      paymentMethod
    };

    addOrder(newOrder);
    clearCart();
    addToast('تم استلام طلبك بنجاح!', 'success');
    setStep(3);
  };

  return (
    <div className="bg-bg min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-text mb-8 text-center">إتمام الطلب</h1>

        {/* Progress Bar */}
        <div className="flex items-center justify-center mb-12">
          <div className={`flex flex-col items-center ${step >= 1 ? 'text-primary' : 'text-text-muted'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
              <MapPin className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">بيانات الشحن</span>
          </div>
          <div className={`w-24 h-1 mx-2 rounded ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
          <div className={`flex flex-col items-center ${step >= 2 ? 'text-primary' : 'text-text-muted'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">طريقة الدفع</span>
          </div>
          <div className={`w-24 h-1 mx-2 rounded ${step >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>
          <div className={`flex flex-col items-center ${step >= 3 ? 'text-primary' : 'text-text-muted'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">تأكيد الطلب</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border p-6 md:p-8 shadow-sm">
          {step === 1 && (
            <form onSubmit={handleNext}>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                معلومات التوصيل
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">الاسم الكامل</label>
                  <input 
                    required 
                    type="text" 
                    value={shippingInfo.name}
                    onChange={(e) => setShippingInfo({...shippingInfo, name: e.target.value})}
                    className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-2">اسم الصيدلية / المستشفى (اختياري)</label>
                  <input 
                    type="text" 
                    value={shippingInfo.business}
                    onChange={(e) => setShippingInfo({...shippingInfo, business: e.target.value})}
                    className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-2">رقم الهاتف</label>
                  <input 
                    required 
                    type="tel" 
                    dir="ltr" 
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                    className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary text-right" 
                    placeholder="7X XXX XXXX" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-2">المحافظة</label>
                  <select 
                    required 
                    value={shippingInfo.governorate}
                    onChange={(e) => setShippingInfo({...shippingInfo, governorate: e.target.value})}
                    className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                  >
                    <option value="">اختر المحافظة</option>
                    {governorates.map(gov => <option key={gov} value={gov}>{gov}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-2">المديرية</label>
                  <input 
                    required 
                    type="text" 
                    value={shippingInfo.district}
                    onChange={(e) => setShippingInfo({...shippingInfo, district: e.target.value})}
                    className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text mb-2">العنوان التفصيلي</label>
                  <textarea 
                    required 
                    rows={3} 
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                    className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="submit" className="bg-primary hover:bg-primary-light text-white font-bold py-3 px-8 rounded-lg transition-colors">
                  المتابعة للدفع
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                اختر طريقة الدفع
              </h2>

              <div className="space-y-4 mb-8">
                <label className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'تحويل بنكي' ? 'border-primary bg-primary/5' : 'border-border hover:bg-gray-50'}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="تحويل بنكي"
                    checked={paymentMethod === 'تحويل بنكي'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 w-4 h-4 text-primary focus:ring-primary" 
                  />
                  <div>
                    <h3 className="font-bold text-text">تحويل بنكي / صرافة</h3>
                    <p className="text-sm text-text-muted mt-1">الكريمي، النجم، الامتياز، أو أي شبكة صرافة محلية. سيتم تزويدك ببيانات الحساب بعد تأكيد الطلب.</p>
                  </div>
                </label>
                
                <label className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'الدفع عند الاستلام' ? 'border-primary bg-primary/5' : 'border-border hover:bg-gray-50'}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="الدفع عند الاستلام"
                    checked={paymentMethod === 'الدفع عند الاستلام'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 w-4 h-4 text-primary focus:ring-primary" 
                  />
                  <div>
                    <h3 className="font-bold text-text">الدفع عند الاستلام</h3>
                    <p className="text-sm text-text-muted mt-1">متاح فقط لمدينة صنعاء حالياً.</p>
                  </div>
                </label>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-8">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>إجمالي المبلغ المطلوب:</span>
                  <span className="text-primary">{getFinalTotalYer().toLocaleString()} ريال</span>
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(1)} className="text-text-muted hover:text-text font-medium py-3 px-6 transition-colors">
                  رجوع
                </button>
                <button onClick={handleComplete} className="bg-primary hover:bg-primary-light text-white font-bold py-3 px-8 rounded-lg transition-colors">
                  تأكيد الطلب
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6 text-success">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-bold text-text mb-4">تم استلام طلبك بنجاح!</h2>
              <p className="text-lg text-text-muted mb-2">رقم الطلب: <span className="font-bold text-text" dir="ltr">{orderId}</span></p>
              <p className="text-text-muted mb-8">سيتم التواصل معك قريباً لتأكيد تفاصيل الشحن والدفع.</p>
              
              <div className="flex justify-center gap-4">
                <button onClick={() => navigate('/dashboard')} className="bg-primary hover:bg-primary-light text-white font-bold py-3 px-8 rounded-lg transition-colors">
                  متابعة الطلب
                </button>
                <button onClick={() => navigate('/products')} className="bg-gray-100 hover:bg-gray-200 text-text font-bold py-3 px-8 rounded-lg transition-colors">
                  العودة للتسوق
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
