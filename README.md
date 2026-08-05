# Downtown Studio — Full-Stack E-Commerce Store

A complete Next.js + Supabase e-commerce site: public storefront (shop grid,
sort/filter, product pages, cart, checkout with COD/bKash/Nagad) plus a
password-protected Admin Dashboard to manage products, images, stock, and
orders — no code editing required after setup.

---

## 1. What you need (all free tiers)

- A [Supabase](https://supabase.com) account — this is your database + image storage.
- A [Vercel](https://vercel.com) account — this hosts the live site.
- A [GitHub](https://github.com) account — Vercel deploys from a GitHub repo.

---

## 2. Set up Supabase (the database)

1. Go to [supabase.com](https://supabase.com) → **New Project**. Pick any name/region, set a database password (save it somewhere), and wait ~2 minutes for it to provision.
2. Once inside your project, go to **SQL Editor** (left sidebar) → **New query**.
3. Open `supabase/schema.sql` from this project, copy the **entire file**, paste it into the SQL Editor, and click **Run**.
   - This creates the `products` and `orders` tables, sets up security rules (RLS), creates a public `product-images` storage bucket, and inserts 5 sample products so the site isn't empty on first load.
4. Go to **Project Settings → API** (left sidebar, gear icon). You'll need three values from this page in the next step:
   - **Project URL** → this is `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → this is `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** key → this is `SUPABASE_SERVICE_ROLE_KEY` (click "reveal" to see it). **Keep this one private — never share it or put it in a public repo.**

---

## 3. Run it locally first (recommended before deploying)

1. Make sure [Node.js](https://nodejs.org) (v18 or later) is installed on your computer.
2. In this project folder, copy the example env file:
   ```
   cp .env.local.example .env.local
   ```
3. Open `.env.local` and fill in the 3 Supabase values from Step 2, plus:
   - `ADMIN_PASSWORD` — pick any password you'll use to log into `/admin`.
   - `ADMIN_SESSION_SECRET` — any long random string (visit https://generate-secret.vercel.app/32 to generate one).
4. Install dependencies and start the dev server:
   ```
   npm install
   npm run dev
   ```
5. Open **http://localhost:3000** — you should see the storefront with the 5 sample products.
6. Open **http://localhost:3000/admin/login** and log in with your `ADMIN_PASSWORD` to reach the dashboard, where you can add/edit/delete products and view orders.

If everything works locally, you're ready to deploy.

---

## 4. Deploy to Vercel (make it live on the internet)

1. Push this project to a new **GitHub repository** (Vercel deploys from GitHub).
   - Easiest way: create a new empty repo on github.com, then in this project folder run:
     ```
     git init
     git add .
     git commit -m "Initial commit"
     git branch -M main
     git remote add origin <your-new-repo-url>
     git push -u origin main
     ```
2. Go to [vercel.com/new](https://vercel.com/new), sign in with GitHub, and **Import** the repository you just pushed.
3. Vercel will auto-detect Next.js. Before clicking Deploy, open **Environment Variables** and add the same 5 values from your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PASSWORD`
   - `ADMIN_SESSION_SECRET`
4. Click **Deploy**. After ~1-2 minutes you'll get a live URL like `downtown-studio.vercel.app`.
5. Visit `<your-url>/admin/login` to manage products and orders from anywhere, on any device — since the data lives in Supabase (not localStorage), changes made in the admin dashboard show up immediately for every visitor, on every device.

### Using your own domain (optional)
In Vercel, go to your project → **Settings → Domains** → add your domain (e.g. `downtownstudio.com`) and follow the DNS instructions Vercel gives you. This is optional and can be added anytime later.

---

## 5. Before you tell the client it's ready

- [ ] Replace the 5 sample products in `/admin/dashboard` with their real products and photos.
- [ ] Open `app/checkout/page.jsx` and replace `BKASH_NUMBER` / `NAGAD_NUMBER` placeholders near the top of the file with the real merchant/personal numbers, then redeploy (push to GitHub again — Vercel auto-redeploys on every push).
- [ ] Log into `/admin/dashboard` yourself and place a real test order end-to-end to confirm bKash/Nagad/COD all work and appear correctly under the Orders tab.
- [ ] Double-check the `ADMIN_PASSWORD` is something only the shop owner knows — this is the only thing standing between the public and your product/order management.

---

## 6. How the admin system actually works (important context)

Unlike a simple static HTML file, product data here lives in a real Supabase
database — this is what makes it "no-code editable." When the shop owner
adds a product from `/admin/dashboard`, it's saved to Supabase and
immediately visible to every visitor, on every device. This is different
from `localStorage`-based approaches, which only save data in one person's
browser and never actually share it with real customers.

The admin dashboard is protected by a single shared password (`ADMIN_PASSWORD`).
This is intentionally simple because there's one shop owner. If you ever need
multiple staff accounts with different permissions, that would require
upgrading to Supabase Auth instead of this simple password system — let me
know if that becomes necessary.

---

## 7. Project structure

```
app/
  page.jsx                  → Homepage (hero + featured products)
  shop/page.jsx             → Product grid with sort + category filter
  product/[slug]/page.jsx   → Product detail page
  cart/page.jsx             → Full cart page
  checkout/page.jsx         → Checkout form + payment method
  checkout/success/page.jsx → Order confirmation
  about/page.jsx, terms/page.jsx
  admin/login/page.jsx      → Admin login screen
  admin/dashboard/page.jsx  → Product + order management
  api/orders/route.js       → Public: creates orders (used by checkout)
  api/admin/...             → Admin-only: product CRUD, image upload, order status
components/                 → Header, Footer, CartDrawer, ProductCard, ProductForm, ShopControls
lib/
  supabaseClient.js          → Public (anon key) — read-only, safe for browser
  supabaseAdmin.js           → Server-only (service role key) — full access
  adminAuth.js               → Admin login session logic
  cartContext.jsx            → Shopping cart state (browser-only, localStorage)
middleware.js                 → Protects all /admin routes
supabase/schema.sql            → Run this once in Supabase SQL Editor
```

---

## 8. A note on Next.js version

This project pins `next` to **14.2.35**, the final security-patched release
in the 14.x line (Next.js 14 reached end-of-life in October 2025). It is
fully patched against all publicly known vulnerabilities as of this writing,
and Vercel deployments are additionally protected by design against the
December 2025 middleware auth-bypass issue. That said, since 14.x no longer
receives new security patches, it's worth planning an eventual upgrade to
Next.js 15.x or 16.x — that upgrade involves a few breaking API changes
(notably `params` becoming async), so budget some time for it rather than
treating it as a drop-in version bump.
