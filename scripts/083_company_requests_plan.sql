-- ============================================
-- 083: company_requests tablosuna plan sütunu
-- Talep sırasında seçilen plan (free / orta / premium).
-- Supabase SQL Editor'da çalıştırın.
-- ============================================

ALTER TABLE public.company_requests
  ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free'
    CHECK (plan IN ('free', 'orta', 'premium'));

COMMENT ON COLUMN public.company_requests.plan IS 'Talep edilen abonelik planı: free, orta, premium';
