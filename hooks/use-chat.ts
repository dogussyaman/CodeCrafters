"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import type { ChatConversation, ChatMessage } from "@/lib/types"

const supabase = createClient()

export function useChatParticipant(userId: string | undefined) {
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [loadingConversations, setLoadingConversations] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)

  const fetchConversations = useCallback(async () => {
    if (!userId) {
      setConversations([])
      setLoadingConversations(false)
      return
    }
    setLoadingConversations(true)
    try {
      const { data, error } = await supabase
        .from("chat_conversations")
        .select("*")
        .eq("participant_user_id", userId)
        .order("updated_at", { ascending: false })

      if (error) throw error
      setConversations((data as ChatConversation[]) ?? [])
    } catch (e) {
      console.error("Chat conversations fetch error:", e)
      setConversations([])
    } finally {
      setLoadingConversations(false)
    }
  }, [userId])

  const fetchMessages = useCallback(async (conversationId: string, silent = false) => {
    if (!silent) setLoadingMessages(true)
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })

      if (error) throw error
      setMessages((data as ChatMessage[]) ?? [])
    } catch (e) {
      if (!silent) console.error("Chat messages fetch error:", e)
      if (!silent) setMessages([])
    } finally {
      if (!silent) setLoadingMessages(false)
    }
  }, [])

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  useEffect(() => {
    if (!selectedConversationId) {
      setMessages([])
      return
    }
    fetchMessages(selectedConversationId)
  }, [selectedConversationId, fetchMessages])

  /** Realtime: karşı taraftan gelen yeni mesajlar */
  useEffect(() => {
    if (!selectedConversationId) return

    const channel = supabase
      .channel(`chat_messages:${selectedConversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `conversation_id=eq.${selectedConversationId}`,
        },
        (payload) => {
          const newRow = payload.new as ChatMessage
          setMessages((prev) => (prev.some((m) => m.id === newRow.id) ? prev : [...prev, newRow]))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedConversationId])

  /** Fallback: Realtime kapalıysa mesajları periyodik çek (karşı tarafın mesajları için) */
  useEffect(() => {
    if (!selectedConversationId) return
    const interval = setInterval(() => {
      void fetchMessages(selectedConversationId, true)
    }, 4000)
    return () => clearInterval(interval)
  }, [selectedConversationId, fetchMessages])

  const createConversation = useCallback(async () => {
    if (!userId) return null
    setSending(true)
    try {
      const { data, error } = await supabase
        .from("chat_conversations")
        .insert({ participant_user_id: userId, status: "open" })
        .select("id")
        .single()

      if (error) throw error
      await fetchConversations()
      if (data?.id) setSelectedConversationId(data.id)
      return data?.id ?? null
    } catch (e) {
      console.error("Create conversation error:", e)
      return null
    } finally {
      setSending(false)
    }
  }, [userId, fetchConversations])

  const sendMessage = useCallback(
    async (content: string) => {
      if (!selectedConversationId || !userId || !content.trim()) return false
      setSending(true)
      try {
        const { data: newMessage, error } = await supabase
          .from("chat_messages")
          .insert({
            conversation_id: selectedConversationId,
            sender_id: userId,
            content: content.trim(),
          })
          .select("*")
          .single()
        if (error) throw error
        if (newMessage) {
          setMessages((prev) =>
            prev.some((m) => m.id === newMessage.id) ? prev : [...prev, newMessage as ChatMessage]
          )
        }
        return true
      } catch (e) {
        console.error("Send message error:", e)
        return false
      } finally {
        setSending(false)
      }
    },
    [selectedConversationId, userId]
  )

  return {
    conversations,
    messages,
    selectedConversationId,
    setSelectedConversationId,
    loadingConversations,
    loadingMessages,
    sending,
    createConversation,
    sendMessage,
    refetchConversations: fetchConversations,
  }
}
