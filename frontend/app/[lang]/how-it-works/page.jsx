import { redirect } from 'next/navigation';

export default function HowItWorksPage({ params }) {
  const lang = params?.lang || 'en';
  redirect(`/${lang}#how-it-works`);
}
