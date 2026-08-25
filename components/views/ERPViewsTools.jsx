'use client';
import React, { useState } from 'react';

const styles = { 
  container: { padding: '24px', background: '#0A0F1C', minHeight: '100vh', color: '#E2E8F0' },
  card: { background: '#1E293B', padding: '28px', borderRadius: '16px', marginBottom: '20px', border: '1px solid #334155' },
  headerGradient: { background: 'linear-gradient(135deg, #7C3AED, #6D28D9)', color: 'white', padding: '30px', borderRadius: '16px', marginBottom: '24px', boxShadow: '0 10px 30px rgba(124, 58, 237, 0.2)' },
  input: { width: '100%', padding: '14px 18px', margin: '8px 0', background: '#0F172A', border: '1px solid #475569', borderRadius: '10px', outline: 'none', boxSizing: 'border-box', fontSize: '15px', color: '#E2E8F0', ':focus': { borderColor: '#A78BFA' } }, 
  label: { fontSize: '12px', fontWeight: '700', color: '#94A3B8', marginBottom: '8px', display: 'block', marginTop: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  resultBox: { background: '#0F172A', padding: '24px', borderRadius: '12px', border: '1px solid #334155', marginTop: '24px' },
  resultRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #1E293B' },
  resultLabel: { color: '#94A3B8', fontSize: '14px' },
  resultValue: { fontSize: '18px', fontWeight: '700' }
};

export default function ERPViewsTools(props) {
  const { page, tr, lang } = props;
  const t = (key, fallback) => tr?.[key] || fallback || key;
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

  if (page === 'ai_pricing') {
    return (
      <div style={styles.container}>
        <div style={styles.headerGradient}>
          <h2 style={{ margin: 0, fontSize: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '28px' }}>🤖</span>
            {t('aiPricing', 'AI Pricing Calculator')}
          </h2>
          <p style={{ margin: '8px 0 0', opacity: 0.9, fontSize: '14px' }}>{t('aiPricingDesc', 'Enter your cost price and desired margin. The AI will suggest the optimal selling price.')}</p>
        </div>
        
        <div style={styles.card}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            <div>
              <label style={styles.label}>{t('costPrice', 'Cost Price (SAR)')}</label>
              <input type="number" step="0.01" value={cost} onChange={e => setCost(e.target.value)} style={styles.input} />
            </div>
            <div>
              <label style={styles.label}>{t('desiredMargin', 'Desired Margin (%)')}</label>
              <input type="number" step="1" value={margin} onChange={e => setMargin(e.target.value)} style={styles.input} />
            </div>
            <div>
              <label style={styles.label}>{t('vatRatePct', 'VAT Rate (%)')}</label>
              <input type="number" step="1" value={vatRate} onChange={e => setVatRate(e.target.value)} style={styles.input} />
            </div>
          </div>
          
          <div style={styles.resultBox}>
            <h4 style={{ margin: '0 0 16px', color: '#A78BFA', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {t('suggestedStrategy', 'Suggested Pricing Strategy')}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{...styles.resultRow, borderBottom: 'none' }}>
                <span style={styles.resultLabel}>{t('suggestedSellPrice', 'Suggested Sell Price')}</span>
                <span style={{ ...styles.resultValue, color: '#34D399', fontSize: '24px' }}>{suggestedSell.toFixed(2)} SAR</span>
              </div>
              <div style={{...styles.resultRow, borderBottom: 'none' }}>
                <span style={styles.resultLabel}>{t('expectedProfit', 'Expected Profit')}</span>
                <span style={{ ...styles.resultValue, color: '#34D399' }}>{profit.toFixed(2)} SAR</span>
              </div>
              <div style={styles.resultRow}>
                <span style={styles.resultLabel}>{t('vatAmount', 'VAT Amount')}</span>
                <span style={{ ...styles.resultValue, color: '#FCA5A5' }}>{vatAmount.toFixed(2)} SAR</span>
              </div>
              <div style={styles.resultRow}>
                <span style={styles.resultLabel}>{t('finalInvoiceTotal', 'Final Invoice Total')}</span>
                <span style={{ ...styles.resultValue, color: '#A78BFA', fontSize: '20px' }}>{finalTotal.toFixed(2)} SAR</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
