import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, Settings, Plus, Edit, Trash2, Check, X, LayoutDashboard, Tag, Image as ImageIcon, FolderTree } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { useProductStore } from '../store/useProductStore';
import { useOrderStore } from '../store/useOrderStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { usePromoStore, PromoCode } from '../store/usePromoStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { Product } from '../data/products';

export const AdminDashboard: React.FC = () => {
  const { user, users, updateUser, addUserNotification } = useUserStore();
  const { products, addProduct, updateProduct, deleteProduct, categories, addCategory, deleteCategory, updateCategory, productTypes, addProductType, updateProductType, deleteProductType, manufacturers, addManufacturer, updateManufacturer, deleteManufacturer } = useProductStore();
  const { orders, updateOrderStatus } = useOrderStore();
  const { promos, addPromo, updatePromo, deletePromo } = usePromoStore();
  const { addToast } = useNotificationStore();
  const { settings, updateSettings } = useSettingsStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'categories' | 'types' | 'manufacturers' | 'users' | 'promos' | 'settings'>('overview');

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const defaultProductForm: Partial<Product> = {
    nameAr: '',
    nameEn: '',
    description: '',
    price_yer: 0,
    price_usd: 0,
    category: categories[0] || '',
    brand: '',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400',
    inStock: true,
    stockQuantity: 100,
    minOrder: 1,
    unit: 'علبة',
    registrationNo: '',
    specs: {
      scientificName: '',
      manufacturer: '',
      origin: '',
      dosageForm: '',
      concentration: '',
      packaging: ''
    }
  };
  
  const [productForm, setProductForm] = useState<Partial<Product>>(defaultProductForm);

  // Promo Modal State
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);
  const defaultPromoForm: Partial<PromoCode> = {
    code: '',
    discountPercentage: 10,
    isActive: true
  };
  const [promoForm, setPromoForm] = useState<Partial<PromoCode>>(defaultPromoForm);

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{old: string, new: string} | null>(null);
  const [categoryForm, setCategoryForm] = useState('');

  // Product Type Modal State
  const [isProductTypeModalOpen, setIsProductTypeModalOpen] = useState(false);
  const [editingProductType, setEditingProductType] = useState<{old: string, new: string} | null>(null);
  const [productTypeForm, setProductTypeForm] = useState('');

  // Manufacturer Modal State
  const [isManufacturerModalOpen, setIsManufacturerModalOpen] = useState(false);
  const [editingManufacturer, setEditingManufacturer] = useState<{old: string, new: string} | null>(null);
  const [manufacturerForm, setManufacturerForm] = useState('');

  // Admin Settings State
  const [adminPasswordForm, setAdminPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [settingsForm, setSettingsForm] = useState(settings);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  // Calculate stats
  const totalSalesYer = orders.filter(o => o.status === 'تم التسليم').reduce((acc, o) => acc + o.totalYer, 0);
  const newOrdersCount = orders.filter(o => o.status === 'جديد').length;
  const totalCustomers = users.filter(u => u.role === 'user').length;

  const openAddModal = () => {
    setEditingProduct(null);
    setProductForm(defaultProductForm);
    setIsProductModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setProductForm(product);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      deleteProduct(id);
      addToast('تم حذف المنتج بنجاح', 'success');
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, productForm);
      addToast('تم تحديث المنتج بنجاح', 'success');
    } else {
      const newProduct = {
        ...productForm,
        id: `prod-${Date.now()}`
      } as Product;
      addProduct(newProduct);
      addToast('تم إضافة المنتج بنجاح', 'success');
    }
    setIsProductModalOpen(false);
  };

  const handleSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    addToast('تم حفظ الإعدادات بنجاح', 'success');
  };

  const handleAdminPasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasswordForm.currentPassword !== user.password) {
      addToast('كلمة المرور الحالية غير صحيحة', 'error');
      return;
    }
    if (adminPasswordForm.newPassword !== adminPasswordForm.confirmPassword) {
      addToast('كلمتا المرور غير متطابقتين', 'error');
      return;
    }
    if (adminPasswordForm.newPassword.length < 6) {
      addToast('كلمة المرور يجب أن تكون 6 أحرف على الأقل', 'error');
      return;
    }
    updateUser(user.id, { password: adminPasswordForm.newPassword });
    addToast('تم تحديث كلمة المرور بنجاح', 'success');
    setAdminPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const openAddPromoModal = () => {
    setEditingPromo(null);
    setPromoForm(defaultPromoForm);
    setIsPromoModalOpen(true);
  };

  const openEditPromoModal = (promo: PromoCode) => {
    setEditingPromo(promo);
    setPromoForm(promo);
    setIsPromoModalOpen(true);
  };

  const handleDeletePromo = (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا العرض؟')) {
      deletePromo(id);
      addToast('تم حذف العرض بنجاح', 'success');
    }
  };

  const handleSavePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPromo) {
      updatePromo(editingPromo.id, promoForm);
      addToast('تم تحديث العرض بنجاح', 'success');
    } else {
      const newPromo = {
        ...promoForm,
        id: `promo-${Date.now()}`
      } as PromoCode;
      addPromo(newPromo);
      addToast('تم إضافة العرض بنجاح', 'success');
    }
    setIsPromoModalOpen(false);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.trim()) return;
    
    if (editingCategory) {
      updateCategory(editingCategory.old, categoryForm.trim());
      addToast('تم تحديث القسم بنجاح', 'success');
    } else {
      if (categories.includes(categoryForm.trim())) {
        addToast('هذا القسم موجود مسبقاً', 'error');
        return;
      }
      addCategory(categoryForm.trim());
      addToast('تم إضافة القسم بنجاح', 'success');
    }
    setIsCategoryModalOpen(false);
  };

  const handleDeleteCategory = (category: string) => {
    if (window.confirm(`هل أنت متأكد من حذف قسم "${category}"؟ سيتم حذف جميع المنتجات المرتبطة به.`)) {
      deleteCategory(category);
      addToast('تم حذف القسم بنجاح', 'success');
    }
  };

  const handleSaveProductType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productTypeForm.trim()) return;
    
    if (editingProductType) {
      updateProductType(editingProductType.old, productTypeForm.trim());
      addToast('تم تحديث نوع المنتج بنجاح', 'success');
    } else {
      if (productTypes.includes(productTypeForm.trim())) {
        addToast('هذا النوع موجود مسبقاً', 'error');
        return;
      }
      addProductType(productTypeForm.trim());
      addToast('تم إضافة نوع المنتج بنجاح', 'success');
    }
    setIsProductTypeModalOpen(false);
  };

  const handleDeleteProductType = (type: string) => {
    if (window.confirm(`هل أنت متأكد من حذف نوع "${type}"؟ سيتم إزالة هذا النوع من المنتجات المرتبطة به.`)) {
      deleteProductType(type);
      addToast('تم حذف نوع المنتج بنجاح', 'success');
    }
  };

  const handleSaveManufacturer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manufacturerForm.trim()) return;
    
    if (editingManufacturer) {
      updateManufacturer(editingManufacturer.old, manufacturerForm.trim());
      addToast('تم تحديث الشركة المصنعة بنجاح', 'success');
    } else {
      if (manufacturers.includes(manufacturerForm.trim())) {
        addToast('هذه الشركة موجودة مسبقاً', 'error');
        return;
      }
      addManufacturer(manufacturerForm.trim());
      addToast('تم إضافة الشركة المصنعة بنجاح', 'success');
    }
    setIsManufacturerModalOpen(false);
  };

  const handleDeleteManufacturer = (manufacturer: string) => {
    if (window.confirm(`هل أنت متأكد من حذف شركة "${manufacturer}"؟ سيتم إزالة هذه الشركة من المنتجات المرتبطة بها.`)) {
      deleteManufacturer(manufacturer);
      addToast('تم حذف الشركة المصنعة بنجاح', 'success');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductForm({ ...productForm, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-text mb-2">نظرة عامة</h1>
          <p className="text-text-muted">مرحباً بك، {user.name}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <DollarSign className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-text-muted font-medium mb-1">إجمالي المبيعات</p>
            <h3 className="text-xl font-bold">{totalSalesYer.toLocaleString()} <span className="text-sm font-normal">ريال</span></h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-green-100 text-green-600 rounded-lg flex items-center justify-center shrink-0">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-text-muted font-medium mb-1">الطلبات الجديدة</p>
            <h3 className="text-2xl font-bold">{newOrdersCount}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center shrink-0">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-text-muted font-medium mb-1">إجمالي المنتجات</p>
            <h3 className="text-2xl font-bold">{products.length}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center shrink-0">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-text-muted font-medium mb-1">العملاء المسجلين</p>
            <h3 className="text-2xl font-bold">{totalCustomers}</h3>
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h2 className="text-xl font-bold text-danger flex items-center gap-2">
            <TrendingUp className="w-5 h-5 rotate-180" />
            تنبيهات المخزون (منتجات نفذت أو قاربت على النفاذ)
          </h2>
        </div>
        <div className="p-0">
          <div className="divide-y divide-border">
            {products.filter(p => !p.inStock || (p.stockQuantity !== undefined && p.stockQuantity <= 10)).length === 0 ? (
              <div className="p-6 text-center text-text-muted">جميع المنتجات متوفرة بكميات كافية.</div>
            ) : (
              products.filter(p => !p.inStock || (p.stockQuantity !== undefined && p.stockQuantity <= 10)).map(product => (
                <div key={product.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  <img src={product.image} alt={product.nameAr} className="w-12 h-12 rounded object-contain bg-gray-100" />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm line-clamp-1">{product.nameAr}</h4>
                    <p className="text-xs text-text-muted mb-1">{product.brand}</p>
                    {(!product.inStock || product.stockQuantity === 0) ? (
                      <span className="text-xs font-bold text-danger bg-danger/10 px-2 py-0.5 rounded">نفذت الكمية</span>
                    ) : (
                      <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded">
                        الكمية المتبقية: {product.stockQuantity}
                      </span>
                    )}
                  </div>
                  <button onClick={() => openEditModal(product)} className="text-primary text-sm font-bold hover:underline">
                    تحديث الكمية
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border">
        <h2 className="text-2xl font-bold text-text">إدارة الطلبات</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-gray-50">
            <tr className="text-text-muted text-sm">
              <th className="p-4 font-medium">رقم الطلب</th>
              <th className="p-4 font-medium">العميل</th>
              <th className="p-4 font-medium">التاريخ</th>
              <th className="p-4 font-medium">الإجمالي</th>
              <th className="p-4 font-medium">الحالة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-text-muted">لا توجد طلبات حالياً</td>
              </tr>
            ) : (
              orders.map(order => {
                const customer = users.find(u => u.id === order.userId);
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium" dir="ltr">{order.id}</td>
                    <td className="p-4">
                      <div className="font-bold">{customer?.name || 'عميل غير معروف'}</div>
                      <div className="text-xs text-text-muted">{customer?.businessType}</div>
                    </td>
                    <td className="p-4 text-text-muted">{order.date}</td>
                    <td className="p-4 font-bold">{order.totalYer.toLocaleString()} ريال</td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => {
                          const newStatus = e.target.value as any;
                          updateOrderStatus(order.id, newStatus);
                          addUserNotification(order.userId, `تم تحديث حالة طلبك رقم ${order.id} إلى: ${newStatus}`);
                          addToast(`تم تحديث حالة الطلب ${order.id} وإرسال إشعار للعميل`, 'success');
                        }}
                        className={`px-3 py-1.5 rounded-lg text-sm font-bold border-2 outline-none cursor-pointer ${
                          order.status === 'جديد' ? 'bg-primary/10 text-primary border-primary/20' :
                          order.status === 'قيد المعالجة' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                          order.status === 'تم الشحن' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                          order.status === 'مرفوض' ? 'bg-danger/10 text-danger border-danger/20' :
                          'bg-success/10 text-success border-success/20'
                        }`}
                      >
                        <option value="جديد">جديد</option>
                        <option value="قيد المعالجة">قيد المعالجة</option>
                        <option value="تم الشحن">تم الشحن</option>
                        <option value="تم التسليم">تم التسليم</option>
                        <option value="مرفوض">مرفوض</option>
                      </select>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border flex justify-between items-center">
        <h2 className="text-2xl font-bold text-text">إدارة المنتجات</h2>
        <button onClick={openAddModal} className="bg-primary hover:bg-primary-light text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
          <Plus className="w-5 h-5" />
          إضافة منتج
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-gray-50">
            <tr className="text-text-muted text-sm">
              <th className="p-4 font-medium">المنتج</th>
              <th className="p-4 font-medium">القسم</th>
              <th className="p-4 font-medium">السعر</th>
              <th className="p-4 font-medium">الحالة</th>
              <th className="p-4 font-medium text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <img src={product.image} alt={product.nameAr} className="w-10 h-10 rounded object-contain bg-gray-100" />
                  <div>
                    <div className="font-bold text-sm line-clamp-1">{product.nameAr}</div>
                    <div className="text-xs text-text-muted">{product.brand}</div>
                  </div>
                </td>
                <td className="p-4 text-sm">{product.category}</td>
                <td className="p-4 font-bold text-sm">{product.price_yer.toLocaleString()} ريال</td>
                <td className="p-4">
                  {product.inStock ? (
                    <span className="bg-success/10 text-success text-xs font-bold px-2 py-1 rounded">متوفر</span>
                  ) : (
                    <span className="bg-danger/10 text-danger text-xs font-bold px-2 py-1 rounded">نفذت الكمية</span>
                  )}
                </td>
                <td className="p-4 flex items-center justify-center gap-2">
                  <button onClick={() => openEditModal(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCategories = () => (
    <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border flex justify-between items-center">
        <h2 className="text-2xl font-bold text-text">إدارة الأقسام (الفئات)</h2>
        <button onClick={() => { setEditingCategory(null); setCategoryForm(''); setIsCategoryModalOpen(true); }} className="bg-primary hover:bg-primary-light text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
          <Plus className="w-5 h-5" />
          إضافة قسم
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-gray-50">
            <tr className="text-text-muted text-sm">
              <th className="p-4 font-medium">اسم القسم</th>
              <th className="p-4 font-medium">عدد المنتجات</th>
              <th className="p-4 font-medium text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.map(category => (
              <tr key={category} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-bold">{category}</td>
                <td className="p-4 text-text-muted">{products.filter(p => p.category === category).length} منتج</td>
                <td className="p-4 flex items-center justify-center gap-2">
                  <button onClick={() => { setEditingCategory({old: category, new: category}); setCategoryForm(category); setIsCategoryModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteCategory(category)} className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderProductTypes = () => (
    <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border flex justify-between items-center">
        <h2 className="text-2xl font-bold text-text">إدارة أنواع المنتجات</h2>
        <button onClick={() => { setEditingProductType(null); setProductTypeForm(''); setIsProductTypeModalOpen(true); }} className="bg-primary hover:bg-primary-light text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
          <Plus className="w-5 h-5" />
          إضافة نوع
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-gray-50">
            <tr className="text-text-muted text-sm">
              <th className="p-4 font-medium">اسم النوع</th>
              <th className="p-4 font-medium">عدد المنتجات</th>
              <th className="p-4 font-medium text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {productTypes.map(type => (
              <tr key={type} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-bold">{type}</td>
                <td className="p-4 text-text-muted">{products.filter(p => p.type === type).length} منتج</td>
                <td className="p-4 flex items-center justify-center gap-2">
                  <button onClick={() => { setEditingProductType({old: type, new: type}); setProductTypeForm(type); setIsProductTypeModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteProductType(type)} className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderManufacturers = () => (
    <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border flex justify-between items-center">
        <h2 className="text-2xl font-bold text-text">إدارة الشركات المصنعة</h2>
        <button onClick={() => { setEditingManufacturer(null); setManufacturerForm(''); setIsManufacturerModalOpen(true); }} className="bg-primary hover:bg-primary-light text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
          <Plus className="w-5 h-5" />
          إضافة شركة
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-gray-50">
            <tr className="text-text-muted text-sm">
              <th className="p-4 font-medium">اسم الشركة</th>
              <th className="p-4 font-medium">عدد المنتجات</th>
              <th className="p-4 font-medium text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {manufacturers.map(manufacturer => (
              <tr key={manufacturer} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-bold">{manufacturer}</td>
                <td className="p-4 text-text-muted">{products.filter(p => p.brand === manufacturer).length} منتج</td>
                <td className="p-4 flex items-center justify-center gap-2">
                  <button onClick={() => { setEditingManufacturer({old: manufacturer, new: manufacturer}); setManufacturerForm(manufacturer); setIsManufacturerModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteManufacturer(manufacturer)} className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border">
        <h2 className="text-2xl font-bold text-text">إدارة العملاء</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-gray-50">
            <tr className="text-text-muted text-sm">
              <th className="p-4 font-medium">الاسم / المنشأة</th>
              <th className="p-4 font-medium">البريد الإلكتروني</th>
              <th className="p-4 font-medium">النوع</th>
              <th className="p-4 font-medium">الدور</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-bold">{u.name}</td>
                <td className="p-4 text-text-muted" dir="ltr">{u.email}</td>
                <td className="p-4">
                  <span className="bg-gray-100 text-text text-xs font-bold px-2 py-1 rounded">
                    {u.businessType || 'غير محدد'}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${u.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'}`}>
                    {u.role === 'admin' ? 'مدير' : 'عميل'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPromos = () => (
    <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border flex justify-between items-center">
        <h2 className="text-2xl font-bold text-text">إدارة العروض والخصومات</h2>
        <button onClick={openAddPromoModal} className="bg-primary hover:bg-primary-light text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2">
          <Plus className="w-5 h-5" />
          إضافة عرض
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead className="bg-gray-50">
            <tr className="text-text-muted text-sm">
              <th className="p-4 font-medium">كود الخصم</th>
              <th className="p-4 font-medium">نسبة الخصم</th>
              <th className="p-4 font-medium">الحالة</th>
              <th className="p-4 font-medium text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {promos.map(promo => (
              <tr key={promo.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-bold" dir="ltr">{promo.code}</td>
                <td className="p-4 font-bold text-primary">{promo.discountPercentage}%</td>
                <td className="p-4">
                  {promo.isActive ? (
                    <span className="bg-success/10 text-success text-xs font-bold px-2 py-1 rounded">نشط</span>
                  ) : (
                    <span className="bg-danger/10 text-danger text-xs font-bold px-2 py-1 rounded">غير نشط</span>
                  )}
                </td>
                <td className="p-4 flex items-center justify-center gap-2">
                  <button onClick={() => openEditPromoModal(promo)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeletePromo(promo.id)} className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {promos.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-text-muted">لا توجد عروض حالياً</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-border shadow-sm p-6">
        <h2 className="text-2xl font-bold text-text mb-6">معلومات الشركة والتواصل</h2>
        <form onSubmit={handleSettingsSave} className="max-w-2xl space-y-6">
          <div>
            <label className="block text-sm font-medium text-text mb-2">اسم الشركة</label>
            <input type="text" value={settingsForm.name} onChange={e => setSettingsForm({...settingsForm, name: e.target.value})} className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text mb-2">رقم الهاتف</label>
              <input type="text" value={settingsForm.phone} onChange={e => setSettingsForm({...settingsForm, phone: e.target.value})} dir="ltr" className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary text-right" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-2">رقم الواتساب</label>
              <input type="text" value={settingsForm.whatsapp || ''} onChange={e => setSettingsForm({...settingsForm, whatsapp: e.target.value})} dir="ltr" className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary text-right" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text mb-2">البريد الإلكتروني</label>
              <input type="email" value={settingsForm.email} onChange={e => setSettingsForm({...settingsForm, email: e.target.value})} dir="ltr" className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary text-right" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-2">العنوان</label>
            <textarea rows={3} value={settingsForm.address} onChange={e => setSettingsForm({...settingsForm, address: e.target.value})} className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary"></textarea>
          </div>
          
          <h3 className="text-lg font-bold text-text mt-8 mb-4 border-t border-border pt-6">روابط منصات التواصل الاجتماعي</h3>
          <div className="space-y-4">
            {settingsForm.socialLinks?.map((link, index) => (
              <div key={link.id} className="flex items-center gap-4">
                <input 
                  type="text" 
                  placeholder="اسم المنصة (مثال: Facebook)" 
                  value={link.platform} 
                  onChange={e => {
                    const newLinks = [...settingsForm.socialLinks];
                    newLinks[index].platform = e.target.value;
                    setSettingsForm({...settingsForm, socialLinks: newLinks});
                  }} 
                  className="w-1/3 border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary" 
                />
                <input 
                  type="url" 
                  placeholder="الرابط" 
                  value={link.url} 
                  onChange={e => {
                    const newLinks = [...settingsForm.socialLinks];
                    newLinks[index].url = e.target.value;
                    setSettingsForm({...settingsForm, socialLinks: newLinks});
                  }} 
                  dir="ltr" 
                  className="flex-1 border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary text-right" 
                />
                <button 
                  type="button"
                  onClick={() => {
                    const newLinks = settingsForm.socialLinks.filter(l => l.id !== link.id);
                    setSettingsForm({...settingsForm, socialLinks: newLinks});
                  }}
                  className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button 
              type="button"
              onClick={() => {
                const currentLinks = settingsForm.socialLinks || [];
                setSettingsForm({
                  ...settingsForm, 
                  socialLinks: [...currentLinks, { id: Date.now().toString(), platform: '', url: '' }]
                });
              }}
              className="flex items-center gap-2 text-primary hover:text-primary-light font-bold text-sm"
            >
              <Plus className="w-4 h-4" />
              إضافة منصة جديدة
            </button>
          </div>

          <div className="pt-6 border-t border-border">
            <button type="submit" className="bg-primary hover:bg-primary-light text-white font-bold py-3 px-8 rounded-lg transition-colors">
              حفظ الإعدادات
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm p-6">
        <h2 className="text-2xl font-bold text-text mb-6">تغيير كلمة مرور المدير</h2>
        <form onSubmit={handleAdminPasswordUpdate} className="max-w-2xl space-y-6">
          <div>
            <label className="block text-sm font-medium text-text mb-2">كلمة المرور الحالية</label>
            <input 
              type="password" 
              required
              value={adminPasswordForm.currentPassword}
              onChange={(e) => setAdminPasswordForm({...adminPasswordForm, currentPassword: e.target.value})}
              dir="ltr" 
              className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-2">كلمة المرور الجديدة</label>
            <input 
              type="password" 
              required
              value={adminPasswordForm.newPassword}
              onChange={(e) => setAdminPasswordForm({...adminPasswordForm, newPassword: e.target.value})}
              dir="ltr" 
              className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text mb-2">تأكيد كلمة المرور الجديدة</label>
            <input 
              type="password" 
              required
              value={adminPasswordForm.confirmPassword}
              onChange={(e) => setAdminPasswordForm({...adminPasswordForm, confirmPassword: e.target.value})}
              dir="ltr" 
              className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary" 
            />
          </div>
          <div className="pt-4 border-t border-border">
            <button type="submit" className="bg-primary hover:bg-primary-light text-white font-bold py-3 px-8 rounded-lg transition-colors">
              تحديث كلمة المرور
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-xl border border-border p-4 flex flex-col gap-2 sticky top-24 shadow-sm">
            <button onClick={() => setActiveTab('overview')} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-primary text-white' : 'hover:bg-gray-50 text-text'}`}>
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-bold">نظرة عامة</span>
            </button>
            <button onClick={() => setActiveTab('orders')} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-primary text-white' : 'hover:bg-gray-50 text-text'}`}>
              <ShoppingCart className="w-5 h-5" />
              <span className="font-bold">الطلبات</span>
            </button>
            <button onClick={() => setActiveTab('products')} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'products' ? 'bg-primary text-white' : 'hover:bg-gray-50 text-text'}`}>
              <Package className="w-5 h-5" />
              <span className="font-bold">المنتجات</span>
            </button>
            <button onClick={() => setActiveTab('categories')} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'categories' ? 'bg-primary text-white' : 'hover:bg-gray-50 text-text'}`}>
              <FolderTree className="w-5 h-5" />
              <span className="font-bold">الأقسام</span>
            </button>
            <button onClick={() => setActiveTab('types')} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'types' ? 'bg-primary text-white' : 'hover:bg-gray-50 text-text'}`}>
              <Tag className="w-5 h-5" />
              <span className="font-bold">أنواع المنتجات</span>
            </button>
            <button onClick={() => setActiveTab('manufacturers')} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'manufacturers' ? 'bg-primary text-white' : 'hover:bg-gray-50 text-text'}`}>
              <ImageIcon className="w-5 h-5" />
              <span className="font-bold">الشركات المصنعة</span>
            </button>
            <button onClick={() => setActiveTab('users')} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-primary text-white' : 'hover:bg-gray-50 text-text'}`}>
              <Users className="w-5 h-5" />
              <span className="font-bold">العملاء</span>
            </button>
            <button onClick={() => setActiveTab('promos')} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'promos' ? 'bg-primary text-white' : 'hover:bg-gray-50 text-text'}`}>
              <Tag className="w-5 h-5" />
              <span className="font-bold">العروض</span>
            </button>
            <button onClick={() => setActiveTab('settings')} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-primary text-white' : 'hover:bg-gray-50 text-text'}`}>
              <Settings className="w-5 h-5" />
              <span className="font-bold">الإعدادات</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'orders' && renderOrders()}
          {activeTab === 'products' && renderProducts()}
          {activeTab === 'categories' && renderCategories()}
          {activeTab === 'types' && renderProductTypes()}
          {activeTab === 'manufacturers' && renderManufacturers()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'promos' && renderPromos()}
          {activeTab === 'settings' && renderSettings()}
        </div>
      </div>

      {/* Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl my-8">
            <div className="flex justify-between items-center p-6 border-b border-border sticky top-0 bg-white rounded-t-2xl z-10">
              <h2 className="text-2xl font-bold">{editingProduct ? 'تعديل منتج' : 'إضافة منتج جديد'}</h2>
              <button onClick={() => setIsProductModalOpen(false)} className="text-text-muted hover:text-danger">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleSaveProduct} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">الاسم (عربي)</label>
                    <input required type="text" value={productForm.nameAr} onChange={e => setProductForm({...productForm, nameAr: e.target.value})} className="w-full border border-border rounded-lg px-4 py-2 focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">الاسم (إنجليزي)</label>
                    <input required type="text" dir="ltr" value={productForm.nameEn} onChange={e => setProductForm({...productForm, nameEn: e.target.value})} className="w-full border border-border rounded-lg px-4 py-2 focus:border-primary outline-none" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">الوصف</label>
                    <textarea required rows={3} value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="w-full border border-border rounded-lg px-4 py-2 focus:border-primary outline-none"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">السعر (ريال يمني)</label>
                    <input required type="number" min="0" value={productForm.price_yer} onChange={e => setProductForm({...productForm, price_yer: Number(e.target.value)})} className="w-full border border-border rounded-lg px-4 py-2 focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">السعر (دولار)</label>
                    <input required type="number" min="0" step="0.01" value={productForm.price_usd} onChange={e => setProductForm({...productForm, price_usd: Number(e.target.value)})} className="w-full border border-border rounded-lg px-4 py-2 focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">القسم</label>
                    <select required value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} className="w-full border border-border rounded-lg px-4 py-2 focus:border-primary outline-none">
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">نوع المنتج</label>
                    <select value={productForm.type || ''} onChange={e => setProductForm({...productForm, type: e.target.value})} className="w-full border border-border rounded-lg px-4 py-2 focus:border-primary outline-none">
                      <option value="">-- اختر النوع --</option>
                      {productTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">الشركة المصنعة (Brand)</label>
                    <select required value={productForm.brand} onChange={e => setProductForm({...productForm, brand: e.target.value})} className="w-full border border-border rounded-lg px-4 py-2 focus:border-primary outline-none">
                      <option value="">-- اختر الشركة --</option>
                      {manufacturers.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">صورة المنتج</label>
                    <div className="flex items-center gap-4">
                      <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-text font-bold py-2 px-4 rounded-lg border border-border transition-colors flex items-center gap-2">
                        <ImageIcon className="w-5 h-5" />
                        اختر صورة
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                      <span className="text-xs text-text-muted">أو الصق رابط الصورة أدناه</span>
                    </div>
                    <input type="url" dir="ltr" value={productForm.image} onChange={e => setProductForm({...productForm, image: e.target.value})} placeholder="https://..." className="w-full border border-border rounded-lg px-4 py-2 mt-2 focus:border-primary outline-none" />
                    {productForm.image && (
                      <div className="mt-2">
                        <img src={productForm.image} alt="Preview" className="w-20 h-20 object-contain rounded border border-border bg-gray-50" />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">رقم التسجيل</label>
                    <input required type="text" dir="ltr" value={productForm.registrationNo} onChange={e => setProductForm({...productForm, registrationNo: e.target.value})} className="w-full border border-border rounded-lg px-4 py-2 focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">الحد الأدنى للطلب</label>
                    <input required type="number" min="1" value={productForm.minOrder} onChange={e => setProductForm({...productForm, minOrder: Number(e.target.value)})} className="w-full border border-border rounded-lg px-4 py-2 focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">الكمية المتوفرة في المخزون</label>
                    <input required type="number" min="0" value={productForm.stockQuantity || 0} onChange={e => setProductForm({...productForm, stockQuantity: Number(e.target.value), inStock: Number(e.target.value) > 0})} className="w-full border border-border rounded-lg px-4 py-2 focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">الوحدة (علبة، شريط، كرتون)</label>
                    <input required type="text" value={productForm.unit} onChange={e => setProductForm({...productForm, unit: e.target.value})} className="w-full border border-border rounded-lg px-4 py-2 focus:border-primary outline-none" />
                  </div>
                  <div className="md:col-span-2 flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-border">
                    <input type="checkbox" id="inStock" checked={productForm.inStock} onChange={e => setProductForm({...productForm, inStock: e.target.checked})} className="w-5 h-5 text-primary focus:ring-primary rounded" />
                    <label htmlFor="inStock" className="font-bold cursor-pointer">المنتج متوفر في المخزون</label>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="font-bold text-lg mb-4">المواصفات الطبية</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">الاسم العلمي</label>
                      <input type="text" dir="ltr" value={productForm.specs?.scientificName} onChange={e => setProductForm({...productForm, specs: {...productForm.specs!, scientificName: e.target.value}})} className="w-full border border-border rounded-lg px-4 py-2 focus:border-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">الشكل الدوائي</label>
                      <input type="text" value={productForm.specs?.dosageForm} onChange={e => setProductForm({...productForm, specs: {...productForm.specs!, dosageForm: e.target.value}})} className="w-full border border-border rounded-lg px-4 py-2 focus:border-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">التركيز</label>
                      <input type="text" dir="ltr" value={productForm.specs?.concentration} onChange={e => setProductForm({...productForm, specs: {...productForm.specs!, concentration: e.target.value}})} className="w-full border border-border rounded-lg px-4 py-2 focus:border-primary outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">العبوة</label>
                      <input type="text" value={productForm.specs?.packaging} onChange={e => setProductForm({...productForm, specs: {...productForm.specs!, packaging: e.target.value}})} className="w-full border border-border rounded-lg px-4 py-2 focus:border-primary outline-none" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-border sticky bottom-0 bg-white pb-2">
                  <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-6 py-2 rounded-lg font-bold text-text-muted hover:bg-gray-100 transition-colors">
                    إلغاء
                  </button>
                  <button type="submit" className="px-8 py-2 rounded-lg font-bold bg-primary text-white hover:bg-primary-light transition-colors flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    حفظ المنتج
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Promo Modal */}
      {isPromoModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md my-8">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="text-2xl font-bold">{editingPromo ? 'تعديل عرض' : 'إضافة عرض جديد'}</h2>
              <button onClick={() => setIsPromoModalOpen(false)} className="text-text-muted hover:text-danger">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleSavePromo} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">كود الخصم</label>
                  <input required type="text" dir="ltr" value={promoForm.code} onChange={e => setPromoForm({...promoForm, code: e.target.value.toUpperCase()})} className="w-full border border-border rounded-lg px-4 py-2 focus:border-primary outline-none uppercase" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">نسبة الخصم (%)</label>
                  <input required type="number" min="1" max="100" value={promoForm.discountPercentage} onChange={e => setPromoForm({...promoForm, discountPercentage: Number(e.target.value)})} className="w-full border border-border rounded-lg px-4 py-2 focus:border-primary outline-none" />
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-border">
                  <input type="checkbox" id="isActive" checked={promoForm.isActive} onChange={e => setPromoForm({...promoForm, isActive: e.target.checked})} className="w-5 h-5 text-primary focus:ring-primary rounded" />
                  <label htmlFor="isActive" className="font-bold cursor-pointer">العرض نشط</label>
                </div>
                <div className="flex justify-end gap-4 pt-6 border-t border-border">
                  <button type="button" onClick={() => setIsPromoModalOpen(false)} className="px-6 py-2 rounded-lg font-bold text-text-muted hover:bg-gray-100 transition-colors">
                    إلغاء
                  </button>
                  <button type="submit" className="px-8 py-2 rounded-lg font-bold bg-primary text-white hover:bg-primary-light transition-colors flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    حفظ العرض
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md my-8">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="text-2xl font-bold">{editingCategory ? 'تعديل قسم' : 'إضافة قسم جديد'}</h2>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-text-muted hover:text-danger">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleSaveCategory} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">اسم القسم</label>
                  <input required type="text" value={categoryForm} onChange={e => setCategoryForm(e.target.value)} className="w-full border border-border rounded-lg px-4 py-2 focus:border-primary outline-none" placeholder="مثال: أجهزة طبية" />
                </div>
                <div className="flex justify-end gap-4 pt-6 border-t border-border">
                  <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="px-6 py-2 rounded-lg font-bold text-text-muted hover:bg-gray-100 transition-colors">
                    إلغاء
                  </button>
                  <button type="submit" className="px-8 py-2 rounded-lg font-bold bg-primary text-white hover:bg-primary-light transition-colors flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    حفظ القسم
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Product Type Modal */}
      {isProductTypeModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md my-8">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="text-2xl font-bold">{editingProductType ? 'تعديل نوع' : 'إضافة نوع جديد'}</h2>
              <button onClick={() => setIsProductTypeModalOpen(false)} className="text-text-muted hover:text-danger">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleSaveProductType} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">اسم النوع</label>
                  <input required type="text" value={productTypeForm} onChange={e => setProductTypeForm(e.target.value)} className="w-full border border-border rounded-lg px-4 py-2 focus:border-primary outline-none" placeholder="مثال: أدوية" />
                </div>
                <div className="flex justify-end gap-4 pt-6 border-t border-border">
                  <button type="button" onClick={() => setIsProductTypeModalOpen(false)} className="px-6 py-2 rounded-lg font-bold text-text-muted hover:bg-gray-100 transition-colors">
                    إلغاء
                  </button>
                  <button type="submit" className="px-8 py-2 rounded-lg font-bold bg-primary text-white hover:bg-primary-light transition-colors flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    حفظ النوع
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Manufacturer Modal */}
      {isManufacturerModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md my-8">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="text-2xl font-bold">{editingManufacturer ? 'تعديل شركة' : 'إضافة شركة جديدة'}</h2>
              <button onClick={() => setIsManufacturerModalOpen(false)} className="text-text-muted hover:text-danger">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={handleSaveManufacturer} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">اسم الشركة</label>
                  <input required type="text" value={manufacturerForm} onChange={e => setManufacturerForm(e.target.value)} className="w-full border border-border rounded-lg px-4 py-2 focus:border-primary outline-none" placeholder="مثال: PharmaCare" />
                </div>
                <div className="flex justify-end gap-4 pt-6 border-t border-border">
                  <button type="button" onClick={() => setIsManufacturerModalOpen(false)} className="px-6 py-2 rounded-lg font-bold text-text-muted hover:bg-gray-100 transition-colors">
                    إلغاء
                  </button>
                  <button type="submit" className="px-8 py-2 rounded-lg font-bold bg-primary text-white hover:bg-primary-light transition-colors flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    حفظ الشركة
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
