-- =====================================================
-- Fix subcategory IDs to match frontend
-- =====================================================

-- 1. Add missing 'duo_vocal' subcategory
INSERT INTO subcategories (id, category_id, name, description)
VALUES ('duo_vocal', 'musica', 'Dúo Vocal', 'Dúo vocal')
ON CONFLICT (id) DO NOTHING;

-- 2. Rename 'tema_inedito' → 'cancion_inedita'
UPDATE subcategories SET id = 'cancion_inedita' WHERE id = 'tema_inedito';

-- 3. Rename 'conjunto_baile_folklorico' → 'conjunto_baile'
UPDATE subcategories SET id = 'conjunto_baile' WHERE id = 'conjunto_baile_folklorico';

-- Update any existing inscriptions that reference the old IDs
UPDATE inscriptions SET subcategory = 'cancion_inedita' WHERE subcategory = 'tema_inedito';
UPDATE inscriptions SET subcategory = 'conjunto_baile' WHERE subcategory = 'conjunto_baile_folklorico';

-- Update any jury_assignments that reference the old IDs
UPDATE jury_assignments SET subcategory_id = 'cancion_inedita' WHERE subcategory_id = 'tema_inedito';
UPDATE jury_assignments SET subcategory_id = 'conjunto_baile' WHERE subcategory_id = 'conjunto_baile_folklorico';

-- Update any rubrics that reference the old IDs
UPDATE rubrics SET subcategory_id = 'cancion_inedita' WHERE subcategory_id = 'tema_inedito';
UPDATE rubrics SET subcategory_id = 'conjunto_baile' WHERE subcategory_id = 'conjunto_baile_folklorico';