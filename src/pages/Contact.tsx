import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, Loader2 } from 'lucide-react';
import { useNotificationStore } from '../store/useNotificationStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { useUserStore } from '../store/useUserStore';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const Contact: React.FC = () => {
  const { addToast } = useNotificationStore();
  const { settings } = useSettingsStore();
  const { users, addUserNotification } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!navigator.onLine) {
      window.dispatchEvent(new CustomEvent('trigger-offline-message', { detail: { message: 'الرجاء الاتصال بالانترنت لكي تتم العملية' } }));
      return;
    }
    setLoading(true);
    
    try {
      // 1. Save message to Firestore
      const messageData = {
        ...formData,
        date: new Date().toISOString(),
        createdAt: serverTimestamp(),
        read: false
      };
      
      const docRef = await addDoc(collection(db, 'messages'), messageData);
      
      // 2. Notify Admins
      const admins = users.filter(u => u.role === 'admin' || u.email === 'salmanalsabahi775@gmail.com');
      const notificationMsg = `رسالة جديدة من ${formData.name}: ${formData.subject}`;
      
      for (const admin of admins) {
        await addUserNotification(admin.id, notificationMsg);
      }

      addToast('تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.', 'success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error("Error sending message:", error);
      addToast('حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-bg min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-text mb-4">تواصل معنا</h1>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            نحن هنا لخدمتك. لا تتردد في التواصل معنا لأي استفسار أو طلب، وسيقوم فريقنا بالرد عليك في أقرب وقت ممكن.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
                <h3 className="font-bold text-lg mb-4">موقعنا على الخريطة</h3>
                <div className="aspect-video w-full overflow-hidden rounded-xl border border-border bg-gray-100 flex items-center justify-center">
                  {settings.mapLink ? (
                    <iframe 
                      src={settings.mapLink}
                      width="100%" 
                      height="100%" 
                      style={{border:0}} 
                      allowFullScreen 
                      loading="lazy" 
                      referrerPolicy="no-referrer"
                    ></iframe>
                  ) : (
                    <p className="text-text-muted text-sm text-center p-4">الخريطة غير متوفرة حالياً</p>
                  )}
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">العنوان</h3>
                <p className="text-text-muted leading-relaxed">
                  {settings.address || 'المركز الرئيسي: شارع الزبيري، صنعاء، الجمهورية اليمنية'}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">الهاتف</h3>
                {settings.phone && <p className="text-text-muted" dir="ltr">{settings.phone}</p>}
                {settings.whatsapp && <p className="text-text-muted" dir="ltr">واتساب: {settings.whatsapp}</p>}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">البريد الإلكتروني</h3>
                <p className="text-text-muted">{settings.email}</p>
                {settings.email2 && <p className="text-text-muted">{settings.email2}</p>}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-border shadow-sm">
            <h2 className="text-2xl font-bold mb-6">أرسل لنا رسالة</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">الاسم الكامل</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-2">رقم الهاتف</label>
                  <input 
                    required 
                    type="tel" 
                    dir="ltr"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary text-right" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">البريد الإلكتروني</label>
                  <input 
                    required 
                    type="email" 
                    dir="ltr"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary text-right" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-2">الموضوع</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">نص الرسالة</label>
                <textarea 
                  required 
                  rows={5} 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-primary resize-none"
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="bg-primary hover:bg-primary-light text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                <span>{loading ? 'جاري الإرسال...' : 'إرسال الرسالة'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
