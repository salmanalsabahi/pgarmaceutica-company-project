import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe } from 'lucide-react';
import { useSettingsStore } from '../store/useSettingsStore';

export const Footer: React.FC = () => {
  const { settings } = useSettingsStore();

  return (
    <footer className="bg-text text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
                ش
              </div>
              <div>
                <h2 className="text-white font-bold text-xl leading-tight">{settings.name}</h2>
                <p className="text-accent text-xs">لتوزيع الأدوية</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              شريكك الموثوق في القطاع الصحي. نوفر أفضل الأدوية والمستلزمات الطبية لجميع الصيدليات والمستشفيات في كافة محافظات الجمهورية اليمنية.
            </p>
            <div className="flex flex-wrap gap-2">
              {settings.socialLinks?.map(link => (
                link.url && link.url !== '#' && (
                  <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors text-sm gap-2">
                    <Globe className="w-4 h-4" />
                    {link.platform}
                  </a>
                )
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-gray-700 pb-2 inline-block">روابط سريعة</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-400 hover:text-accent transition-colors">الرئيسية</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-accent transition-colors">جميع المنتجات</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-accent transition-colors">خدماتنا</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-accent transition-colors">من نحن</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-accent transition-colors">اتصل بنا</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-accent transition-colors">الشروط والأحكام</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-gray-700 pb-2 inline-block">أقسام المنتجات</h3>
            <ul className="space-y-3">
              <li><Link to="/products?category=المضادات الحيوية" className="text-gray-400 hover:text-accent transition-colors">المضادات الحيوية</Link></li>
              <li><Link to="/products?category=أدوية القلب والضغط" className="text-gray-400 hover:text-accent transition-colors">أدوية القلب والضغط</Link></li>
              <li><Link to="/products?category=أدوية السكري" className="text-gray-400 hover:text-accent transition-colors">أدوية السكري</Link></li>
              <li><Link to="/products?category=فيتامينات ومكملات" className="text-gray-400 hover:text-accent transition-colors">فيتامينات ومكملات</Link></li>
              <li><Link to="/products?category=مستلزمات طبية" className="text-gray-400 hover:text-accent transition-colors">مستلزمات طبية</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-gray-700 pb-2 inline-block">تواصل معنا</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent shrink-0 mt-1" />
                <span className="text-gray-400">{settings.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <span className="text-gray-400" dir="ltr">{settings.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <span className="text-gray-400">{settings.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} {settings.name}. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};
