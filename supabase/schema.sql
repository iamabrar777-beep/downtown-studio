-- ============================================================
-- DOWNTOWN STUDIO — SUPABASE DATABASE SCHEMA
-- Run this entire file once in: Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- Needed for gen_random_uuid()
create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- PRODUCTS TABLE
-- ------------------------------------------------------------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  price numeric not null,
  compare_at_price numeric,
  category text not null default 'uncategorized',
  description text default '',
  bullet_points text[] default array[]::text[],
  sizes text[] default array['S','M','L','XL'],
  images text[] default array[]::text[],
  stock integer not null default 10,
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- ORDERS TABLE
-- ------------------------------------------------------------
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  phone text not null,
  email text,
  address text not null,
  city text not null,
  district text,
  notes text,
  items jsonb not null,           -- [{ product_id, name, price, size, qty, image }]
  subtotal numeric not null,
  shipping numeric not null default 70,
  total numeric not null,
  payment_method text not null default 'cod',   -- cod | bkash | nagad
  payment_reference text,          -- bKash/Nagad transaction ID, if applicable
  status text not null default 'pending',        -- pending | confirmed | shipped | delivered | cancelled
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- ROW LEVEL SECURITY
-- Public (anon key, used by the storefront) can only READ products
-- and CREATE orders. All other writes (products CRUD, order status
-- updates) happen through server-side API routes using the
-- SERVICE ROLE key, which bypasses RLS and is never exposed to
-- the browser.
-- ------------------------------------------------------------
alter table products enable row level security;
alter table orders enable row level security;

drop policy if exists "Public can read products" on products;
create policy "Public can read products"
  on products for select
  using (true);

drop policy if exists "Public can create orders" on orders;
create policy "Public can create orders"
  on orders for insert
  with check (true);

-- ------------------------------------------------------------
-- STORAGE BUCKET FOR PRODUCT IMAGES
-- ------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can view product images" on storage.objects;
create policy "Public can view product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- ------------------------------------------------------------
-- SAMPLE PRODUCTS (safe to delete later from the Admin Dashboard)
-- ------------------------------------------------------------
insert into products (name, slug, price, category, description, bullet_points, sizes, images, stock, featured)
values
  (
    'Balanced Oversized Tee', 'balanced-oversized-tee', 850, 'Graphic',
    'Oversized boxy fit tee with a bold back print. Heavyweight cotton, drop shoulder.',
    array['100% COTTON', 'OVERSIZED BOXY FIT', 'DROP SHOULDER', 'GARMENT WASHED'],
    array['S','M','L','XL'],
    array[]::text[],
    12, true
  ),
  (
    'To Rastah Tee', 'to-rastah-tee', 800, 'Graphic',
    'Black oversized tee with a bold front script graphic. Relaxed streetwear fit.',
    array['100% COTTON', 'RELAXED FIT', 'SCREEN PRINTED GRAPHIC'],
    array['S','M','L','XL'],
    array[]::text[],
    10, false
  ),
  (
    'I Was Blind Tee', 'i-was-blind-tee', 850, 'Graphic',
    'Sky blue oversized tee with a hand-drawn eye graphic back print. Statement streetwear piece.',
    array['100% COTTON', 'OVERSIZED FIT', 'BACK PRINT GRAPHIC'],
    array['S','M','L','XL'],
    array[]::text[],
    8, true
  ),
  (
    'Fuel & Glory Tee', 'fuel-and-glory-tee', 900, 'Vintage',
    'Cream oversized tee with a vintage-style crest print on front and back. Retro wash finish.',
    array['100% COTTON', 'VINTAGE WASH', 'FRONT & BACK PRINT'],
    array['S','M','L','XL'],
    array[]::text[],
    9, false
  ),
  (
    'Vanguard Collective Tee', 'vanguard-collective-tee', 900, 'Vintage',
    'Cream oversized tee with a vintage collegiate-style crest back print.',
    array['100% COTTON', 'VINTAGE WASH', 'COLLEGIATE STYLE PRINT'],
    array['S','M','L','XL'],
    array[]::text[],
    10, false
  )
on conflict (slug) do nothing;
