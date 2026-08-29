'use client';
import React from 'react';

// Wraps the page content. If ANYTHING inside throws during render (the
// "white screen + Application error" the console showed), this catches
// it and shows a recoverable screen with the real error message instead
// of a blank page — and a one-click way back to the Dashboard without a
// full reload losing their session.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ERP] Caught render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      const isAr = this.props.lang === 'ar';
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#0F172A', color: '#E2E8F0', fontFamily: 'sans-serif', padding: '20px'
        }}>
          <div style={{ maxWidth: '520px', textAlign: 'center', background: '#1E293B', padding: '40px', borderRadius: '16px', border: '1px solid #334155' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>⚠️</div>
            <h2 style={{ color: '#FBBF24', marginBottom: '10px' }}>
              {isAr ? 'حدث خطأ في هذه الصفحة' : 'This page hit an error'}
            </h2>
            <p style={{ color: '#94A3B8', fontSize: '13px', marginBottom: '20px', wordBreak: 'break-word' }}>
              {this.state.error?.message || (isAr ? 'خطأ غير معروف' : 'Unknown error')}
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={() => { this.setState({ hasError: false, error: null }); this.props.onReset?.(); }}
                style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
              >
                {isAr ? 'العودة للوحة التحكم' : '← Back to Dashboard'}
              </button>
              <button
                onClick={() => window.location.reload()}
                style={{ padding: '10px 20px', background: 'transparent', color: '#94A3B8', border: '1px solid #475569', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
              >
                {isAr ? 'إعادة تحميل الصفحة' : 'Reload Page'}
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
