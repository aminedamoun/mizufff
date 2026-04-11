-- Restaurant Menu Management System Migration
-- Creates tables for menu categories, menu items, and restaurant images

-- 1. Create ENUMs
DROP TYPE IF EXISTS public.menu_item_tag CASCADE;
CREATE TYPE public.menu_item_tag AS ENUM ('Signature', 'Premium', 'Unlimited', 'Sharing', 'Set Menu', 'Lunch');

-- 2. Create Tables
CREATE TABLE IF NOT EXISTS public.menu_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    display_order INTEGER NOT NULL DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.menu_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    image_alt TEXT,
    tag public.menu_item_tag,
    is_available BOOLEAN DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.restaurant_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    title TEXT NOT NULL,
    image_alt TEXT NOT NULL,
    span_class TEXT DEFAULT 'col-span-1',
    is_active BOOLEAN DEFAULT true,
    is_intro BOOLEAN DEFAULT false,
    display_order INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Indexes
CREATE INDEX IF NOT EXISTS idx_menu_categories_display_order ON public.menu_categories(display_order);
CREATE INDEX IF NOT EXISTS idx_menu_items_category_id ON public.menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_display_order ON public.menu_items(display_order);
CREATE INDEX IF NOT EXISTS idx_restaurant_images_display_order ON public.restaurant_images(display_order);

-- 4. Create Functions for Updated Timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- 5. Enable RLS
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_images ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS Policies (Public Read, Admin Write)
DROP POLICY IF EXISTS "public_read_menu_categories" ON public.menu_categories;
CREATE POLICY "public_read_menu_categories"
ON public.menu_categories
FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "admin_manage_menu_categories" ON public.menu_categories;
CREATE POLICY "admin_manage_menu_categories"
ON public.menu_categories
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "public_read_menu_items" ON public.menu_items;
CREATE POLICY "public_read_menu_items"
ON public.menu_items
FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "admin_manage_menu_items" ON public.menu_items;
CREATE POLICY "admin_manage_menu_items"
ON public.menu_items
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "public_read_restaurant_images" ON public.restaurant_images;
CREATE POLICY "public_read_restaurant_images"
ON public.restaurant_images
FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "admin_manage_restaurant_images" ON public.restaurant_images;
CREATE POLICY "admin_manage_restaurant_images"
ON public.restaurant_images
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 7. Create Triggers
DROP TRIGGER IF EXISTS update_menu_categories_updated_at ON public.menu_categories;
CREATE TRIGGER update_menu_categories_updated_at
BEFORE UPDATE ON public.menu_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_menu_items_updated_at ON public.menu_items;
CREATE TRIGGER update_menu_items_updated_at
BEFORE UPDATE ON public.menu_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_restaurant_images_updated_at ON public.restaurant_images;
CREATE TRIGGER update_restaurant_images_updated_at
BEFORE UPDATE ON public.restaurant_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 8. Insert Mock Data
DO $$
DECLARE
    cat_sushi_boxes UUID;
    cat_starters UUID;
    cat_sushi_rolls UUID;
    cat_signature UUID;
    cat_mains UUID;
    cat_rice_noodles UUID;
    cat_combos UUID;
    cat_desserts UUID;
    cat_drinks UUID;
BEGIN
    -- Insert Categories
    INSERT INTO public.menu_categories (id, name, description, display_order, is_active) VALUES
        (gen_random_uuid(), 'Sushi Boxes', 'Curated sushi box selections', 1, true),
        (gen_random_uuid(), 'Starters', 'Appetizers and light bites', 2, true),
        (gen_random_uuid(), 'Sushi & Rolls', 'Classic sushi, maki, nigiri, and sashimi', 3, true),
        (gen_random_uuid(), 'Signature Rolls', 'Chef special signature creations', 4, true),
        (gen_random_uuid(), 'Mains', 'Hot kitchen mains and grilled dishes', 5, true),
        (gen_random_uuid(), 'Rice & Noodles', 'Donburi, ramen, yakisoba, fried rice, and curry', 6, true),
        (gen_random_uuid(), 'Combos & Sharing', 'Platters and set menus', 7, true),
        (gen_random_uuid(), 'Desserts', 'Sweet endings', 8, true),
        (gen_random_uuid(), 'Drinks', 'Beverages, coffee, tea, and soft drinks', 9, true)
    ON CONFLICT (name) DO NOTHING;

    -- Get category IDs
    SELECT id INTO cat_sushi_boxes FROM public.menu_categories WHERE name = 'Sushi Boxes' LIMIT 1;
    SELECT id INTO cat_starters FROM public.menu_categories WHERE name = 'Starters' LIMIT 1;
    SELECT id INTO cat_sushi_rolls FROM public.menu_categories WHERE name = 'Sushi & Rolls' LIMIT 1;
    SELECT id INTO cat_signature FROM public.menu_categories WHERE name = 'Signature Rolls' LIMIT 1;
    SELECT id INTO cat_mains FROM public.menu_categories WHERE name = 'Mains' LIMIT 1;
    SELECT id INTO cat_rice_noodles FROM public.menu_categories WHERE name = 'Rice & Noodles' LIMIT 1;
    SELECT id INTO cat_combos FROM public.menu_categories WHERE name = 'Combos & Sharing' LIMIT 1;
    SELECT id INTO cat_desserts FROM public.menu_categories WHERE name = 'Desserts' LIMIT 1;
    SELECT id INTO cat_drinks FROM public.menu_categories WHERE name = 'Drinks' LIMIT 1;

    -- Insert Sample Menu Items (representative sample from each category)
    IF cat_sushi_boxes IS NOT NULL THEN
        INSERT INTO public.menu_items (category_id, name, description, price, image_url, image_alt, tag, is_available, display_order) VALUES
            (cat_sushi_boxes, 'All You Can Eat', 'Unlimited sushi, sashimi, and rolls. Indulge in our finest selections with no limits.', 179, 'https://images.unsplash.com/photo-1725611756448-213b2db6339a', 'All you can eat sushi buffet spread', 'Unlimited', true, 1),
            (cat_sushi_boxes, 'Mizu Sushi Box 12', 'Curated selection of 12 premium sushi pieces', 99, 'https://images.unsplash.com/photo-1607246749144-7bc0e401623c', 'Elegant sushi box with 12 assorted nigiri', NULL, true, 2),
            (cat_sushi_boxes, 'Mizu Sushi Box 16', 'Generous assortment of 16 pieces', 139, 'https://images.unsplash.com/photo-1607246749144-7bc0e401623c', 'Large sushi box with 16 mixed pieces', NULL, true, 3),
            (cat_sushi_boxes, 'Mizu Sushi Box 24', 'Ultimate sushi experience with 24 pieces', 239, 'https://images.unsplash.com/photo-1607246749144-7bc0e401623c', 'Premium sushi box with 24 assorted pieces', 'Premium', true, 4)
        ON CONFLICT (id) DO NOTHING;
    END IF;

    IF cat_starters IS NOT NULL THEN
        INSERT INTO public.menu_items (category_id, name, description, price, image_url, image_alt, is_available, display_order) VALUES
            (cat_starters, 'Miso Soup', 'Traditional Japanese soup with tofu and wakame', 38, 'https://images.unsplash.com/photo-1684866907269-2248f7334a09', 'Bowl of miso soup with tofu', true, 1),
            (cat_starters, 'Edamame', 'Steamed young soybeans lightly salted', 35, 'https://img.rocket.new/generatedImages/rocket_gen_img_11a958b8b-1770220987423.png', 'Bowl of steamed edamame', true, 2),
            (cat_starters, 'Gyoza', 'Pan-fried Japanese dumplings', 45, 'https://images.unsplash.com/photo-1718282005920-1de79a26794f', 'Pan-fried gyoza dumplings', true, 3)
        ON CONFLICT (id) DO NOTHING;
    END IF;

    IF cat_signature IS NOT NULL THEN
        INSERT INTO public.menu_items (category_id, name, description, price, image_url, image_alt, tag, is_available, display_order) VALUES
            (cat_signature, 'Dragon Roll', 'Tempura shrimp, avocado, tobiko in dragon pattern', 104, 'https://img.rocket.new/generatedImages/rocket_gen_img_1fd3051b3-1765123715023.png', 'Dragon roll with avocado scales', 'Signature', true, 1),
            (cat_signature, 'Rainbow Roll', 'California roll topped with assorted sashimi', 125, 'https://images.unsplash.com/photo-1593352995140-38a011bf2cc0', 'Rainbow roll with colorful fish topping', 'Signature', true, 2)
        ON CONFLICT (id) DO NOTHING;
    END IF;

    -- Insert Restaurant Images
    INSERT INTO public.restaurant_images (image_url, title, image_alt, span_class, is_active, is_intro, display_order) VALUES
        ('https://img.rocket.new/generatedImages/rocket_gen_img_14584d45e-1767470270793.png', 'Omakase Counter', 'Mizu omakase counter with chef preparing sushi', 'col-span-2', true, false, 1),
        ('https://images.unsplash.com/photo-1724436475827-ded22e5c3081', 'Sashimi Platter', 'Premium sashimi platter on dark ceramic', 'col-span-1', true, false, 2),
        ('https://img.rocket.new/generatedImages/rocket_gen_img_1fd3051b3-1765123715023.png', 'Dragon Roll', 'Dragon roll with avocado topping', 'col-span-1', true, true, 3),
        ('https://images.unsplash.com/photo-1690163715200-704241402d3f', 'Restaurant Interior', 'Mizu restaurant interior with ambient lighting', 'col-span-1', true, false, 4),
        ('https://images.unsplash.com/photo-1594823677827-9177bed72e5d', 'Sake Service', 'Japanese sake being served in ceramic cups', 'col-span-2', true, false, 5)
    ON CONFLICT (id) DO NOTHING;

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Mock data insertion failed: %', SQLERRM;
END $$;