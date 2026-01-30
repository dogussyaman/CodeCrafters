-- ============================================
-- MT Extension Schema - CodeCrafters + MT Dashboard
-- profiles.role CHECK'ine 'mt' ekler; MT Dashboard için gerekli.
-- FINAL_COMPLETE_SCHEMA veya mevcut şema uygulandıktan sonra çalıştırın.
-- Supabase SQL Editor'da çalıştırın.
-- ============================================

-- profiles.role CHECK constraint'ine 'mt' ekle
-- (PostgreSQL'de CHECK'i değiştirmek için eski kaldırılıp yeni eklenir)

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN (
    'developer',
    'hr',
    'admin',
    'company',
    'company_admin',
    'platform_admin',
    'mt'
  ));
