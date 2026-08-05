import { NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME, createSessionToken, sessionCookieOptions } from '@/lib/adminAuth';

export async function POST(request) {
  const { password } = await request.json();

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: 'ADMIN_PASSWORD is not configured on the server. See README.md.' },
      { status: 500 }
    );
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
  }

  const token = await createSessionToken();
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE_NAME, token, sessionCookieOptions);
  return res;
}
