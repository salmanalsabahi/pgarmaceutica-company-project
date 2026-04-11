import React from 'react';
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const articles = [
  {
    id: 1,
    title: 'أهمية التخزين الجيد للأدوية وتأثيره على الفعالية',
    excerpt: 'تعرف على المعايير العالمية لتخزين الأدوية وكيف تضمن شركة الشفاء الحفاظ على جودة المنتجات الطبية خلال سلسلة التوريد.',
    image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=800',
    date: '9 أبريل 2026',
    author: 'د. أحمد عبدالله',
    category: 'جودة وتخزين'
  },
  {
    id: 2,
    title: 'مستقبل الرعاية الصحية وتوزيع الأدوية في اليمن',
    excerpt: 'نظرة تحليلية على التحديات والفرص في قطاع الرعاية الصحية اليمني، ودور التكنولوجيا في تحسين سلاسل الإمداد.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
    date: '5 أبريل 2026',
    author: 'م. محمد علي',
    category: 'رؤى وتحليلات'
  },
  {
    id: 3,
    title: 'كيف تختار المورد الطبي المناسب لصيدليتك؟',
    excerpt: 'دليل شامل لأصحاب الصيدليات حول المعايير الأساسية لاختيار مورد الأدوية الذي يضمن لك الاستمرارية والموثوقية.',
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80&w=800',
    date: '28 مارس 2026',
    author: 'د. سارة خالد',
    category: 'إدارة الصيدليات'
  },
  {
    id: 4,
    title: 'أحدث التقنيات في تجهيز المستشفيات والمراكز الطبية',
    excerpt: 'استعراض لأحدث الأجهزة والمعدات الطبية التي توفرها شركة الشفاء لتجهيز المرافق الصحية الحديثة.',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
    date: '15 مارس 2026',
    author: 'فريق التجهيزات',
    category: 'تجهيزات طبية'
  }
];

export const Articles: React.FC = () => {
  return (
    <div className="bg-bg min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-text mb-4">المقالات والمدونة الطبية</h1>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            اكتشف أحدث المقالات، النصائح، والأخبار في مجال الرعاية الصحية وتوزيع الأدوية.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((article) => (
            <article key={article.id} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-all group">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                  {article.category}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-text-muted mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{article.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{article.author}</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-text mb-3 group-hover:text-primary transition-colors">
                  {article.title}
                </h2>
                <p className="text-text-muted leading-relaxed mb-6 line-clamp-2">
                  {article.excerpt}
                </p>
                <Link to="#" className="inline-flex items-center gap-2 text-primary font-bold hover:text-primary-light transition-colors">
                  <span>اقرأ المزيد</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
