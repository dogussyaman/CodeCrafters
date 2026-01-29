-- ============================================
-- support_tickets tablosu ve RLS politikaları
-- CodeCrafters + Representative-Dashboard ortak kullanım
-- Supabase SQL Editor'da çalıştırın.
--
-- Resim/ek: Aşağıdaki "Storage bucket" bölümü support-tickets bucket'ını oluşturur.
-- ============================================

-- Tablo yoksa oluştur (Supabase'de zaten varsa bu blok hataya düşmez; CREATE IF NOT EXISTS kullanıyoruz)
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT,
  type TEXT CHECK (type IN ('login_error', 'feedback', 'technical', 'other')),
  subject TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolution_no TEXT,
  attachment_urls TEXT[] DEFAULT '{}'
);

-- Mevcut tabloya eksik sütunları ekle (tablo başka şemayla oluşturulduysa)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'support_tickets') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'attachment_urls') THEN
      ALTER TABLE public.support_tickets ADD COLUMN attachment_urls TEXT[] DEFAULT '{}';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'resolution_no') THEN
      ALTER TABLE public.support_tickets ADD COLUMN resolution_no TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'support_tickets' AND column_name = 'resolved_at') THEN
      ALTER TABLE public.support_tickets ADD COLUMN resolved_at TIMESTAMP WITH TIME ZONE;
    END IF;
  END IF;
END $$;

-- RLS etkinleştir
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Mevcut politikaları temizle (tekrar çalıştırılabilir script için)
DROP POLICY IF EXISTS "Users can view own tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "MT and admin can view all tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Anyone can insert support ticket" ON public.support_tickets;
DROP POLICY IF EXISTS "MT and admin can update tickets" ON public.support_tickets;

-- Authenticated kullanıcı sadece kendi biletlerini görebilir
CREATE POLICY "Users can view own tickets"
  ON public.support_tickets
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- MT ve admin rolleri tüm biletleri görebilir (profiles.role: mt, admin, platform_admin)
CREATE POLICY "MT and admin can view all tickets"
  ON public.support_tickets
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('mt', 'admin', 'platform_admin')
    )
  );

-- Herkes (anon + authenticated) destek talebi oluşturabilir
CREATE POLICY "Anyone can insert support ticket"
  ON public.support_tickets
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Sadece MT ve admin bilet güncelleyebilir (durum, atama, çözüm notu)
CREATE POLICY "MT and admin can update tickets"
  ON public.support_tickets
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('mt', 'admin', 'platform_admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('mt', 'admin', 'platform_admin')
    )
  );

-- updated_at tetikleyicisi (opsiyonel)
CREATE OR REPLACE FUNCTION public.set_support_tickets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS support_tickets_updated_at ON public.support_tickets;
CREATE TRIGGER support_tickets_updated_at
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW
  EXECUTE PROCEDURE public.set_support_tickets_updated_at();

-- ============================================
-- Storage bucket: Destek talebi ekleri (support-tickets)
-- Bucket yoksa oluşturur; public okuma, girişli/girişsiz yükleme izni verir.
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('support-tickets', 'support-tickets', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- Policy: Herkes (anon + authenticated) destek talebi eklerini okuyabilsin (public URL için)
DROP POLICY IF EXISTS "support-tickets public read" ON storage.objects;
CREATE POLICY "support-tickets public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'support-tickets');

-- Policy: Girişli ve girişsiz kullanıcı destek talebi ekleri yükleyebilsin
DROP POLICY IF EXISTS "support-tickets insert" ON storage.objects;
CREATE POLICY "support-tickets insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'support-tickets');
