import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Package, Heart, User, Key, LogOut, ChevronLeft, Bell } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { useOrderStore } from '../store/useOrderStore';

export const UserDashboard: React.FC = () => {
  const { user, logout, updateUser, markNotificationsAsRead } = useUserStore();
  const { addToast } = useNotificationStore();
  const { orders } = useOrderStore();
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'profile' | 'notifications'>('orders');

  const userOrders = orders.filter(o => o.userId === user?.id);

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    businessType: user?.businessType || ''
  });

  if (!user) {
    return <Navigate to="/auth" />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'تم التسليم': return 'bg-success/10 text-success';
      case 'تم الشحن': return 'bg-blue-100 text-blue-700';
      case 'قيد المعالجة': return 'bg-accent/20 text-yellow-700';
      case 'جديد': return 'bg-primary/10 text-primary';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!navigator.onLine) {
      window.dispatchEvent(new CustomEvent('trigger-offline-message', { detail: { message: 'الرجاء الاتصال بالانترنت لتحديث البيانات' } }));
      return;
    }
    updateUser(user.id, profileForm);
    addToast('تم تحديث البيانات بنجاح', 'success');
  };

  const handleTabChange = (tab: 'orders' | 'wishlist' | 'profile' | 'notifications') => {
    setActiveTab(tab);
    if (tab === 'notifications') {
      markNotificationsAsRead(user.id);
    }
  };

  return (
    <div className="bg-bg min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="md:w-1/4">
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <div className="p-6 border-b border-border text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                  <User className="w-10 h-10" />
                </div>
                <h2 className="font-bold text-lg">{user.name}</h2>
                <p className="text-sm text-text-muted">{user.businessType}</p>
              </div>
              <nav className="p-4 space-y-2">
                <button 
                  onClick={() => handleTabChange('orders')}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-primary text-white' : 'hover:bg-gray-50 text-text'}`}
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5" />
                    <span className="font-medium">طلباتي</span>
                  </div>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleTabChange('notifications')}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${activeTab === 'notifications' ? 'bg-primary text-white' : 'hover:bg-gray-50 text-text'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Bell className="w-5 h-5" />
                      {user.notifications?.some(n => !n.read) && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-danger rounded-full border border-white"></span>
                      )}
                    </div>
                    <span className="font-medium">الإشعارات</span>
                  </div>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleTabChange('wishlist')}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${activeTab === 'wishlist' ? 'bg-primary text-white' : 'hover:bg-gray-50 text-text'}`}
                >
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5" />
                    <span className="font-medium">قائمة الرغبات</span>
                  </div>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleTabChange('profile')}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-primary text-white' : 'hover:bg-gray-50 text-text'}`}
                >
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5" />
                    <span className="font-medium">بياناتي</span>
                  </div>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={logout}
                  className="w-full flex items-center gap-3 p-3 rounded-lg text-danger hover:bg-danger/5 transition-colors mt-4"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">تسجيل الخروج</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Content */}
          <main className="md:w-3/4">
            <div className="bg-white rounded-xl border border-border p-6 md:p-8 min-h-[500px]">
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">سجل الطلبات</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-right">
                      <thead>
                        <tr className="border-b border-border text-text-muted text-sm">
                          <th className="pb-4 font-medium">رقم الطلب</th>
                          <th className="pb-4 font-medium">التاريخ</th>
                          <th className="pb-4 font-medium">عدد المنتجات</th>
                          <th className="pb-4 font-medium">الإجمالي</th>
                          <th className="pb-4 font-medium">الحالة</th>
                          <th className="pb-4 font-medium"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {userOrders.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-12 text-center text-text-muted">
                              <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                              <p>لا توجد طلبات سابقة لديك.</p>
                            </td>
                          </tr>
                        ) : (
                          userOrders.map(order => (
                          <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-4 font-medium" dir="ltr">{order.id}</td>
                            <td className="py-4 text-text-muted">{order.date}</td>
                            <td className="py-4">{order.items.reduce((acc, item) => acc + item.quantity, 0)}</td>
                            <td className="py-4 font-bold text-primary">{order.totalYer.toLocaleString()} ريال</td>
                            <td className="py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="py-4 text-left">
                              <button className="text-primary hover:underline text-sm font-medium">التفاصيل</button>
                            </td>
                          </tr>
                        )))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">الإشعارات</h2>
                  {user.notifications && user.notifications.length > 0 ? (
                    <div className="space-y-4">
                      {user.notifications.map(notif => (
                        <div key={notif.id} className="bg-gray-50 rounded-xl p-4 border border-border flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <Bell className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-text font-medium mb-1">{notif.message}</p>
                            <span className="text-sm text-text-muted">{notif.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">لا توجد إشعارات</h3>
                      <p className="text-text-muted">لم تتلقَ أي إشعارات حتى الآن.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">قائمة الرغبات فارغة</h3>
                  <p className="text-text-muted">لم تقم بإضافة أي منتجات إلى قائمة الرغبات بعد.</p>
                </div>
              )}

              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">البيانات الشخصية</h2>
                  <form onSubmit={handleProfileUpdate} className="max-w-xl space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">الاسم الكامل / اسم المنشأة</label>
                      <input 
                        type="text" 
                        required
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                        className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">البريد الإلكتروني</label>
                      <input 
                        type="email" 
                        required
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                        dir="ltr" 
                        className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary text-right" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">نوع المنشأة</label>
                      <select 
                        value={profileForm.businessType}
                        onChange={(e) => setProfileForm({...profileForm, businessType: e.target.value})}
                        className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                      >
                        <option value="صيدلية">صيدلية</option>
                        <option value="مستشفى">مستشفى</option>
                        <option value="عيادة">عيادة / مركز طبي</option>
                        <option value="موزع">موزع جملة</option>
                      </select>
                    </div>
                    <button type="submit" className="bg-primary hover:bg-primary-light text-white font-bold py-2 px-8 rounded-lg transition-colors">
                      حفظ التعديلات
                    </button>
                  </form>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
