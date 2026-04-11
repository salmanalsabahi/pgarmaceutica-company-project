import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore, User } from '../store/useUserStore';
import { useNotificationStore } from '../store/useNotificationStore';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { login, registerUser, users } = useUserStore();
  const { addToast } = useNotificationStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [businessType, setBusinessType] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        login(user);
        addToast('تم تسجيل الدخول بنجاح', 'success');
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        addToast('البريد الإلكتروني أو كلمة المرور غير صحيحة', 'error');
      }
    } else {
      if (users.some(u => u.email === email)) {
        addToast('البريد الإلكتروني مسجل مسبقاً', 'error');
        return;
      }
      
      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        password,
        businessType,
        role: 'user',
        wishlist: []
      };
      
      registerUser(newUser);
      login(newUser);
      addToast('تم إنشاء الحساب بنجاح', 'success');
      navigate('/dashboard');
    }
  };

  const handleAdminLogin = () => {
    setEmail('admin@alshifa.com');
    setPassword('admin123');
  };

  return (
    <div className="bg-bg min-h-screen py-16 flex items-center justify-center">
      <div className="bg-white rounded-2xl border border-border shadow-lg w-full max-w-md overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-border">
          <button 
            type="button"
            className={`flex-1 py-4 text-center font-bold text-lg transition-colors ${isLogin ? 'bg-primary text-white' : 'text-text-muted hover:bg-gray-50'}`}
            onClick={() => setIsLogin(true)}
          >
            تسجيل الدخول
          </button>
          <button 
            type="button"
            className={`flex-1 py-4 text-center font-bold text-lg transition-colors ${!isLogin ? 'bg-primary text-white' : 'text-text-muted hover:bg-gray-50'}`}
            onClick={() => setIsLogin(false)}
          >
            إنشاء حساب
          </button>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-text mb-2">الاسم الكامل / اسم المنشأة</label>
                  <input 
                    required 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-2">نوع المنشأة</label>
                  <select 
                    required 
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                  >
                    <option value="">اختر نوع المنشأة</option>
                    <option value="صيدلية">صيدلية</option>
                    <option value="مستشفى">مستشفى</option>
                    <option value="عيادة">عيادة / مركز طبي</option>
                    <option value="موزع">موزع جملة</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-text mb-2">البريد الإلكتروني</label>
              <input 
                required 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary" 
                dir="ltr" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">كلمة المرور</label>
              <input 
                required 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary" 
                dir="ltr" 
              />
            </div>

            {isLogin && (
              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="text-primary focus:ring-primary rounded" />
                  <span className="text-text-muted">تذكرني</span>
                </label>
                <a href="#" className="text-primary hover:underline">نسيت كلمة المرور؟</a>
              </div>
            )}

            <button type="submit" className="w-full bg-primary hover:bg-primary-light text-white font-bold py-3 rounded-lg transition-colors mt-6">
              {isLogin ? 'دخول' : 'إنشاء حساب جديد'}
            </button>
          </form>

          {/* Demo Admin Login Button */}
          {isLogin && (
            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-text-muted mb-4">لأغراض التجربة فقط:</p>
              <button 
                type="button"
                onClick={handleAdminLogin}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 rounded-lg transition-colors text-sm"
              >
                تعبئة بيانات مدير النظام (Admin)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
