export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'sq' }];
}

export async function generateMetadata({ params }) {
  return {
    title: params.lang === 'sq'
      ? 'Vonaxity — Kujdes Infermierësh në Shtëpi'
      : 'Vonaxity — Home Nurse Visits in Albania',
    description: params.lang === 'sq'
      ? 'Vizita profesionale infermierësh në shtëpi nëpër Shqipëri.'
      : 'Professional nurse home visits across Albania. Book from anywhere.',
  };
}

export default function LangLayout({ children }) {
  return <>{children}</>;
}
