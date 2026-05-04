export const dynamic = 'force-dynamic';

export async function GET() {
  const BASE = process.env.NEXT_PUBLIC_API_URL || 'https://vonaxitynew-production.up.railway.app';
  try {
    const res = await fetch(`${BASE}/settings/public`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      return Response.json(data);
    }
  } catch {}
  return Response.json({
    basicPrice: 30, standardPrice: 50, premiumPrice: 120,
    basicVisits: 1, standardVisits: 2, premiumVisits: 4,
  });
}
