-- ============================================
-- MT yetkisi: role_requests ve company_requests
-- MT (müşteri temsilcisi) tüm rol/şirket taleplerini görebilir ve durum güncelleyebilir.
-- CodeCrafters + Representative-Dashboard ortak Supabase.
-- Supabase SQL Editor'da çalıştırın.
-- ============================================

-- Role Requests: SELECT politikasını MT dahil edecek şekilde güncelle
DROP POLICY IF EXISTS "Kullanıcılar kendi taleplerini görebilir" ON public.role_requests;
CREATE POLICY "Kullanıcılar ve MT/Admin talepleri görebilir"
  ON public.role_requests
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'platform_admin', 'mt')
    )
  );

-- Role Requests: UPDATE politikasını MT dahil edecek şekilde güncelle
DROP POLICY IF EXISTS "Admin rol taleplerini güncelleyebilir" ON public.role_requests;
CREATE POLICY "MT ve Admin rol taleplerini güncelleyebilir"
  ON public.role_requests
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'platform_admin', 'mt')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'platform_admin', 'mt')
    )
  );

-- Company Requests: SELECT politikasını MT dahil edecek şekilde güncelle
DROP POLICY IF EXISTS "Kullanıcılar kendi taleplerini görebilir" ON public.company_requests;
CREATE POLICY "Kullanıcılar ve MT/Admin talepleri görebilir"
  ON public.company_requests
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'platform_admin', 'mt')
    )
  );

-- Company Requests: UPDATE politikasını MT dahil edecek şekilde güncelle
DROP POLICY IF EXISTS "Admin şirket taleplerini güncelleyebilir" ON public.company_requests;
CREATE POLICY "MT ve Admin şirket taleplerini güncelleyebilir"
  ON public.company_requests
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'platform_admin', 'mt')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'platform_admin', 'mt')
    )
  );
