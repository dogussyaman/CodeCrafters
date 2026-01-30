"use client"

import { useChatParticipant } from "@/hooks/use-chat"
import { ChatConversationList } from "./chat-conversation-list"
import { ChatMessageList } from "./chat-message-list"
import { ChatMessageInput } from "./chat-message-input"

interface ChatPanelProps {
  userId: string
}

export function ChatPanel({ userId }: ChatPanelProps) {
  const {
    conversations,
    messages,
    selectedConversationId,
    setSelectedConversationId,
    loadingConversations,
    loadingMessages,
    sending,
    createConversation,
    sendMessage,
  } = useChatParticipant(userId)

  return (
    <div className="flex h-[calc(100vh-8rem)] min-h-[400px] overflow-hidden rounded-lg border border-border bg-card">
      <div className="w-64 shrink-0 md:w-72">
        <ChatConversationList
          conversations={conversations}
          selectedId={selectedConversationId}
          onSelect={setSelectedConversationId}
          onCreateNew={createConversation}
          loading={loadingConversations}
          creating={sending}
        />
      </div>
      <div className="flex flex-1 flex-col min-w-0">
        {selectedConversationId ? (
          <>
            <div className="shrink-0 border-b border-border px-4 py-2">
              <p className="text-sm font-medium text-muted-foreground">
                Canlı destek sohbeti — mesajlar anlık iletilir.
              </p>
            </div>
            <ChatMessageList
              messages={messages}
              currentUserId={userId}
              loading={loadingMessages}
            />
            <ChatMessageInput
              onSend={sendMessage}
              disabled={sending}
              placeholder="Mesajınızı yazın..."
            />
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center text-muted-foreground">
            <p className="text-sm">Sohbet seçin veya yeni sohbet başlatın.</p>
          </div>
        )}
      </div>
    </div>
  )
}
