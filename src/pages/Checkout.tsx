import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, CreditCard, Truck, MapPin, Upload, Tag } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useOrderStore, Order } from '../store/useOrderStore';
import { useUserStore } from '../store/useUserStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { useSettingsStore } from '../store/useSettingsStore';

const governorates = [
  "صنعاء", "عدن", "تعز", "الحديدة", "إب", "حضرموت", "ذمار", "حجة", 
  "عمران", "صعدة", "البيضاء", "لحج", "أبين", "شبوة", "المهرة", 
  "الضالع", "الجوف", "مأرب", "المحويت", "ريمة", "سقطرى"
];

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
        resolve(dataUrl);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const Checkout: React.FC = () => {
  const { items, getFinalTotalYer, getFinalTotalUsd, clearCart, promoCode, discount, applyPromoCode, removePromoCode, getTotalYer } = useCartStore();
  const { addOrder } = useOrderStore();
  const { user, users, addUserNotification } = useUserStore();
  const { addToast } = useNotificationStore();
  const { settings } = useSettingsStore();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [orderId, setOrderId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [promoInput, setPromoInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (items.length === 0 && step !== 3) {
    navigate('/cart');
    return null;
  }

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!navigator.onLine) {
      window.dispatchEvent(new CustomEvent('trigger-offline-message', { detail: { message: 'الرجاء الاتصال بالانترنت لكي تتم العملية' } }));
      return;
    }
    if (step < 3) setStep((s) => (s + 1) as 1 | 2 | 3);
  };

  const handleApplyPromo = () => {
    if (!promoInput.trim()) return;
    const success = applyPromoCode(promoInput.trim());
    if (success) {
      addToast('تم تطبيق كود الخصم بنجاح', 'success');
      setPromoInput('');
    } else {
      addToast('كود الخصم غير صالح أو منتهي الصلاحية', 'error');
    }
  };

  const handleComplete = async () => {
    if (!navigator.onLine) {
      window.dispatchEvent(new CustomEvent('trigger-offline-message', { detail: { message: 'الرجاء الاتصال بالانترنت لكي تتم العملية' } }));
      return;
    }
    if (!user) {
      addToast('يجب تسجيل الدخول لإتمام الطلب', 'error');
      navigate('/auth');
      return;
    }

    if ((paymentMethod === 'تحويل بنكي' || paymentMethod === 'محفظة إلكترونية') && !receiptFile) {
      addToast('يجب إرفاق صورة سند التحويل لإتمام الطلب', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      let receiptUrl = '';
      if (receiptFile) {
        try {
          receiptUrl = await compressImage(receiptFile);
        } catch (err) {
          console.error("Error compressing image:", err);
          addToast('حدث خطأ أثناء معالجة الصورة', 'error');
          setIsSubmitting(false);
          return;
        }
      }

      const newOrderId = `ORD-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      setOrderId(newOrderId);

      const newOrder: any = {
        id: newOrderId,
        userId: user.id,
        date: new Date().toISOString().split('T')[0],
        items: [...items],
        totalYer: getFinalTotalYer(),
        totalUsd: getFinalTotalUsd(),
        status: 'جديد',
        shippingInfo,
        paymentMethod,
      };

      if (receiptUrl) newOrder.receiptUrl = receiptUrl;
      if (promoCode) newOrder.promoCode = promoCode;
      if (discount) newOrder.discountPercentage = discount * 100;

      await addOrder(newOrder as Order);
      
      // Notify System Admins
      const admins = users.filter(u => u.role === 'admin' || u.email === 'salmanalsabahi775@gmail.com');
      const notificationMsg = `طلب جديد برقم ${newOrderId} من ${shippingInfo.name}`;
      for (const admin of admins) {
        await addUserNotification(admin.id, notificationMsg);
      }

      // Send Email Notification to Customer
      if (user?.email) {
        const { sendEmailNotification } = useNotificationStore.getState();
        const html = `
          <div dir="rtl" style="font-family: Arial, sans-serif;">
            <h2>شكراً لطلبك من شركة الشفاء للأدوية!</h2>
            <p>مرحباً ${shippingInfo.name}،</p>
            <p>لقد استلمنا طلبك رقم <strong>${newOrderId}</strong> وهو الآن قيد المراجعة.</p>
            <p><strong>الإجمالي:</strong> ${getFinalTotalYer().toLocaleString()} ريال يمني</p>
            <br/>
            <p>سنتواصل معك قريباً لتنفيذ الطلب.</p>
          </div>
        `;
        await sendEmailNotification(user.email, `تأكيد طلب رقم ${newOrderId}`, html);
      }

      clearCart();
      addToast('تم استلام طلبك بنجاح!', 'success');
      setStep(3);
    } catch (error) {
      console.error("Error completing order:", error);
      addToast('حدث خطأ أثناء إتمام الطلب', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const bankAccounts = settings.paymentAccounts?.filter(acc => acc.type === 'bank') || [];
  const walletAccounts = settings.paymentAccounts?.filter(acc => acc.type === 'wallet') || [];

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
                  <div className="flex-1">
                    <h3 className="font-bold text-text">تحويل بنكي / صرافة</h3>
                    <p className="text-sm text-text-muted mt-1">قم بتحويل المبلغ إلى أحد حساباتنا البنكية وأرفق صورة السند.</p>
                    
                    {paymentMethod === 'تحويل بنكي' && bankAccounts.length > 0 && (
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {bankAccounts.map(acc => (
                          <div key={acc.id} className="bg-white p-3 rounded border border-border text-sm">
                            <div className="font-bold text-primary">{acc.providerName}</div>
                            <div>الاسم: {acc.accountName}</div>
                            <div dir="ltr" className="text-right font-mono mt-1">{acc.accountNumber}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </label>

                <label className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'محفظة إلكترونية' ? 'border-primary bg-primary/5' : 'border-border hover:bg-gray-50'}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="محفظة إلكترونية"
                    checked={paymentMethod === 'محفظة إلكترونية'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 w-4 h-4 text-primary focus:ring-primary" 
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-text">محفظة إلكترونية</h3>
                    <p className="text-sm text-text-muted mt-1">جوالي، فلوسك، جيب، وغيرها. قم بالتحويل وأرفق صورة السند.</p>
                    
                    {paymentMethod === 'محفظة إلكترونية' && walletAccounts.length > 0 && (
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {walletAccounts.map(acc => (
                          <div key={acc.id} className="bg-white p-3 rounded border border-border text-sm">
                            <div className="font-bold text-primary">{acc.providerName}</div>
                            <div>الاسم: {acc.accountName}</div>
                            <div dir="ltr" className="text-right font-mono mt-1">{acc.accountNumber}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </label>
                
                <label className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'الدفع عند الاستلام' ? 'border-primary bg-primary/5' : 'border-border hover:bg-gray-50'}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="الدفع عند الاستلام"
                    checked={paymentMethod === 'الدفع عند الاستلام'}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value);
                      setReceiptFile(null); // Clear receipt if switching to COD
                    }}
                    className="mt-1 w-4 h-4 text-primary focus:ring-primary" 
                  />
                  <div>
                    <h3 className="font-bold text-text">الدفع عند الاستلام</h3>
                    <p className="text-sm text-text-muted mt-1">متاح فقط لمدينة صنعاء حالياً.</p>
                  </div>
                </label>
              </div>

              {(paymentMethod === 'تحويل بنكي' || paymentMethod === 'محفظة إلكترونية') && (
                <div className="mb-8 bg-blue-50 p-6 rounded-lg border border-blue-100">
                  <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    إرفاق صورة سند التحويل (إجباري)
                  </h3>
                  <div className="flex items-center gap-4">
                    <input 
                      type="file" 
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white border border-blue-300 text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      اختر صورة السند
                    </button>
                    <span className="text-sm text-blue-800">
                      {receiptFile ? receiptFile.name : 'لم يتم اختيار ملف'}
                    </span>
                  </div>
                </div>
              )}

              {/* Promo Code Section */}
              <div className="mb-8 border-t border-border pt-6">
                <h3 className="font-bold text-text mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-primary" />
                  كود الخصم
                </h3>
                {promoCode ? (
                  <div className="flex items-center justify-between bg-success/10 text-success p-4 rounded-lg border border-success/20">
                    <div>
                      <span className="font-bold">تم تطبيق كود الخصم: </span>
                      <span className="font-mono" dir="ltr">{promoCode}</span>
                      <span className="mr-2 text-sm">({discount * 100}%)</span>
                    </div>
                    <button onClick={removePromoCode} className="text-danger hover:underline text-sm font-bold">
                      إزالة
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="أدخل كود الخصم هنا"
                      className="flex-1 border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                    />
                    <button 
                      type="button"
                      onClick={handleApplyPromo}
                      className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-lg font-bold transition-colors"
                    >
                      تطبيق
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-6 rounded-lg mb-8 space-y-3">
                <div className="flex justify-between items-center text-text-muted">
                  <span>المجموع الفرعي:</span>
                  <span>{getTotalYer().toLocaleString()} ريال</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between items-center text-success font-bold">
                    <span>الخصم ({discount * 100}%):</span>
                    <span>-{(getTotalYer() * discount).toLocaleString()} ريال</span>
                  </div>
                )}
                <div className="flex justify-between items-center font-bold text-xl pt-3 border-t border-gray-200">
                  <span>إجمالي المبلغ المطلوب:</span>
                  <span className="text-primary">{getFinalTotalYer().toLocaleString()} ريال</span>
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(1)} disabled={isSubmitting} className="text-text-muted hover:text-text font-medium py-3 px-6 transition-colors disabled:opacity-50">
                  رجوع
                </button>
                <button 
                  onClick={handleComplete} 
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary-light text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      جاري المعالجة...
                    </>
                  ) : (
                    'تأكيد الطلب'
                  )}
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
