import './globals.css';

export const metadata = {
  title: 'SUEUD AL TAAYIRA | Travel ERP System',
  description: 'Advanced Travel & Tourism Agency ERP System - Manage invoices, customers, flights, hotels, visas, and more.',
  icons: {
    icon: '/favicon.ico',
  },
  keywords: 'travel agency, erp, tourism, flight booking, hotel booking, visa processing, hajj, umrah, corporate travel, travel management',
  authors: [{ name: 'SUEUD AL TAAYIRA' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#1E3A8A',
  colorScheme: 'light dark',
  openGraph: {
    title: 'SUEUD AL TAAYIRA | Travel ERP System',
    description: 'Advanced Travel & Tourism Agency ERP System',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SUEUD AL TAAYIRA | Travel ERP System',
    description: 'Advanced Travel & Tourism Agency ERP System',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&family=Tajawal:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="robots" content="index, follow" />
      </head>
      <body>{children}</body>
    </html>
  );
}
