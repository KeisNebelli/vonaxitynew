export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'sq' }];
}

export async function generateMetadata({ params }) {
  const isSq = params.lang === 'sq';
  return {
    title: isSq
      ? 'Vonaxity — Kujdes Infermierësh në Shtëpi'
      : 'Vonaxity — Home Nurse Visits in Albania',
    description: isSq
      ? 'Vizita profesionale infermierësh në shtëpi nëpër Shqipëri.'
      : 'Professional nurse home visits across Albania. Book from anywhere.',
  };
}

export default function LangLayout({ children, params }) {
  return (
    <html lang={params.lang}>
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
