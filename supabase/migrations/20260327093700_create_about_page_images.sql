-- About Page Images Table
-- Stores all editable images from the About page (story milestones + philosophy section)

CREATE TABLE IF NOT EXISTS public.about_page_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_key TEXT NOT NULL UNIQUE,
  section TEXT NOT NULL,
  label TEXT NOT NULL,
  image_url TEXT NOT NULL,
  image_alt TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_about_page_images_section ON public.about_page_images(section);
CREATE INDEX IF NOT EXISTS idx_about_page_images_order ON public.about_page_images(display_order);

ALTER TABLE public.about_page_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_about_page_images" ON public.about_page_images;
CREATE POLICY "public_read_about_page_images"
ON public.about_page_images
FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "authenticated_manage_about_page_images" ON public.about_page_images;
CREATE POLICY "authenticated_manage_about_page_images"
ON public.about_page_images
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Seed default data matching the current About page images
DO $$
BEGIN
  INSERT INTO public.about_page_images (image_key, section, label, image_url, image_alt, display_order) VALUES
    ('story_2018', 'Story Timeline', '2018 – Founded in Dubai', 'https://698ef95f42985dd050940011.imgix.net/mizuabtext.webp', 'Modern Japanese restaurant interior with elegant wooden tables and ambient lighting', 1),
    ('story_2020', 'Story Timeline', '2020 – Expanded the Omakase Bar', 'https://img.rocket.new/generatedImages/rocket_gen_img_14584d45e-1767470270793.png', 'Intimate omakase counter with chef preparing sushi for guests seated at wooden bar', 2),
    ('story_2022', 'Story Timeline', '2022 – Named Best Japanese in Dubai', 'https://698ef95f42985dd050940011.imgix.net/best.webp', 'Award-winning sushi platter with fresh nigiri and sashimi arranged artistically', 3),
    ('story_2024', 'Story Timeline', '2024 – Our Expert Sushi Chefs', 'https://698ef95f42985dd050940011.imgix.net/chef.webp', 'Professional Japanese chef in white uniform carefully preparing sushi with precision', 4),
    ('story_2026', 'Story Timeline', '2026 – Continuing the Journey', 'https://698ef95f42985dd050940011.imgix.net/mizuabtext-1.webp', 'Elegant sushi presentation on black plate with chopsticks and sake in modern setting', 5),
    ('philosophy_main', 'Philosophy Section', 'Philosophy – Main Image', 'https://698ef95f42985dd050940011.imgix.net/mastery.webp', 'Mizu head chef preparing omakase nigiri with precise hand movements', 6),
    ('philosophy_secondary', 'Philosophy Section', 'Philosophy – Secondary Image', 'https://698ef95f42985dd050940011.imgix.net/mastery1.webp', 'Close up of sushi preparation tools and fresh fish on cutting board', 7)
  ON CONFLICT (image_key) DO NOTHING;
END $$;
