-- ============================================
-- Codecrafters Platform - Broadcast Notification Function
-- Mevcut şemayı BOZMADAN ek fonksiyon
-- ============================================

CREATE OR REPLACE FUNCTION public.broadcast_notification(
  p_title        TEXT,
  p_body         TEXT DEFAULT NULL,
  p_href         TEXT DEFAULT NULL,
  p_target_role  TEXT DEFAULT 'all', -- 'all' | 'developer' | 'hr' | 'admin'
  p_data         JSONB DEFAULT '{}'::jsonb
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_effective_role TEXT;
  v_inserted_count INTEGER := 0;
BEGIN
  -- Sadece admin / platform_admin çağırabilsin
  IF NOT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'platform_admin')
  ) THEN
    RAISE EXCEPTION 'Sadece admin kullanıcılar toplu bildirim gönderebilir';
  END IF;

  v_effective_role := lower(coalesce(p_target_role, 'all'));

  -- Hedef kullanıcılar için notifications tablosuna insert
  IF v_effective_role = 'all' THEN
    INSERT INTO public.notifications (
      recipient_id,
      actor_id,
      type,
      title,
      body,
      href,
      data
    )
    SELECT
      p.id          AS recipient_id,
      auth.uid()    AS actor_id,
      'system'      AS type,
      p_title       AS title,
      p_body        AS body,
      p_href        AS href,
      coalesce(p_data, '{}'::jsonb) AS data
    FROM public.profiles p;
  ELSE
    INSERT INTO public.notifications (
      recipient_id,
      actor_id,
      type,
      title,
      body,
      href,
      data
    )
    SELECT
      p.id          AS recipient_id,
      auth.uid()    AS actor_id,
      'system'      AS type,
      p_title       AS title,
      p_body        AS body,
      p_href        AS href,
      coalesce(p_data, '{}'::jsonb) AS data
    FROM public.profiles p
    WHERE lower(p.role) = v_effective_role;
  END IF;

  GET DIAGNOSTICS v_inserted_count = ROW_COUNT;

  RETURN v_inserted_count;
END;
$$;

-- NOT:
-- - Var olan tablolar, indexler ve policy'ler değiştirilmez.
-- - Sadece yeni bir fonksiyon eklenir.
-- - Admin bildirim ekranındaki supabase.rpc('broadcast_notification', ...) çağrısı
--   bu fonksiyonla birebir uyumludur ve etkilenen kullanıcı sayısını INTEGER olarak döner.

