import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, ShieldCheck, Clock, HeadphonesIcon, 
  CalendarCheck, Stethoscope, Building2, Truck, 
  Activity, HeartPulse, Award, Package, Tag, Percent
} from 'lucide-react';
import { categories } from '../data/products';
import { usePromoStore } from '../store/usePromoStore';
import { useSettingsStore } from '../store/useSettingsStore';

export const Home: React.FC = () => {
  const { promos } = usePromoStore();
  const { settings } = useSettingsStore();
  const activePromos = promos.filter(p => p.isActive);

  return (
    <div className="bg-bg">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=1920" 
            alt="Medical Background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 text-primary-light px-4 py-2 rounded-full text-sm font-bold mb-8">
              <Activity className="w-4 h-4" />
              <span>الرعاية الطبية المتميزة في اليمن</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
              شريكك الموثوق في <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-secondary">الرعاية الصحية</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl">
              نقدم لك في {settings.name} جميع الخدمات التي تحتاجها من توزيع الأدوية، تجهيز المستشفيات، وتوفير المستلزمات الطبية بأحدث التكنولوجيا وأعلى معايير الجودة.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="bg-primary hover:bg-primary-light text-white font-bold py-4 px-8 rounded-xl transition-all text-lg shadow-lg shadow-primary/30 flex items-center gap-2 hover:-translate-y-1">
                تصفح المنتجات
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Link to="/booking" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold py-4 px-8 rounded-xl transition-all text-lg flex items-center gap-2 hover:-translate-y-1">
                <CalendarCheck className="w-5 h-5" />
                احجز استشارة
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-border relative z-20 -mt-12 mx-4 lg:mx-auto max-w-7xl rounded-2xl shadow-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-8">
          <div className="text-center">
            <div className="text-4xl font-extrabold text-primary mb-2">+500</div>
            <div className="text-text-muted font-medium">صيدلية ومستشفى</div>
          </div>
          <div className="text-center border-r border-border/50">
            <div className="text-4xl font-extrabold text-primary mb-2">+1000</div>
            <div className="text-text-muted font-medium">صنف طبي</div>
          </div>
          <div className="text-center border-r border-border/50">
            <div className="text-4xl font-extrabold text-primary mb-2">15</div>
            <div className="text-text-muted font-medium">محافظة يمنية</div>
          </div>
          <div className="text-center border-r border-border/50">
            <div className="text-4xl font-extrabold text-primary mb-2">+10</div>
            <div className="text-text-muted font-medium">سنوات خبرة</div>
          </div>
        </div>
      </section>

      {/* Active Promos Section */}
      {activePromos.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-4">
                <Percent className="w-8 h-8" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">عروض وخصومات حصرية</h2>
              <p className="text-text-muted text-lg">استفد من أحدث العروض والخصومات المتاحة لعملائنا الكرام.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {activePromos.map((promo) => (
                <div key={promo.id} className="bg-white rounded-2xl p-6 border-2 border-dashed border-primary/30 relative overflow-hidden group hover:border-primary transition-colors">
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <Tag className="w-6 h-6 text-primary" />
                      <h3 className="text-xl font-bold">خصم {promo.discountPercentage}%</h3>
                    </div>
                    <p className="text-text-muted mb-6">استخدم الكود التالي في سلة المشتريات للحصول على الخصم على إجمالي طلبك.</p>
                    <div className="bg-gray-50 border border-border rounded-lg p-4 text-center">
                      <span className="text-2xl font-black text-primary tracking-widest uppercase" dir="ltr">{promo.code}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      <section className="py-20 bg-bg">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">خدماتنا المتكاملة</h2>
            <p className="text-text-muted text-lg">نقدم حلولاً شاملة للقطاع الصحي تلبي كافة احتياجات المنشآت الطبية والصيدليات.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-border hover:shadow-xl transition-shadow group">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">توزيع الأدوية بالجملة</h3>
              <p className="text-text-muted leading-relaxed mb-6">
                شبكة توزيع واسعة تغطي جميع المحافظات لضمان وصول الأدوية للصيدليات والمستشفيات بأسرع وقت وأفضل جودة.
              </p>
              <Link to="/products" className="text-blue-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
                تصفح الكتالوج <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border border-border hover:shadow-xl transition-shadow group">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Building2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">تجهيز المستشفيات</h3>
              <p className="text-text-muted leading-relaxed mb-6">
                توفير أحدث الأجهزة والمعدات الطبية لتجهيز العيادات والمستشفيات وفقاً لأعلى المعايير العالمية.
              </p>
              <Link to="/booking" className="text-emerald-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
                طلب عرض سعر <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-border hover:shadow-xl transition-shadow group">
              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Stethoscope className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">الاستشارات الطبية</h3>
              <p className="text-text-muted leading-relaxed mb-6">
                فريق من الخبراء والصيادلة لتقديم الاستشارات المتخصصة في إدارة الصيدليات واختيار المعدات.
              </p>
              <Link to="/booking" className="text-purple-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
                احجز موعداً <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2">
              <img 
                src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=800" 
                alt="Medical Team" 
                className="rounded-2xl shadow-2xl"
              />
            </div>
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-text mb-6">لماذا تختار {settings.name}؟</h2>
              <p className="text-text-muted text-lg mb-10 leading-relaxed">
                نحن نلتزم بتقديم أعلى مستويات الخدمة لعملائنا من خلال توفير منتجات أصلية ومضمونة، مع شبكة توزيع فعالة ودعم فني مستمر.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">منتجات أصلية ومضمونة</h4>
                    <p className="text-text-muted">جميع منتجاتنا مرخصة من وزارة الصحة ومستوردة من أفضل الشركات العالمية.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">توصيل سريع وآمن</h4>
                    <p className="text-text-muted">أسطول مجهز بثلاجات لضمان وصول الأدوية في درجات الحرارة المناسبة.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                    <HeadphonesIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">دعم فني متواصل</h4>
                    <p className="text-text-muted">فريق خدمة العملاء متواجد على مدار الساعة للرد على استفساراتكم وتلبية طلباتكم.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 bg-bg">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">تسوق حسب القسم</h2>
            <p className="text-text-muted text-lg">مجموعة واسعة من الأدوية والمستلزمات الطبية مصنفة لتسهيل عملية البحث.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => {
              const icons = [HeartPulse, Activity, Stethoscope, Award, ShieldCheck, Package];
              const Icon = icons[index % icons.length];
              return (
                <Link 
                  key={index} 
                  to={`/products?category=${category}`}
                  className="bg-white p-6 rounded-2xl border border-border text-center hover:border-primary hover:shadow-lg hover:-translate-y-1 transition-all group"
                >
                  <div className="w-16 h-16 mx-auto bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-sm text-text group-hover:text-primary transition-colors">{category}</h3>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Articles Teaser */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">أحدث المقالات الطبية</h2>
              <p className="text-text-muted text-lg">نصائح ومعلومات طبية موثوقة من خبرائنا.</p>
            </div>
            <Link to="/articles" className="hidden md:flex items-center gap-2 text-primary hover:text-primary-light font-bold bg-primary/10 px-6 py-3 rounded-xl transition-colors">
              عرض كل المقالات <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Article 1 */}
            <Link to="/articles" className="group bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all">
              <div className="h-48 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=600" alt="Article" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <div className="text-sm text-primary font-bold mb-3">نصائح صحية</div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">كيف تختار المكملات الغذائية المناسبة لك؟</h3>
                <p className="text-text-muted line-clamp-2 mb-4">دليل شامل لمعرفة الفيتامينات والمعادن التي يحتاجها جسمك وكيفية اختيار المنتجات الموثوقة.</p>
                <div className="flex items-center text-sm text-gray-500 font-medium">
                  <CalendarCheck className="w-4 h-4 ml-2" />
                  15 مايو 2024
                </div>
              </div>
            </Link>
            {/* Article 2 */}
            <Link to="/articles" className="group bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all">
              <div className="h-48 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600" alt="Article" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <div className="text-sm text-primary font-bold mb-3">أخبار طبية</div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">أحدث التطورات في علاج مرض السكري</h3>
                <p className="text-text-muted line-clamp-2 mb-4">تعرف على الأدوية والتقنيات الجديدة التي تساعد مرضى السكري على عيش حياة صحية وطبيعية.</p>
                <div className="flex items-center text-sm text-gray-500 font-medium">
                  <CalendarCheck className="w-4 h-4 ml-2" />
                  10 مايو 2024
                </div>
              </div>
            </Link>
            {/* Article 3 */}
            <Link to="/articles" className="group bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all">
              <div className="h-48 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=600" alt="Article" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <div className="text-sm text-primary font-bold mb-3">إدارة الصيدليات</div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">طرق فعالة لإدارة مخزون الصيدلية</h3>
                <p className="text-text-muted line-clamp-2 mb-4">استراتيجيات عملية لتقليل الهدر وضمان توفر الأدوية الأساسية دائماً في صيدليتك.</p>
                <div className="flex items-center text-sm text-gray-500 font-medium">
                  <CalendarCheck className="w-4 h-4 ml-2" />
                  5 مايو 2024
                </div>
              </div>
            </Link>
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link to="/articles" className="inline-flex items-center gap-2 text-primary hover:text-primary-light font-bold">
              عرض كل المقالات <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">هل أنت مستعد لتجهيز صيدليتك؟</h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            انضم إلى شبكة عملائنا واستفد من أفضل الأسعار، التوصيل السريع، والمنتجات المضمونة.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/auth" className="bg-white text-primary hover:bg-gray-100 font-bold py-4 px-10 rounded-xl transition-all text-lg shadow-lg">
              إنشاء حساب جديد
            </Link>
            <Link to="/contact" className="bg-primary-light hover:bg-white/20 border border-white/30 text-white font-bold py-4 px-10 rounded-xl transition-all text-lg">
              تواصل معنا
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
