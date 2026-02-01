-- ============================================
-- 080: Projede ilham / fork alanı (inspired_by)
-- CodeCrafters - İsteğe bağlı "bu projeden esinlendim" linki veya açıklama.
-- ============================================

ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS inspired_by TEXT;

COMMENT ON COLUMN public.projects.inspired_by IS 'İlham alınan proje URL veya kısa açıklama (opsiyonel).';
