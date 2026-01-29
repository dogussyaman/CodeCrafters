-- ============================================
-- company_requests: Şirket iletişim alanları
-- Admin/MT şirket oluştururken talep üzerinden
-- contact_email, contact_phone, contact_address kullanılır.
-- Supabase SQL Editor'da çalıştırın.
-- ============================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'company_requests') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'company_requests' AND column_name = 'contact_email') THEN
      ALTER TABLE public.company_requests ADD COLUMN contact_email TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'company_requests' AND column_name = 'contact_phone') THEN
      ALTER TABLE public.company_requests ADD COLUMN contact_phone TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'company_requests' AND column_name = 'contact_address') THEN
      ALTER TABLE public.company_requests ADD COLUMN contact_address TEXT;
    END IF;
  END IF;
END $$;
