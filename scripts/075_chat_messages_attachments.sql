-- ============================================
-- 075: Canlı destek sohbet mesajlarına resim ekleri
-- chat_messages.attachment_urls + chat-attachments storage bucket.
-- 072_chat_rls.sql sonrasında çalıştırın.
-- Supabase SQL Editor'da çalıştırın.
-- ============================================

-- chat_messages tablosuna resim URL'leri (mesaj başına en fazla 5)
ALTER TABLE public.chat_messages
  ADD COLUMN IF NOT EXISTS attachment_urls TEXT[] DEFAULT '{}';

-- İsteğe bağlı: mesaj başına en fazla 5 ek
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'public.chat_messages'::regclass
    AND conname = 'chat_messages_attachment_urls_max_5'
  ) THEN
    ALTER TABLE public.chat_messages
      ADD CONSTRAINT chat_messages_attachment_urls_max_5
      CHECK (array_length(attachment_urls, 1) IS NULL OR array_length(attachment_urls, 1) <= 5);
  END IF;
END $$;

-- ============================================
-- Storage bucket: Canlı destek sohbet ekleri (chat-attachments)
-- Path: {conversation_id}/{sender_id}/{uuid}.{ext}
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-attachments', 'chat-attachments', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- Policy: Authenticated kullanıcılar okuyabilsin (mesajı gören ekleri de görür)
DROP POLICY IF EXISTS "chat-attachments public read" ON storage.objects;
CREATE POLICY "chat-attachments public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'chat-attachments');

-- Policy: Giriş yapmış kullanıcılar yükleyebilsin (uygulama sadece erişimi olan konuşmaya yükler)
DROP POLICY IF EXISTS "chat-attachments insert" ON storage.objects;
CREATE POLICY "chat-attachments insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'chat-attachments');
