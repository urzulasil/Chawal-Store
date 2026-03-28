-- ============================================================
-- Run this ENTIRE script in Supabase Dashboard → SQL Editor
-- Click "Run" once. Then check /api/supabase-health again.
-- ============================================================

-- 1. Tables
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  price_per_kg INTEGER NOT NULL,
  image_url TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  items JSONB NOT NULL DEFAULT '[]',
  total_amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'payment_submitted', 'verified', 'shipped', 'delivered', 'cancelled')),
  shipping_address TEXT NOT NULL,
  phone TEXT NOT NULL,
  payment_method TEXT,
  payment_screenshot_url TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);

-- 2. RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 3. Policies (drop first so script is safe to run again)
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
CREATE POLICY "Products are viewable by everyone" ON public.products
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;
CREATE POLICY "Users can insert own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
CREATE POLICY "Admins can update orders" ON public.orders
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins can view admin list" ON public.admin_users;
CREATE POLICY "Admins can view admin list" ON public.admin_users
  FOR SELECT USING (true);

-- 4. Seed products (ignored if rows already exist)
INSERT INTO public.products (name, slug, price_per_kg, image_url) VALUES
  ('Basmati Rice XXXL', 'basmati-3kg', 1399, '/1.jpeg'),
  ('Basmati Rice XXXL', 'basmati-5kg', 2199, '/2.jpeg')
ON CONFLICT (slug) DO NOTHING;

-- Done. After you sign up, add yourself as admin in SQL Editor:
-- INSERT INTO public.admin_users (user_id) VALUES ('your-user-uuid-from-auth-users');
-- Storage: create bucket "payment-screenshots" in Dashboard → Storage (Public, with INSERT for authenticated).
