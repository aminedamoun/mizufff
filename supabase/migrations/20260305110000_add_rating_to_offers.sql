-- Add rating column to offers table
ALTER TABLE public.offers ADD COLUMN IF NOT EXISTS rating NUMERIC(2,1) DEFAULT 5.0;

-- Update existing offers with default rating
UPDATE public.offers SET rating = 5.0 WHERE rating IS NULL;
