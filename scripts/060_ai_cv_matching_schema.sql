-- ============================================
-- AI CV Matching MVP - Schema Güncellemeleri
-- ============================================
-- Bu script, AI CV eşleştirme özelliği için gerekli tablo ve kolon güncellemelerini yapar
-- FINAL_COMPLETE_SCHEMA.sql'den sonra çalıştırılmalıdır

-- 1. CVs tablosuna raw_text ekle
ALTER TABLE public.cvs 
ADD COLUMN IF NOT EXISTS raw_text TEXT;

-- 2. CV Profiles tablosu (AI'dan çıkarılan yapılandırılmış veri)
CREATE TABLE IF NOT EXISTS public.cv_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cv_id UUID NOT NULL REFERENCES public.cvs(id) ON DELETE CASCADE,
  skills JSONB DEFAULT '[]'::jsonb,
  experience_years INTEGER,
  roles JSONB DEFAULT '[]'::jsonb,
  seniority TEXT CHECK (seniority IN ('junior', 'mid', 'senior')),
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(cv_id)
);

-- 3. Applications tablosuna match_score ve match_reason ekle
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS match_score INTEGER CHECK (match_score >= 0 AND match_score <= 100),
ADD COLUMN IF NOT EXISTS match_reason TEXT;

-- 4. Indexes (Performance)
CREATE INDEX IF NOT EXISTS idx_cv_profiles_cv_id ON public.cv_profiles(cv_id);
CREATE INDEX IF NOT EXISTS idx_applications_match_score ON public.applications(match_score) WHERE match_score IS NOT NULL;

-- 5. Updated_at trigger for cv_profiles
DROP TRIGGER IF EXISTS set_updated_at ON public.cv_profiles;
CREATE TRIGGER set_updated_at 
  BEFORE UPDATE ON public.cv_profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_updated_at();

-- 6. RLS Policies for cv_profiles
ALTER TABLE public.cv_profiles ENABLE ROW LEVEL SECURITY;

-- Herkes CV profillerini görebilir (matching için gerekli)
CREATE POLICY "Herkes CV profillerini görebilir" 
  ON public.cv_profiles 
  FOR SELECT 
  USING (true);

-- Sistem CV profili oluşturabilir (Edge Function)
CREATE POLICY "Sistem CV profili oluşturabilir" 
  ON public.cv_profiles 
  FOR INSERT 
  WITH CHECK (true);

-- Sistem CV profili güncelleyebilir (Edge Function)
CREATE POLICY "Sistem CV profili güncelleyebilir" 
  ON public.cv_profiles 
  FOR UPDATE 
  USING (true);

-- ============================================
-- TAMAMLANDI
-- ============================================
