'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getInvoiceHTML, getRefundHTML } from '@/lib/invoiceHTML';

// This page is what a scanned invoice QR code actually opens
// (https://sueud-al-taayira.vercel.app/invoice/<invoice_no>). It
// previously had its own separate, outdated copy of the invoice
// template — completely disconnected from lib/invoiceHTML.js — which
// meant every fix made to the real invoice/refund templates (barcode
// size, blank-page bug, hiding the internal refund margin from
// customers, etc.) never reached what people actually see when they
// scan the QR code. This version reuses the same shared, fixed
// templates so this page and the in-app download always match, and
// adds proper handling for a refund invoice, a missing invoice, and a
// cancelled/voided one instead of spinning on "Loading..." forever.

export default function PublicInvoicePage({ params }) {
  const { id } = params;
  const [status, setStatus] = useState('loading'); // loading | ok | not_found | error
  const [htmlContent, setHtmlContent] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchInv = async () => {
      if (!id) { setStatus('not_found'); return; }
      try {
        const { data, error } = await supabase
          .from('invoices')
          .select('*, customers(name, phone), corporates(name, vat_no, phone), employees(name, phone)')
          .eq('invoice_no', id)
          .maybeSingle();
        if (error || !data) { setStatus('not_found'); return; }

        const { data: sData } = await supabase
          .from('settings')
          .select('*')
          .eq('tenant_id', data.tenant_id)
          .maybeSingle();

        const isRefund = data.invoice_no?.startsWith('REF-');
        const html = isRefund
          ? getRefundHTML(data, sData || {}, 'en')
          : getInvoiceHTML(data, sData || {}, 'en');
        setHtmlContent(html);
        setStatus('ok');
      } catch (e) {
        console.error('Invoice lookup failed:', e);
        setStatus('error');
      }
    };
    fetchInv();
  }, [id]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const A4_PX_W = 794;
      const div = document.createElement('div');
      div.style.cssText = `position:absolute;left:-9999px;top:0;width:${A4_PX_W}px;background:white;`;

      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');

      // Pre-convert the QR/barcode to base64 — left as live external
      // image URLs, they're prone to being silently dropped by
      // html2canvas (no CORS headers) which is exactly why the QR
      // code wasn't showing up in downloads from this page before.
      const imgs = doc.querySelectorAll('img[src*="api.qrserver.com"], img[src*="bwipjs-api"]');
      await Promise.all(Array.from(imgs).map(async (img) => {
        try {
          const resp = await fetch(img.src);
          const blob = await resp.blob();
          const b64 = await new Promise(r => {
            const fr = new FileReader();
            fr.onloadend = () => r(fr.result);
            fr.readAsDataURL(blob);
          });
          img.src = b64;
        } catch (e) { console.warn('Code image fetch skipped:', e.message); }
      }));

      // Carry the <style>/font <link> tags from <head> into the capture
      // container — this was the root cause of documents downloading
      // completely unstyled elsewhere in the app, so it's fixed here
      // the same way.
      const headStyles = Array.from(doc.querySelectorAll('style')).map(s => s.outerHTML).join('\n');
      const headFontLinks = Array.from(doc.querySelectorAll('link[rel="stylesheet"]')).map(l => l.outerHTML).join('\n');
      div.innerHTML = headFontLinks + headStyles + doc.body.innerHTML;
      document.body.appendChild(div);

      const allImgs = div.querySelectorAll('img');
      await Promise.all(Array.from(allImgs).map(img => img.complete ? Promise.resolve() : new Promise(r => { img.onload = img.onerror = r; })));
      await new Promise(r => setTimeout(r, 400));

      const canvas = await html2canvas(div, {
        scale: 2, useCORS: true, allowTaint: true, backgroundColor: '#ffffff',
        windowWidth: A4_PX_W, windowHeight: Math.max(1123, div.scrollHeight)
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const w = 210, ph = 297, h = (canvas.height * w) / canvas.width;
      // Same 2mm tolerance fix as the in-app downloader — without it,
      // a document that's genuinely one page still generated a mostly
      // blank second page every time.
      const TOLERANCE = 2;
      let left = h - ph, pos = 0;
      pdf.addImage(imgData, 'PNG', 0, pos, w, h);
      left -= ph;
      while (left > TOLERANCE) {
        pos = left - h;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, pos, w, h);
        left -= ph;
      }
      pdf.save(`${id}.pdf`);
      document.body.removeChild(div);
    } catch (err) {
      console.error('PDF Error:', err);
      alert('Could not generate PDF: ' + err.message);
    } finally {
      setDownloading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div style={{ padding: 60, textAlign: 'center', fontFamily: 'sans-serif', color: '#64748B' }}>
        Loading Invoice…
      </div>
    );
  }

  if (status === 'not_found') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F172A', color: '#E2E8F0', fontFamily: 'sans-serif', padding: 20 }}>
        <div style={{ textAlign: 'center', maxWidth: 420 }}>
          <div style={{ fontSize: 48, marginBottom: 15 }}>🔍</div>
          <h2 style={{ color: '#FBBF24', marginBottom: 10 }}>Invoice Not Found</h2>
          <p style={{ color: '#94A3B8', fontSize: 14 }}>
            This invoice reference could not be found. It may have been
            deleted, or the link may be incorrect.
          </p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F172A', color: '#E2E8F0', fontFamily: 'sans-serif', padding: 20 }}>
        <div style={{ textAlign: 'center', maxWidth: 420 }}>
          <div style={{ fontSize: 48, marginBottom: 15 }}>⚠️</div>
          <h2 style={{ color: '#FBBF24', marginBottom: 10 }}>Something Went Wrong</h2>
          <p style={{ color: '#94A3B8', fontSize: 14 }}>Please try scanning the code again.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f1f5f9', minHeight: '100vh', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: "'Poppins', sans-serif" }}>
      <button
        onClick={handleDownload}
        disabled={downloading}
        style={{ padding: '15px 30px', background: 'linear-gradient(135deg, #1E3A8A, #2563EB)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '20px', fontSize: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
      >
        {downloading ? '⏳ Generating PDF...' : '📄 Download PDF'}
      </button>
      <div id="printable-invoice" dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
}
