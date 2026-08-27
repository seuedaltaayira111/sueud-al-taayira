'use client';

import React, { useState } from 'react';

export default function ERPViewsTools(props) {
  const { page, tr, lang, theme } = props;
  const isAr = lang === 'ar';
  const isDark = theme === 'dark';

  // ===== STYLES =====
  const styles = {
    container: {
      padding: '20px',
      background: isDark ? '#0F172A' : '#F8FAFC',
      minHeight: '100vh',
      color: isDark ? '#E2E8F0' : '#1E293B',
      transition: 'all 0.3s ease'
    },
    card: {
      background: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '20px',
      border: isDark ? '1px solid #334155' : '1px solid #E2E8F0',
      boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 6px rgba(0,0,0,0.05)'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      flexWrap: 'wrap',
      gap: '10px'
    },
    title: {
      fontSize: '24px',
      fontWeight: 700,
      color: '#FBBF24',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      margin: 0
    },
    input: {
      padding: '10px 15px',
      background: isDark ? '#0F172A' : '#F1F5F9',
      border: isDark ? '1px solid #475569' : '1px solid #E2E8F0',
      borderRadius: '8px',
      color: isDark ? '#E2E8F0' : '#1E293B',
      fontSize: '14px',
      outline: 'none',
      width: '100%',
      boxSizing: 'border-box',
      transition: 'all 0.2s'
    },
    select: {
      padding: '10px 15px',
      background: isDark ? '#0F172A' : '#F1F5F9',
      border: isDark ? '1px solid #475569' : '1px solid #E2E8F0',
      borderRadius: '8px',
      color: isDark ? '#E2E8F0' : '#1E293B',
      fontSize: '14px',
      outline: 'none',
      width: '100%',
      boxSizing: 'border-box'
    },
    btn: {
      padding: '10px 20px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 600,
      fontSize: '13px',
      transition: 'all 0.2s'
    },
    btnPrimary: {
      background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
      color: '#fff'
    },
    btnSuccess: {
      background: 'linear-gradient(135deg, #059669, #047857)',
      color: '#fff'
    },
    btnDanger: {
      background: 'linear-gradient(135deg, #DC2626, #B91C1C)',
      color: '#fff'
    },
    btnWarning: {
      background: 'linear-gradient(135deg, #F59E0B, #D97706)',
      color: '#0F172A'
    },
    btnGhost: {
      background: 'transparent',
      border: isDark ? '1px solid #475569' : '1px solid #E2E8F0',
      color: isDark ? '#94A3B8' : '#64748B'
    },
    btnInfo: {
      background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
      color: '#fff'
    },
    formGroup: {
      marginBottom: '15px'
    },
    formLabel: {
      display: 'block',
      marginBottom: '5px',
      color: isDark ? '#94A3B8' : '#64748B',
      fontSize: '13px',
      fontWeight: 600
    },
    formRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px'
    },
    sectionTitle: {
      color: '#FBBF24',
      fontSize: '15px',
      fontWeight: 700,
      margin: '0 0 15px',
      paddingBottom: '10px',
      borderBottom: isDark ? '1px solid #334155' : '1px solid #E2E8F0'
    },
    label: {
      fontSize: '13px',
      fontWeight: 600,
      color: isDark ? '#94A3B8' : '#64748B',
      marginBottom: '6px',
      display: 'block',
      marginTop: '12px'
    }
  };

  const fmt = (n) => (n || 0).toFixed(2) + ' SAR';

  // ============================================================
  // AI PRICING CALCULATOR
  // ============================================================
  if (page === 'ai_pricing') {
    const [cost, setCost] = useState(0);
    const [margin, setMargin] = useState(15);
    const [vatRate, setVatRate] = useState(15);

    const calculatePricing = () => {
      const c = parseFloat(cost) || 0;
      const m = parseFloat(margin) || 0;
      const v = parseFloat(vatRate) || 0;

      const suggestedSell = c / (1 - m / 100);
      const profit = suggestedSell - c;
      const vatAmount = suggestedSell * (v / 100);
      const finalTotal = suggestedSell + vatAmount;

      return { suggestedSell, profit, vatAmount, finalTotal };
    };

    const { suggestedSell, profit, vatAmount, finalTotal } = calculatePricing();

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>🤖 {isAr ? 'حاسبة التسعير الذكية' : 'AI Pricing Calculator'}</h1>
        </div>

        <div style={styles.card}>
          <p style={{ color: '#94A3B8', marginBottom: '20px', fontSize: '14px', lineHeight: '1.6' }}>
            {isAr
              ? 'أدخل سعر التكلفة والهامش المطلوب. سيقوم الذكاء الاصطناعي باقتراح سعر البيع الأمثل لتعظيم الربح مع الحفاظ على القدرة التنافسية.'
              : 'Enter your cost price and desired margin. The AI will suggest the optimal selling price to maximize profit while remaining competitive.'}
          </p>

          <div style={styles.formRow}>
            <div>
              <label style={styles.formLabel}>{isAr ? 'سعر التكلفة (ريال)' : 'Cost Price (SAR)'}</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={cost}
                onChange={e => setCost(e.target.value)}
                style={styles.input}
              />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'الهامش المطلوب (%)' : 'Desired Margin (%)'}</label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={margin}
                onChange={e => setMargin(e.target.value)}
                style={styles.input}
              />
            </div>
            <div>
              <label style={styles.formLabel}>{isAr ? 'نسبة الضريبة (%)' : 'VAT Rate (%)'}</label>
              <input
                type="number"
                step="1"
                min="0"
                max="100"
                value={vatRate}
                onChange={e => setVatRate(e.target.value)}
                style={styles.input}
              />
            </div>
          </div>

          <div style={{
            marginTop: '20px',
            background: isDark ? '#0F172A' : '#F1F5F9',
            padding: '24px',
            borderRadius: '12px',
            border: isDark ? '1px solid #334155' : '1px solid #E2E8F0'
          }}>
            <h4 style={{ margin: '0 0 15px', color: '#FBBF24' }}>
              {isAr ? 'استراتيجية التسعير المقترحة' : 'Suggested Pricing Strategy'}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <p style={{ margin: '5px 0', fontSize: '16px' }}>
                  <strong>{isAr ? 'سعر البيع المقترح' : 'Suggested Sell Price'}:</strong>
                  <span style={{ color: '#34D399', fontWeight: 'bold', fontSize: '20px', marginLeft: '8px' }}>
                    {fmt(suggestedSell)}
                  </span>
                </p>
                <p style={{ margin: '5px 0', fontSize: '14px' }}>
                  <strong>{isAr ? 'الربح المتوقع' : 'Expected Profit'}:</strong>
                  <span style={{ color: '#34D399', marginLeft: '8px' }}>
                    {fmt(profit)}
                  </span>
                </p>
              </div>
              <div>
                <p style={{ margin: '5px 0', fontSize: '14px' }}>
                  <strong>{isAr ? 'قيمة الضريبة' : 'VAT Amount'}:</strong>
                  <span style={{ color: '#FCA5A5', marginLeft: '8px' }}>
                    {fmt(vatAmount)}
                  </span>
                </p>
                <p style={{ margin: '5px 0', fontSize: '16px' }}>
                  <strong>{isAr ? 'إجمالي الفاتورة النهائي' : 'Final Invoice Total'}:</strong>
                  <span style={{ color: '#FBBF24', fontWeight: 'bold', fontSize: '20px', marginLeft: '8px' }}>
                    {fmt(finalTotal)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              style={{ ...styles.btn, ...styles.btnSuccess }}
              onClick={() => {
                if (suggestedSell > 0) {
                  navigator.clipboard?.writeText(suggestedSell.toFixed(2));
                  showToast?.(isAr ? '✅ تم نسخ السعر!' : '✅ Price copied!');
                }
              }}
            >
              📋 {isAr ? 'نسخ السعر' : 'Copy Price'}
            </button>
            <button
              style={{ ...styles.btn, ...styles.btnInfo }}
              onClick={() => {
                setCost(0);
                setMargin(15);
                setVatRate(15);
              }}
            >
              🔄 {isAr ? 'إعادة تعيين' : 'Reset'}
            </button>
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>💡 {isAr ? 'نصائح التسعير' : 'Pricing Tips'}</h3>
          <ul style={{ color: '#94A3B8', fontSize: '14px', lineHeight: '2', paddingInlineStart: '20px' }}>
            <li>{isAr ? 'الهامش المثالي للوكالات السياحية هو 10-20%' : 'Ideal margin for travel agencies is 10-20%'}</li>
            <li>{isAr ? 'ضع في اعتبارك تكاليف التشغيل عند تحديد السعر' : 'Consider operational costs when setting price'}</li>
            <li>{isAr ? 'راقب أسعار المنافسين بانتظام' : 'Regularly monitor competitor pricing'}</li>
            <li>{isAr ? 'الخصومات الموسمية يمكن أن تزيد من حجم المبيعات' : 'Seasonal discounts can boost sales volume'}</li>
            <li>{isAr ? 'استخدم التسعير الديناميكي للرحلات ذات الطلب المرتفع' : 'Use dynamic pricing for high-demand flights'}</li>
          </ul>
        </div>
      </div>
    );
  }

  return null;
}
