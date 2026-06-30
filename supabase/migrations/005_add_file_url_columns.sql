-- Add file URL columns to inscriptions for uploaded documents
ALTER TABLE inscriptions
    ADD COLUMN IF NOT EXISTS dni_front_url TEXT,
    ADD COLUMN IF NOT EXISTS dni_back_url TEXT,
    ADD COLUMN IF NOT EXISTS promo_photo_url TEXT,
    ADD COLUMN IF NOT EXISTS lyrics_url TEXT,
    ADD COLUMN IF NOT EXISTS score_url TEXT;