'use client';
import { useState, useEffect, useCallback } from 'react';
import { t, tStatus } from '@/translations';

export function useLang(paramLang) {
  const [lang, setLang] = useState(paramLang || 'en');

  useEffect(() => {
    // Read from cookie or localStorage on mount
    const saved = typeof window !== 'undefined'
      ? document.cookie.match(/vonaxity-locale=([^;]+)/)?.[1] || localStorage.getItem('vonaxity-lang')
      : null;
    if (saved === 'sq' || saved === 'en') setLang(saved);
    else if (paramLang) setLang(paramLang);
  }, [paramLang]);

  const switchLang = useCallback((newLang) => {
    setLang(newLang);
    document.cookie = `vonaxity-locale=${newLang};path=/;max-age=31536000`;
    localStorage.setItem('vonaxity-lang', newLang);
  }, []);

  const tr = useCallback((key) => t(lang, key), [lang]);
  const trStatus = useCallback((status) => tStatus(lang, status), [lang]);

  return { lang, switchLang, t: tr, tStatus: trStatus };
}

export default useLang;
