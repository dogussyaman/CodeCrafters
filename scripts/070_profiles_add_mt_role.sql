-- ============================================
-- 070: profiles.role CHECK'ine 'mt' ekleme
-- CodeCrafters + MT Dashboard ortak; canlı destek chat için MT rolü gerekli.
-- MT_EXTENSION_SCHEMA.sql ile aynı işlem; numaralı sıra için bu dosya kullanılabilir.
-- Supabase SQL Editor'da çalıştırın. Zaten 'mt' eklendiyse tekrar çalıştırmak güvenlidir.
-- ============================================

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
