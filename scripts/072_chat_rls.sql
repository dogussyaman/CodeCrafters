-- ============================================
-- 072: Canlı destek sohbet RLS politikaları
-- chat_conversations ve chat_messages için erişim kuralları.
-- 071_chat_tables.sql sonrasında çalıştırın.
-- Supabase SQL Editor'da çalıştırın.
-- ============================================

-- ---------- chat_conversations ----------
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "chat_conversations_select_participant" ON public.chat_conversations;
CREATE POLICY "chat_conversations_select_participant"
  ON public.chat_conversations FOR SELECT TO authenticated
  USING (participant_user_id = auth.uid());

DROP POLICY IF EXISTS "chat_conversations_select_mt_admin" ON public.chat_conversations;
CREATE POLICY "chat_conversations_select_mt_admin"
  ON public.chat_conversations FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('mt', 'admin', 'platform_admin')
    )
  );

DROP POLICY IF EXISTS "chat_conversations_insert_participant" ON public.chat_conversations;
CREATE POLICY "chat_conversations_insert_participant"
  ON public.chat_conversations FOR INSERT TO authenticated
  WITH CHECK (participant_user_id = auth.uid());

DROP POLICY IF EXISTS "chat_conversations_insert_mt_admin" ON public.chat_conversations;
CREATE POLICY "chat_conversations_insert_mt_admin"
  ON public.chat_conversations FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('mt', 'admin', 'platform_admin')
    )
  );

DROP POLICY IF EXISTS "chat_conversations_update_mt_admin" ON public.chat_conversations;
CREATE POLICY "chat_conversations_update_mt_admin"
  ON public.chat_conversations FOR UPDATE TO authenticated
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

-- Participant sadece kendi konuşmasında update yapmasın; sadece MT atayabilsin/kapatabilsin.
-- İsterse participant'ın status görememesi için ayrı policy gerekmez; SELECT zaten var.

-- ---------- chat_messages ----------
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Mesajları sadece konuşmanın tarafı olanlar veya MT/admin görebilir
DROP POLICY IF EXISTS "chat_messages_select_participant" ON public.chat_messages;
CREATE POLICY "chat_messages_select_participant"
  ON public.chat_messages FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_conversations c
      WHERE c.id = conversation_id
      AND (c.participant_user_id = auth.uid() OR c.mt_user_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "chat_messages_select_mt_admin" ON public.chat_messages;
CREATE POLICY "chat_messages_select_mt_admin"
  ON public.chat_messages FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('mt', 'admin', 'platform_admin')
    )
  );

-- Mesaj ekleyebilen: konuşmanın participant'ı veya mt_user_id veya MT/admin (atanmamış konuşmaya da MT yazabilsin)
DROP POLICY IF EXISTS "chat_messages_insert_participant" ON public.chat_messages;
CREATE POLICY "chat_messages_insert_participant"
  ON public.chat_messages FOR INSERT TO authenticated
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.chat_conversations c
      WHERE c.id = conversation_id
      AND c.participant_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "chat_messages_insert_mt_admin" ON public.chat_messages;
CREATE POLICY "chat_messages_insert_mt_admin"
  ON public.chat_messages FOR INSERT TO authenticated
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('mt', 'admin', 'platform_admin')
    )
    AND EXISTS (
      SELECT 1 FROM public.chat_conversations c
      WHERE c.id = conversation_id
    )
  );

-- read_at güncelleme: konuşma tarafı olan kullanıcı mesajı "okundu" yapabilir (uygulama sadece read_at güncellemeli)
DROP POLICY IF EXISTS "chat_messages_update_read_at" ON public.chat_messages;
CREATE POLICY "chat_messages_update_read_at"
  ON public.chat_messages FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_conversations c
      WHERE c.id = conversation_id
      AND (c.participant_user_id = auth.uid() OR c.mt_user_id = auth.uid())
    )
  )
  WITH CHECK (true);
