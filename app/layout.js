// Isse Vercel page ko static banane ki koshish nahi karega
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Sueud Al Taayira ERP',
  description: 'Travel and Tourism ERP System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, boxSizing: 'border-box', fontFamily: 'Poppins, sans-serif', background: '#F1F5F9' }}>
        {children}
      </body>
    </html>
  );
}
