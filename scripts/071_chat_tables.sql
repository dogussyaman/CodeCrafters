-- ============================================
-- 071: Canlı destek sohbet tabloları (chat_conversations, chat_messages)
-- CodeCrafters + MT Dashboard ortak; Supabase Realtime ile kullanılacak.
-- 070_profiles_add_mt_role.sql sonrasında çalıştırın.
-- Supabase SQL Editor'da çalıştırın.
-- ============================================

-- Chat konuşmaları: CodeCrafters kullanıcısı (participant) <-> MT (mt_user_id)
CREATE TABLE IF NOT EXISTS public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  support_ticket_id UUID REFERENCES public.support_tickets(id) ON DELETE SET NULL,
  participant_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mt_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'in_progress', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat mesajları
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İndeksler (sorgu ve Realtime filtre için)
CREATE INDEX IF NOT EXISTS idx_chat_conversations_participant
  ON public.chat_conversations(participant_user_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_mt_user
  ON public.chat_conversations(mt_user_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_status
  ON public.chat_conversations(status);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation
  ON public.chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at
  ON public.chat_messages(conversation_id, created_at);

-- Realtime için publication (Supabase varsayılan public schema için gerekebilir)
-- Tablolar Realtime'da görünür olmalı: Dashboard > Database > Replication > public.chat_conversations, public.chat_messages ekleyin.

-- updated_at tetikleyicisi (chat_conversations)
CREATE OR REPLACE FUNCTION public.set_chat_conversations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS chat_conversations_updated_at ON public.chat_conversations;
CREATE TRIGGER chat_conversations_updated_at
  BEFORE UPDATE ON public.chat_conversations
  FOR EACH ROW
  EXECUTE PROCEDURE public.set_chat_conversations_updated_at();
