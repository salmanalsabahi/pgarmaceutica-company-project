import React from 'react';
import { Building2, Users, Target, ShieldCheck, Award, Clock } from 'lucide-react';
import { useSettingsStore } from '../store/useSettingsStore';

export const About: React.FC = () => {
  const { settings } = useSettingsStore();
  
  return (
    <div className="bg-bg min-h-screen">
      {/* Hero Section */}
      <div className="bg-primary text-white py-20">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">من نحن</h1>
          <p className="text-lg text-primary-light/90 leading-relaxed">
            {settings.name} لتوزيع الأدوية والمستلزمات الطبية، شريكك الموثوق في الرعاية الصحية في الجمهورية اليمنية.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold text-text mb-6">قصتنا</h2>
            <p className="text-text-muted leading-relaxed mb-4">
              تأسست {settings.name} بهدف سد الفجوة في سوق توزيع الأدوية في اليمن، وتوفير الأدوية والمستلزمات الطبية عالية الجودة بأسعار تنافسية وموثوقية عالية.
            </p>
            <p className="text-text-muted leading-relaxed">
              منذ انطلاقتنا، عملنا بجد لبناء شبكة توزيع قوية تغطي كافة المحافظات اليمنية، معتمدين على أحدث التقنيات في إدارة المخازن وسلاسل الإمداد لضمان وصول الأدوية في أفضل الظروف وبأسرع وقت ممكن.
            </p>
          </div>
          <div className="bg-gray-100 rounded-2xl aspect-video flex items-center justify-center overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&q=80&w=800" 
              alt="مستودع الأدوية" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="bg-white p-8 rounded-2xl border border-border shadow-sm">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
              <Target className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-text mb-4">رؤيتنا</h3>
            <p className="text-text-muted leading-relaxed">
              أن نكون الشركة الرائدة والأكثر موثوقية في مجال توزيع الأدوية والمستلزمات الطبية في اليمن، وأن نساهم بشكل فعال في الارتقاء بمستوى الرعاية الصحية.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-border shadow-sm">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-text mb-4">رسالتنا</h3>
            <p className="text-text-muted leading-relaxed">
              توفير الأدوية والمستلزمات الطبية الآمنة والفعالة لجميع شركائنا من صيدليات ومستشفيات، مع الالتزام بأعلى معايير الجودة والمهنية في كافة عملياتنا.
            </p>
          </div>
        </div>

        {/* Values */}
        <h2 className="text-3xl font-bold text-text mb-10 text-center">قيمنا الأساسية</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl border border-border text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold mb-2">الجودة والأمان</h4>
            <p className="text-text-muted text-sm">نلتزم بتوفير منتجات أصلية ومضمونة 100% من مصادرها المعتمدة.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-border text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold mb-2">السرعة والالتزام</h4>
            <p className="text-text-muted text-sm">نضمن توصيل الطلبات في الوقت المحدد لضمان استمرارية عمل شركائنا.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-border text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="text-xl font-bold mb-2">التميز في الخدمة</h4>
            <p className="text-text-muted text-sm">نسعى دائماً لتقديم أفضل خدمة عملاء وتلبية احتياجات شركائنا بكفاءة.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
