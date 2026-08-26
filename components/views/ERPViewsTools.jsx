'use client';

import React, { useState } from 'react';

const styles = { 
  input: { width: '100%', padding: '10px', margin: '5px 0', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' }, 
  btnPrimary: { padding: '10px 15px', background: '#1E3A8A', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }, 
  card: { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '20px', border: '1px solid #e2e8f0' }, 
  label: { fontSize: '14px', fontWeight: 'bold', color: '#333', marginBottom: '5px', display: 'block', marginTop: '10px' } 
};

export default function ERPViewsTools(props) {
  const { tr } = props;
  const [cost, setCost] = useState(0);
  const [margin, setMargin] = useState(15); // Default 15% margin
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

  // 1. AI PRICING CALCULATOR
  if (props.page === 'ai_pricing') {
    return (
      <div>
        <h2 style={{ color: '#1E3A8A' }}>🤖 AI Pricing Calculator</h2>
        <div style={styles.card}>
          <p style={{ color: '#64748b', marginBottom: '15px' }}>Enter your cost price and desired margin. The AI will suggest the optimal selling price to maximize profit while remaining competitive.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div>
              <label style={styles.label}>Cost Price (SAR)</label>
              <input type="number" step="0.01" value={cost} onChange={e => setCost(e.target.value)} style={styles.input} />
            </div>
            <div>
              <label style={styles.label}>Desired Margin (%)</label>
              <input type="number" step="1" value={margin} onChange={e => setMargin(e.target.value)} style={styles.input} />
            </div>
            <div>
              <label style={styles.label}>VAT Rate (%)</label>
              <input type="number" step="1" value={vatRate} onChange={e => setVatRate(e.target.value)} style={styles.input} />
            </div>
          </div>
          
          <div style={{ marginTop: '20px', background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <h4 style={{ margin: '0 0 15px', color: '#1E3A8A' }}>Suggested Pricing Strategy</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <p style={{ margin: '5px 0', fontSize: '16px' }}><strong>Suggested Sell Price:</strong> <span style={{ color: '#059669', fontWeight: 'bold', fontSize: '20px' }}>{suggestedSell.toFixed(2)} SAR</span></p>
                <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Expected Profit:</strong> <span style={{ color: '#059669' }}>{profit.toFixed(2)} SAR</span></p>
              </div>
              <div>
                <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>VAT Amount:</strong> <span style={{ color: '#EF4444' }}>{vatAmount.toFixed(2)} SAR</span></p>
                <p style={{ margin: '5px 0', fontSize: '16px' }}><strong>Final Invoice Total:</strong> <span style={{ color: '#1E3A8A', fontWeight: 'bold', fontSize: '20px' }}>{finalTotal.toFixed(2)} SAR</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
