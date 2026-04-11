-- Fix RLS policies to allow anonymous (anon) users to upload, update, and delete images
-- and perform all CRUD operations on all tables

-- ============================================================
-- STORAGE: menu-images bucket - allow anon full access
-- ============================================================

-- Public read access (already exists, keep it)
DROP POLICY IF EXISTS "Public read access for menu images" ON storage.objects;
CREATE POLICY "Public read access for menu images"
ON storage.objects FOR SELECT
USING (bucket_id = 'menu-images');

-- Allow anon users to upload menu images
DROP POLICY IF EXISTS "Authenticated users can upload menu images" ON storage.objects;
DROP POLICY IF EXISTS "Anon users can upload menu images" ON storage.objects;
CREATE POLICY "Anon users can upload menu images"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'menu-images');

-- Allow anon users to update menu images
DROP POLICY IF EXISTS "Authenticated users can update menu images" ON storage.objects;
DROP POLICY IF EXISTS "Anon users can update menu images" ON storage.objects;
CREATE POLICY "Anon users can update menu images"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'menu-images')
WITH CHECK (bucket_id = 'menu-images');

-- Allow anon users to delete menu images
DROP POLICY IF EXISTS "Authenticated users can delete menu images" ON storage.objects;
DROP POLICY IF EXISTS "Anon users can delete menu images" ON storage.objects;
CREATE POLICY "Anon users can delete menu images"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (bucket_id = 'menu-images');

-- ============================================================
-- DATABASE TABLES: Allow anon full access to all tables
-- ============================================================

-- menu_categories table
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read menu_categories" ON public.menu_categories;
CREATE POLICY "Public read menu_categories"
ON public.menu_categories FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Anon full access menu_categories" ON public.menu_categories;
CREATE POLICY "Anon full access menu_categories"
ON public.menu_categories FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- menu_items table
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read menu_items" ON public.menu_items;
CREATE POLICY "Public read menu_items"
ON public.menu_items FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Anon full access menu_items" ON public.menu_items;
CREATE POLICY "Anon full access menu_items"
ON public.menu_items FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- restaurant_images table
ALTER TABLE public.restaurant_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read restaurant_images" ON public.restaurant_images;
CREATE POLICY "Public read restaurant_images"
ON public.restaurant_images FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Anon full access restaurant_images" ON public.restaurant_images;
CREATE POLICY "Anon full access restaurant_images"
ON public.restaurant_images FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- offers table
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read offers" ON public.offers;
CREATE POLICY "Public read offers"
ON public.offers FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Anon full access offers" ON public.offers;
CREATE POLICY "Anon full access offers"
ON public.offers FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);
