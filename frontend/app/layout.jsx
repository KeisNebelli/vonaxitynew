import CookieBanner from '@/components/CookieBanner';
import { Suspense } from 'react';

export const metadata = {
  title: 'Vonaxity — Home Nurse Visits in Albania',
  description: 'Professional nurse home visits across Albania. Book from anywhere in the world.',
  keywords: 'home nurse Albania, nurse visits Tirana, healthcare Albania diaspora, home care Albania',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'Vonaxity — Home Nurse Visits in Albania',
    description: 'Professional nurse home visits across Albania. Book from anywhere in the world.',
    url: 'https://vonaxity.com',
    siteName: 'Vonaxity',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vonaxity — Home Nurse Visits in Albania',
    description: 'Professional nurse home visits across Albania.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <style>{`
          *, *::before, *::after { box-sizing: border-box; }
          body { margin: 0; font-family: 'Inter', system-ui, -apple-system, sans-serif; background: #FAFAF9; color: #111827; -webkit-font-smoothing: antialiased; }
          a { text-decoration: none; color: inherit; }
          button { font-family: inherit; }
          input, textarea, select { font-family: inherit; }
          h1,h2,h3,h4,h5,h6 { letter-spacing: -0.025em; }
          img { max-width: 100%; height: auto; }
          @media (max-width: 640px) {
            section { padding-left: 16px !important; padding-right: 16px !important; }
          }
        `}</style>
      </head>
      <body>
        {children}
        <Suspense fallback={null}><CookieBanner /></Suspense>
      </body>
    </html>
  );
}
