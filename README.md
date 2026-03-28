# URUZ UL ASIL — Premium Rice Store (Next.js + Supabase)

E-commerce site for premium Basmati rice with user auth, cart, checkout, payment screenshot upload, and admin order verification.

## Features

- **Users:** Sign up, sign in, browse products, add to cart, checkout with delivery address and phone
- **Payment:** Easy Paisa / JazzCash / Bank details shown on checkout; user uploads payment screenshot
- **Orders:** User sees their orders and status; admin sees all orders with payment screenshots and can verify/update status

## Setup

### 1. Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. **Create the database tables:** In the Supabase Dashboard go to **SQL Editor** → New query. Copy the **entire** contents of `supabase/schema.sql` from this project, paste into the editor, and click **Run**. You should see “Success. No rows returned.” This creates the `products`, `orders`, and `admin_users` tables and seeds the two rice products.
   - If you get **"Could not find the table 'public.products'"** from the app, it means this step hasn’t been done yet—run the schema script once.
3. In **Storage**, create a bucket named `payment-screenshots`. Set it to **Public** so payment screenshot URLs work, or keep private and use signed URLs.
4. Add a storage policy so authenticated users can upload:
   - Policy name: `Upload payment screenshots`
   - Allowed operation: INSERT
   - Target: `payment-screenshots` bucket
   - WITH CHECK: `auth.role() = 'authenticated'`
5. After your first admin user signs up, copy their User ID from **Authentication > Users**, then in SQL Editor run:
   ```sql
   INSERT INTO public.admin_users (user_id) VALUES ('paste-user-uuid-here');
   ```
6. **Email rate limit (optional):** Supabase’s built-in email has a low hourly limit (~4/hour). If you see “email rate limit exceeded”:
   - **Quick fix:** In Dashboard go to **Authentication → Providers → Email** and turn **off** “Confirm email”. New users can sign in immediately without a confirmation email, so sign-up no longer counts against the limit.
   - **For production:** Use **Authentication → SMTP Settings** and set up your own SMTP (e.g. Resend, SendGrid, Mailgun) for higher or no rate limits.

### 2. Environment variables

Use `.env` or `.env.local` in the project root and set:

- `NEXT_PUBLIC_SUPABASE_URL` — from Supabase **Settings > API**
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from Supabase **Settings > API** (the “anon” / public key)

Restart the dev server after changing env.

### 3. Run the app

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Verify Supabase:** Visit [http://localhost:3000/api/supabase-health](http://localhost:3000/api/supabase-health). You should see `{"ok":true,"message":"Supabase connected",...}`. If you see `ok: false`, check the `error` field and your env + Supabase project (tables, RLS, URL/key).

### 4. Assets

Product images `1.jpeg`, `2.jpeg` and hero image `rice.jpg` are already in `public/`. Replace them with your own if needed.

## Payment details (customize)

Edit the payment info shown on the checkout page in `src/app/checkout/page.tsx` (the `PaymentDetails` component): replace the placeholder bank name, account title, account number, and IBAN with your real details.

## Tech stack

- Next.js 16 (App Router), TypeScript, Tailwind CSS
- Supabase: Auth, Database, Storage
