import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { LogIn, Mail } from 'lucide-react';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { loginWithGoogle, loginWithEmail, registerWithEmail, user } = useUserStore();
  const { addToast } = useNotificationStore();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [businessType, setBusinessType] = useState('');

  const handleGoogleLogin = async () => {
    if (!navigator.onLine) {
      addToast('عفواً، لا يمكن التحقق من بيانات الدخول بدون اتصال بالإنترنت.', 'error');
      return;
    }
    setIsLoading(true);
    try {
      await loginWithGoogle();
      addToast('تم تسجيل الدخول بنجاح', 'success');
      navigate('/dashboard');
    } catch (error) {
      addToast('حدث خطأ أثناء تسجيل الدخول', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!navigator.onLine) {
      addToast('عفواً، لا يمكن التحقق من بيانات الدخول أو إنشاء حساب بدون اتصال بالإنترنت. يرجى الاتصال ثم المحاولة مجدداً.', 'error');
      return;
    }
    setIsLoading(true);
    try {
      if (isLogin) {
        await loginWithEmail(email, password);
        addToast('تم تسجيل الدخول بنجاح', 'success');
        navigate('/dashboard');
      } else {
        await registerWithEmail(email, password, name, businessType);
        addToast('تم إنشاء الحساب بنجاح', 'success');
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/email-already-in-use') {
        addToast('البريد الإلكتروني مسجل مسبقاً', 'error');
      } else if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        addToast('البريد الإلكتروني أو كلمة المرور غير صحيحة', 'error');
      } else if (error.code === 'auth/weak-password') {
        addToast('كلمة المرور ضعيفة جداً، يجب أن تكون 6 أحرف على الأقل', 'error');
      } else {
        addToast('حدث خطأ أثناء العملية، تأكد من صحة البيانات', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      addToast('الرجاء إدخال البريد الإلكتروني أولاً ثم الضغط على "نسيت كلمة المرور"', 'error');
      return;
    }
    setIsLoading(true);
    try {
      const { forgotPassword } = useUserStore.getState();
      await forgotPassword(email);
      addToast('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني', 'success');
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/user-not-found') {
         addToast('البريد الإلكتروني غير مسجل بعد', 'error');
      } else {
         addToast('حدث خطأ أثناء الإرسال. تأكد من صحة البريد الإلكتروني.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // If user is already logged in, redirect
  React.useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

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
                minLength={6}
              />
            </div>

            {isLogin && (
              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="text-primary focus:ring-primary rounded" />
                  <span className="text-text-muted">تذكرني</span>
                </label>
                <button type="button" onClick={handleForgotPassword} className="text-primary hover:underline">نسيت كلمة المرور؟</button>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-light text-white font-bold py-3 rounded-lg transition-colors mt-6 flex items-center justify-center gap-2"
            >
              {isLoading ? 'جاري المعالجة...' : (isLogin ? 'دخول' : 'إنشاء حساب جديد')}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-border relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm text-text-muted">
              أو
            </div>
            <button 
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-white border border-border hover:bg-gray-50 text-text font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-3 shadow-sm"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
              المتابعة باستخدام حساب جوجل
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
