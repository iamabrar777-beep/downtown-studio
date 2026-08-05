// ADMIN client — SERVER-SIDE ONLY. Never import this file into a
// component that runs in the browser ('use client').
//
// It uses the SERVICE ROLE key, which bypasses Row Level Security
// entirely. This is intentional and safe ONLY because every API
// route that uses this file first checks the admin session cookie
// (see lib/adminAuth.js) before doing anything with it.
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.warn(
    '[supabaseAdmin] NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set. ' +
    'Admin features will not work until these are added to .env.local — see README.md.'
  );
}

export const supabaseAdmin = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  serviceRoleKey || 'placeholder-service-role-key',
  { auth: { persistSession: false } }
);
