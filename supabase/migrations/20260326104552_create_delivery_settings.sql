-- Create delivery_settings table for storing delivery partner images and config
CREATE TABLE IF NOT EXISTS public.delivery_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_key TEXT NOT NULL UNIQUE,
    partner_name TEXT NOT NULL,
    image_url TEXT NOT NULL DEFAULT '',
    image_alt TEXT NOT NULL DEFAULT '',
    partner_url TEXT NOT NULL DEFAULT '',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_delivery_settings_partner_key ON public.delivery_settings(partner_key);

ALTER TABLE public.delivery_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_delivery_settings" ON public.delivery_settings;
CREATE POLICY "public_read_delivery_settings"
ON public.delivery_settings
FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "anon_read_delivery_settings" ON public.delivery_settings;
CREATE POLICY "anon_read_delivery_settings"
ON public.delivery_settings
FOR SELECT
TO anon
USING (true);

DROP POLICY IF EXISTS "authenticated_manage_delivery_settings" ON public.delivery_settings;
CREATE POLICY "authenticated_manage_delivery_settings"
ON public.delivery_settings
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Seed default partner data
INSERT INTO public.delivery_settings (partner_key, partner_name, image_url, image_alt, partner_url)
VALUES
    ('talabat', 'Talabat', '/assets/images/talabat_partner.png', 'Talabat food delivery platform logo', 'https://www.talabat.com/uae/tonos-restaurant'),
    ('deliveroo', 'Deliveroo', '/assets/images/deliveroo_partner.png', 'Deliveroo food delivery platform logo', 'https://deliveroo.ae/menu/dubai/downtown-dubai-mall/tonos-restaurant')
ON CONFLICT (partner_key) DO NOTHING;
