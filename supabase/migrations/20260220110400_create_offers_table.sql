-- Create offers table for promotional offers section
CREATE TABLE IF NOT EXISTS public.offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    image_alt TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_offers_display_order ON public.offers(display_order);
CREATE INDEX IF NOT EXISTS idx_offers_is_active ON public.offers(is_active);

-- Enable RLS
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public read, no auth required for viewing offers
DROP POLICY IF EXISTS "public_can_read_offers" ON public.offers;
CREATE POLICY "public_can_read_offers" 
ON public.offers
FOR SELECT 
TO public 
USING (is_active = true);

-- Admin can manage all offers (authenticated users can manage)
DROP POLICY IF EXISTS "authenticated_manage_offers" ON public.offers;
CREATE POLICY "authenticated_manage_offers" 
ON public.offers
FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);

-- Insert sample offers data
DO $$
BEGIN
    INSERT INTO public.offers (id, title, description, image_url, image_alt, is_active, display_order)
    VALUES 
        (gen_random_uuid(), 'Weekend Special', 'Get 20% off on all sushi boxes this weekend! Valid Friday to Sunday.', 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', 'Assorted sushi boxes with fresh salmon and tuna rolls', true, 1),
        (gen_random_uuid(), 'Happy Hour Deal', 'Buy 2 signature rolls and get 1 classic roll free! Available 3-6 PM daily.', 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56', 'Premium sushi rolls with colorful toppings on dark plate', true, 2)
    ON CONFLICT (id) DO NOTHING;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Sample offers insertion failed: %', SQLERRM;
END $$;