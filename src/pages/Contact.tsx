import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { useNotificationStore } from '../store/useNotificationStore';

export const Contact: React.FC = () => {
  const { addToast } = useNotificationStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending message
    setTimeout(() => {
      addToast('تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.', 'success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    }, 1000);
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
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">العنوان</h3>
                <p className="text-text-muted leading-relaxed">
                  المركز الرئيسي: شارع الزبيري،<br />
                  صنعاء، الجمهورية اليمنية
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">الهاتف</h3>
                <p className="text-text-muted" dir="ltr">+967 1 XXXXXXX</p>
                <p className="text-text-muted" dir="ltr">+967 7X XXX XXXX</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">البريد الإلكتروني</h3>
                <p className="text-text-muted">info@alshifa-pharma.com</p>
                <p className="text-text-muted">support@alshifa-pharma.com</p>
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

              <button type="submit" className="bg-primary hover:bg-primary-light text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center gap-2">
                <Send className="w-5 h-5" />
                <span>إرسال الرسالة</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
