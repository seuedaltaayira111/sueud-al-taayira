import './globals.css'

export const metadata = {
  title: 'SUEUD AL TAAYIRA ERP',
  description: 'Advanced Travel & Tourism ERP System',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
