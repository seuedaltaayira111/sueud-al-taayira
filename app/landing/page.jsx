'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  const [lang, setLang] = useState('en');
  const isAr = lang === 'ar';

  const t = (en, ar) => isAr ? ar : en;

  const features = [
    { icon: '✈️', title_en: 'AI-Powered Invoicing', title_ar: 'فوترة بالذكاء الاصطناعي', desc_en: 'Auto-fetch previous booking details and generate bilingual invoices in 1 click.', desc_ar: 'جلب تلقائي لتفاصيل الحجز السابق وإنشاء فواتير ثنائية اللغة بنقرة واحدة.' },
    { icon: '📊', title_en: 'Advanced Finance & HR', title_ar: 'موارد بشرية وتمويل متقدم', desc_en: 'Track cashbook, payroll, staff attendance, and mistakes with automated deductions.', desc_ar: 'تتبع دفتر النقدية والرواتب وحضور الموظفين والأخطاء مع الخصومات التلقائية.' },
    { icon: '🌍', title_en: 'Multi-Agency SaaS', title_ar: 'نظام متعدد الوكالات', desc_en: 'Role-based access for Accountants, HR, and Sales. 100% data isolation between agencies.', desc_ar: 'وصول قائم على الأدوار للمحاسبين والموارد البشرية والمبيعات. عزل البيانات بنسبة 100%.' },
    { icon: '📱', title_en: 'WhatsApp & QR Integration', title_ar: 'واتساب ورمز QR', desc_en: 'Directly send invoices via WhatsApp or let customers scan QR to download PDFs.', desc_ar: 'أرسل الفواتير مباشرة عبر واتساب أو دع العملاء يمسحون رمز QR لتنزيل ملفات PDF.' }
  ];

  const plans = [
    { name_en: 'Starter', name_ar: 'المبتدئ', price: '199', desc_en: 'Single Branch, Up to 3 Users', desc_ar: 'فرع واحد، حتى 3 مستخدمين', features_en: ['Invoicing & Refunds', 'Customer Management', 'Basic Reports'], features_ar: ['الفوترة والاسترجاعات', 'إدارة العملاء', 'تقارير أساسية'] },
    { name_en: 'Professional', name_ar: 'الاحترافي', price: '499', desc_en: 'Multi-Branch, Up to 10 Users', desc_ar: 'متعدد الفروع، حتى 10 مستخدمين', features_en: ['All Starter Features', 'HR & Payroll System', 'Advanced Finance & Cashbook', 'AI Dashboard'], features_ar: ['جميع ميزات المبتدئ', 'نظام الموارد البشرية والرواتب', 'التمويل المتقدم ودفتر النقدية', 'لوحة الذكاء الاصطناعي'], popular: true },
    { name_en: 'Enterprise', name_ar: 'المؤسسات', price: '999', desc_en: 'Unlimited Branches & Users', desc_ar: 'فروع ومستخدمون غير محدودين', features_en: ['All Professional Features', 'Multi-Branch Management', 'Custom Contract Generator', 'Dedicated Support'], features_ar: ['جميع ميزات الاحترافي', 'إدارة متعددة الفروع', 'مولد العقود المخصصة', 'دعم مخصص'] }
  ];

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: '#0F172A', color: '#fff', direction: isAr ? 'rtl' : 'ltr', margin: 0, padding: 0 }}>
      
      {/* Navbar */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 50px', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#F59E0B', margin: 0 }}>SUEUD AL TAAYIRA</h1>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <button onClick={() => setLang(isAr ? 'en' : 'ar')} style={{ padding: '8px 15px', background: 'transparent', border: '1px solid #F59E0B', color: '#F59E0B', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            🌐 {isAr ? 'English' : 'العربية'}
          </button>
          <button onClick={() => router.push('/')} style={{ padding: '8px 20px', background: '#F59E0B', color: '#0F172A', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            {t('Login', 'تسجيل الدخول')}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '100px 20px', background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)' }}>
        <h2 style={{ fontSize: '48px', fontWeight: '800', margin: '0 0 20px', color: '#FBBF24', lineHeight: 1.2, maxWidth: '900px' }}>
          {t('The Ultimate ERP for Travel & Tourism', 'نظام تخطيط موارد المؤسسات الأفضل للسفر والسياحة')}
        </h2>
        <p style={{ fontSize: '18px', color: '#94A3B8', maxWidth: '800px', margin: '0 0 40px', lineHeight: 1.6 }}>
          {t('Manage invoices, automate HR, track cashbook, and generate bilingual PDFs with QR codes. Built for modern travel agencies.', 'إدارة الفواتير، أتمتة الموارد البشرية، تتبع دفتر النقدية، وإنشاء ملفات PDF ثنائية اللغة مع رموز QR. مصمم لوكالات السفر الحديثة.')}
        </p>
        <div style={{ display: 'flex', gap: '20px' }}>
          <button onClick={() => router.push('/')} style={{ padding: '15px 40px', background: 'linear-gradient(135deg, #F59E0B, #D97706)', color: '#0F172A', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold', boxShadow: '0 10px 20px rgba(245, 158, 11, 0.3)' }}>
            🚀 {t('Get Started Now', 'ابدأ الآن')}
          </button>
          <button onClick={() => router.push('/landing')} style={{ padding: '15px 40px', background: 'transparent', color: '#fff', border: '1px solid #fff', borderRadius: '12px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' }}>
            {t('Live Demo', 'تجربة حية')}
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 50px', background: '#0F172A' }}>
        <h3 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '60px', color: '#fff' }}>
          {t('Why Choose Us?', 'لماذا تختارنا؟')}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: '#1E293B', padding: '30px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', transition: 'transform 0.3s' }}>
              <div style={{ fontSize: '40px', marginBottom: '20px' }}>{f.icon}</div>
              <h4 style={{ fontSize: '20px', fontWeight: '700', color: '#FBBF24', marginBottom: '15px' }}>{t(f.title_en, f.title_ar)}</h4>
              <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: 1.6 }}>{t(f.desc_en, f.desc_ar)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section style={{ padding: '80px 50px', background: '#1E293B' }}>
        <h3 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '60px', color: '#fff' }}>
          {t('Simple, Transparent Pricing', 'أسعار بسيطة وشفافة')}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
          {plans.map((p, i) => (
            <div key={i} style={{ background: '#0F172A', padding: '40px', borderRadius: '16px', border: p.popular ? '2px solid #F59E0B' : '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
              {p.popular && (
                <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: '#F59E0B', color: '#0F172A', padding: '5px 15px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                  {t('MOST POPULAR', 'الأكثر شيوعاً')}
                </div>
              )}
              <h4 style={{ fontSize: '24px', color: '#fff', marginBottom: '10px' }}>{t(p.name_en, p.name_ar)}</h4>
              <p style={{ fontSize: '36px', fontWeight: '800', color: '#FBBF24', margin: '20px 0' }}>
                {p.price} <span style={{ fontSize: '16px', color: '#94A3B8' }}>SAR/mo</span>
              </p>
              <p style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '30px' }}>{t(p.desc_en, p.desc_ar)}</p>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '30px' }}>
                {p.features_en.map((feat, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', fontSize: '14px', color: '#CBD5E1' }}>
                    <span style={{ color: '#059669', fontWeight: 'bold' }}>✓</span> {t(feat, p.features_ar[idx])}
                  </li>
                ))}
              </ul>
              <button onClick={() => router.push('/')} style={{ width: '100%', padding: '12px', background: p.popular ? '#F59E0B' : 'transparent', color: p.popular ? '#0F172A' : '#F59E0B', border: p.popular ? 'none' : '1px solid #F59E0B', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
                {t('Start Free Trial', 'ابدأ تجربة مجانية')}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '40px 50px', textAlign: 'center', background: '#0F172A', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <p style={{ color: '#64748B', fontSize: '14px' }}>© 2024 SUEUD AL TAAYIRA ERP. {t('All rights reserved.', 'جميع الحقوق محفوظة.')}</p>
      </footer>
    </div>
  );
}
