import React from 'react';

export const Terms: React.FC = () => {
  return (
    <div className="bg-bg min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white p-8 md:p-12 rounded-2xl border border-border shadow-sm">
          <h1 className="text-3xl font-bold text-text mb-8">الشروط والأحكام</h1>
          
          <div className="prose prose-lg max-w-none text-text-muted">
            <p className="mb-6">
              مرحباً بكم في منصة شركة الشفاء لتوزيع الأدوية. يرجى قراءة هذه الشروط والأحكام بعناية قبل استخدام الموقع.
            </p>

            <h2 className="text-xl font-bold text-text mt-8 mb-4">1. قبول الشروط</h2>
            <p className="mb-6">
              باستخدامك لهذا الموقع، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، فلا يجوز لك استخدام الموقع.
            </p>

            <h2 className="text-xl font-bold text-text mt-8 mb-4">2. التسجيل والحسابات</h2>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li>يجب أن تكون ممثلاً قانونياً لصيدلية، مستشفى، عيادة، أو جهة طبية مرخصة لإنشاء حساب.</li>
              <li>أنت مسؤول عن الحفاظ على سرية معلومات حسابك وكلمة المرور.</li>
              <li>يجب تقديم معلومات دقيقة وكاملة عند التسجيل.</li>
            </ul>

            <h2 className="text-xl font-bold text-text mt-8 mb-4">3. الطلبات والتسعير</h2>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li>جميع الطلبات تخضع للتوفر وتأكيد السعر.</li>
              <li>الأسعار المعروضة قابلة للتغيير دون إشعار مسبق.</li>
              <li>الحد الأدنى للطلب يختلف حسب المنتج ويتم توضيحه في صفحة المنتج.</li>
            </ul>

            <h2 className="text-xl font-bold text-text mt-8 mb-4">4. الدفع والشحن</h2>
            <ul className="list-disc list-inside mb-6 space-y-2">
              <li>يتم الدفع عبر التحويل البنكي أو الدفع عند الاستلام (في مناطق محددة).</li>
              <li>نسعى لتوصيل الطلبات في أسرع وقت ممكن، ولكن قد تختلف أوقات التوصيل حسب المنطقة.</li>
            </ul>

            <h2 className="text-xl font-bold text-text mt-8 mb-4">5. سياسة الإرجاع</h2>
            <p className="mb-6">
              نقبل إرجاع الأدوية والمستلزمات الطبية فقط في حالة وجود عيب مصنعي أو تلف أثناء النقل، ويجب الإبلاغ عن ذلك خلال 24 ساعة من استلام الطلب.
            </p>

            <h2 className="text-xl font-bold text-text mt-8 mb-4">6. إخلاء المسؤولية</h2>
            <p className="mb-6">
              المعلومات المقدمة على هذا الموقع هي لأغراض معلوماتية فقط ولا تغني عن الاستشارة الطبية المتخصصة.
            </p>

            <p className="mt-12 text-sm">
              آخر تحديث: {new Date().toLocaleDateString('ar-EG')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
