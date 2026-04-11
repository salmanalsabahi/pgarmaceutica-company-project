import React from 'react';
import { Truck, ShieldCheck, HeadphonesIcon, Package, Activity, FileText } from 'lucide-react';

export const Services: React.FC = () => {
  return (
    <div className="bg-bg min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-text mb-4">خدماتنا</h1>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            نقدم مجموعة متكاملة من الخدمات لتلبية احتياجات القطاع الصحي في اليمن بأعلى معايير الجودة والاحترافية.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Service 1 */}
          <div className="bg-white p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
              <Truck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-text mb-4">توزيع شامل وسريع</h3>
            <p className="text-text-muted leading-relaxed">
              نمتلك أسطولاً مجهزاً لتوزيع الأدوية والمستلزمات الطبية إلى كافة المحافظات اليمنية، مع ضمان الحفاظ على جودة المنتجات أثناء النقل.
            </p>
          </div>

          {/* Service 2 */}
          <div className="bg-white p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-text mb-4">توفير الأدوية التخصصية</h3>
            <p className="text-text-muted leading-relaxed">
              نوفر الأدوية التخصصية والنادرة التي يصعب الحصول عليها، لتلبية احتياجات المستشفيات والمراكز الطبية المتخصصة.
            </p>
          </div>

          {/* Service 3 */}
          <div className="bg-white p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-text mb-4">ضمان الجودة والأصالة</h3>
            <p className="text-text-muted leading-relaxed">
              جميع منتجاتنا أصلية ومستوردة من الشركات المصنعة المعتمدة، وتخضع لرقابة صارمة لضمان مطابقتها للمواصفات الطبية.
            </p>
          </div>

          {/* Service 4 */}
          <div className="bg-white p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
              <Activity className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-text mb-4">تجهيز المرافق الطبية</h3>
            <p className="text-text-muted leading-relaxed">
              نقدم خدمة تجهيز الصيدليات والمراكز الطبية الجديدة بكافة الأدوية والمستلزمات الأساسية لبدء العمل.
            </p>
          </div>

          {/* Service 5 */}
          <div className="bg-white p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-text mb-4">عقود توريد مستمرة</h3>
            <p className="text-text-muted leading-relaxed">
              نوفر عقود توريد دورية للمستشفيات والمراكز الطبية لضمان توفر الأدوية والمستلزمات بشكل مستمر دون انقطاع.
            </p>
          </div>

          {/* Service 6 */}
          <div className="bg-white p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
              <HeadphonesIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-text mb-4">دعم فني وخدمة عملاء</h3>
            <p className="text-text-muted leading-relaxed">
              فريق خدمة العملاء لدينا متاح للرد على استفساراتكم ومتابعة طلباتكم وتقديم الدعم اللازم في أي وقت.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
