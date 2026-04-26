import React, { useState } from 'react';
import { Calendar, Clock, Building2, User, Phone, CheckCircle } from 'lucide-react';
import { useNotificationStore } from '../store/useNotificationStore';
import { useUserStore } from '../store/useUserStore';
import { useBookingStore } from '../store/useBookingStore';

export const Booking: React.FC = () => {
  const { addToast } = useNotificationStore();
  const { user } = useUserStore();
  const { addBooking } = useBookingStore();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    facilityName: user?.businessType || '',
    phone: '',
    serviceType: 'توزيع أدوية',
    date: '',
    time: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!navigator.onLine) {
      window.dispatchEvent(new CustomEvent('trigger-offline-message', { detail: { message: 'الرجاء الاتصال بالانترنت لكي تتم عملية الاستشارة' } }));
      return;
    }
    setIsSubmitting(true);
    try {
      await addBooking({
        id: `booking-${Date.now()}`,
        userId: user?.id || '',
        name: formData.name,
        facilityName: formData.facilityName,
        phone: formData.phone,
        serviceType: formData.serviceType,
        date: formData.date,
        time: formData.time,
        notes: formData.notes,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      setIsSubmitted(true);
      addToast('تم تأكيد حجزك بنجاح. سنتواصل معك قريباً.', 'success');
    } catch (error) {
      addToast('حدث خطأ أثناء إرسال طلب الحجز', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-bg min-h-screen py-20 flex items-center justify-center">
        <div className="bg-white p-12 rounded-3xl border border-border shadow-lg text-center max-w-lg mx-4">
          <div className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-bold text-text mb-4">تم تأكيد الحجز!</h2>
          <p className="text-text-muted leading-relaxed mb-8">
            شكراً لك {formData.name}. تم استلام طلب حجز الاستشارة الخاص بـ "{formData.facilityName}". سيقوم أحد ممثلينا بالتواصل معك لتأكيد الموعد النهائي.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-primary hover:bg-primary-light text-white font-bold py-3 px-8 rounded-xl transition-colors w-full"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text mb-4">احجز استشارة مجانية</h1>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            احجز موعداً مع خبرائنا لمناقشة احتياجات منشأتك الطبية من الأدوية والمستلزمات، أو لتجهيز عيادتك/صيدليتك الجديدة.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-border shadow-xl overflow-hidden flex flex-col md:flex-row">
          {/* Info Sidebar */}
          <div className="bg-primary text-white p-10 md:w-1/3 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-6">معلومات الحجز</h3>
              <p className="text-primary-light/90 mb-8 leading-relaxed">
                نقدم استشارات متخصصة لأصحاب الصيدليات والمراكز الطبية لضمان حصولهم على أفضل خطط التوريد والتجهيز.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-secondary shrink-0" />
                  <div>
                    <h4 className="font-bold mb-1">أوقات العمل</h4>
                    <p className="text-sm text-primary-light/80">السبت - الخميس<br/>8:00 صباحاً - 5:00 مساءً</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-secondary shrink-0" />
                  <div>
                    <h4 className="font-bold mb-1">للمساعدة العاجلة</h4>
                    <p className="text-sm text-primary-light/80" dir="ltr">+967 1 234 567</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="p-10 md:w-2/3">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text mb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" /> الاسم الكامل
                  </label>
                  <input 
                    required 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-gray-50" 
                    placeholder="الاسم الثلاثي"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-2 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" /> اسم المنشأة
                  </label>
                  <input 
                    required 
                    type="text" 
                    value={formData.facilityName}
                    onChange={(e) => setFormData({...formData, facilityName: e.target.value})}
                    className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-gray-50" 
                    placeholder="اسم الصيدلية / المستشفى"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-primary" /> رقم الهاتف
                  </label>
                  <input 
                    required 
                    type="tel" 
                    dir="ltr"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-gray-50 text-right" 
                    placeholder="+967 7X XXX XXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-2">نوع الخدمة المطلوبة</label>
                  <select 
                    value={formData.serviceType}
                    onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                    className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-gray-50"
                  >
                    <option value="توزيع أدوية">عقود توريد وتوزيع أدوية</option>
                    <option value="تجهيز صيدلية">تجهيز صيدلية جديدة</option>
                    <option value="تجهيز مستشفى">تجهيز مستشفى / مركز طبي</option>
                    <option value="أدوية تخصصية">طلب أدوية تخصصية/نادرة</option>
                    <option value="استشارة عامة">استشارة عامة</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" /> التاريخ المفضل
                  </label>
                  <input 
                    required 
                    type="date" 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-gray-50" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" /> الوقت المفضل
                  </label>
                  <input 
                    required 
                    type="time" 
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-gray-50" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">ملاحظات إضافية</label>
                <textarea 
                  rows={4} 
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-gray-50 resize-none"
                  placeholder="أخبرنا المزيد عن احتياجاتك..."
                ></textarea>
              </div>

              <button disabled={isSubmitting} type="submit" className="w-full bg-primary hover:bg-primary-light text-white font-bold py-4 px-8 rounded-xl transition-colors text-lg shadow-md shadow-primary/20">
                {isSubmitting ? 'جاري الإرسال...' : 'تأكيد الحجز'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
