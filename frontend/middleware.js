import { NextResponse } from 'next/server';

const LOCALES = ['en', 'sq'];
const DEFAULT_LOCALE = 'en';

const ROLE_ROUTES = {
  '/en/admin': ['ADMIN'],
  '/sq/admin': ['ADMIN'],
  '/en/nurse': ['NURSE', 'ADMIN'],
  '/sq/nurse': ['NURSE', 'ADMIN'],
  '/en/dashboard': ['CLIENT', 'ADMIN'],
  '/sq/dashboard': ['CLIENT', 'ADMIN'],
};

// Public routes — never redirect to login
const PUBLIC_ROUTES = [
  '/en/nurses', '/sq/nurses',
  '/en/login', '/sq/login',
  '/en/signup', '/sq/signup',
  '/en/nurse-signup', '/sq/nurse-signup',
  '/en/about', '/sq/about',
  '/en/services', '/sq/services',
  '/en/pricing', '/sq/pricing',
  '/en/how-it-works', '/sq/how-it-works',
  '/en/faq', '/sq/faq',
  '/en/contact', '/sq/contact',
];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Language redirect
  const hasLocale = LOCALES.some(
    (l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`
  );

  if (!hasLocale) {
    const cookieLang = request.cookies.get('vonaxity-locale')?.value;
    const lang = LOCALES.includes(cookieLang) ? cookieLang : DEFAULT_LOCALE;
    return NextResponse.redirect(new URL(`/${lang}${pathname}`, request.url));
  }

  // Auth guard — skip for public routes
  const isPublic = PUBLIC_ROUTES.some(r => pathname.startsWith(r));
  if (isPublic) return NextResponse.next();

  const protectedRoute = Object.keys(ROLE_ROUTES).find((r) =>
    pathname.startsWith(r)
  );

  if (protectedRoute) {
    const token = request.cookies.get('vonaxity-token')?.value;
    const role = request.cookies.get('vonaxity-role')?.value;
    const lang = pathname.split('/')[1] || DEFAULT_LOCALE;

    if (!token) {
      return NextResponse.redirect(
        new URL(`/${lang}/login?redirect=${encodeURIComponent(pathname)}`, request.url)
      );
    }

    const allowed = ROLE_ROUTES[protectedRoute];
    if (role && !allowed.includes(role)) {
      const redirectMap = {
        CLIENT: `/${lang}/dashboard`,
        NURSE: `/${lang}/nurse`,
        ADMIN: `/${lang}/admin`,
      };
      return NextResponse.redirect(
        new URL(redirectMap[role] || `/${lang}`, request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
