// Simple, dependency-free admin session handling — built on the Web
// Crypto API (globalThis.crypto.subtle) rather than Node's 'crypto'
// module, because Next.js middleware runs in the Edge Runtime, which
// does not support Node built-ins. Web Crypto works in both Edge and
// Node, so this file is safe to import from middleware.js AND from
// regular API routes.
//
// How it works:
// 1. Admin enters ADMIN_PASSWORD on /admin/login
// 2. If correct, the server creates a signed token (timestamp + HMAC
//    signature using a secret only the server knows) and stores it
//    in an httpOnly cookie. httpOnly means client-side JavaScript
//    can never read or steal this cookie.
// 3. Every admin route (via middleware.js) calls verifySessionToken()
//    to check the cookie is present and its signature is valid before
//    allowing any product/order changes.
export const ADMIN_COOKIE_NAME = 'ds_admin_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error(
      'ADMIN_SESSION_SECRET is not set in your environment variables. See README.md.'
    );
  }
  return secret;
}

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function fromHex(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

async function hmacSha256Hex(message) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return toHex(signature);
}

function timingSafeEqualHex(aHex, bHex) {
  const a = fromHex(aHex);
  const b = fromHex(bHex);
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function createSessionToken() {
  const issuedAt = Date.now().toString();
  const signature = await hmacSha256Hex(issuedAt);
  return `${issuedAt}.${signature}`;
}

export async function verifySessionToken(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return false;
  const [issuedAt, signature] = token.split('.');
  if (!issuedAt || !signature) return false;

  const expected = await hmacSha256Hex(issuedAt);
  if (!timingSafeEqualHex(signature, expected)) return false;

  const ageSeconds = (Date.now() - Number(issuedAt)) / 1000;
  return ageSeconds <= SESSION_MAX_AGE_SECONDS;
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: SESSION_MAX_AGE_SECONDS
};
