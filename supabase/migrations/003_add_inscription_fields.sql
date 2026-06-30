-- Add missing columns to inscriptions table to match the registration form
ALTER TABLE inscriptions
    ADD COLUMN IF NOT EXISTS birth_date DATE,
    ADD COLUMN IF NOT EXISTS age INTEGER,
    ADD COLUMN IF NOT EXISTS address TEXT,
    ADD COLUMN IF NOT EXISTS locality TEXT,
    ADD COLUMN IF NOT EXISTS technical_needs TEXT,
    ADD COLUMN IF NOT EXISTS rider_tecnico JSONB,
    ADD COLUMN IF NOT EXISTS proposal_name TEXT,
    ADD COLUMN IF NOT EXISTS choreographer_name TEXT,
    ADD COLUMN IF NOT EXISTS style TEXT,
    ADD COLUMN IF NOT EXISTS dance_list TEXT,
    ADD COLUMN IF NOT EXISTS themes JSONB,
    ADD COLUMN IF NOT EXISTS members JSONB;
