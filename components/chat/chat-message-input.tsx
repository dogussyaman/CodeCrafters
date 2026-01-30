"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"

interface ChatMessageInputProps {
  onSend: (content: string) => Promise<boolean>
  disabled?: boolean
  placeholder?: string
}

export function ChatMessageInput({
  onSend,
  disabled,
  placeholder = "Mesajınızı yazın...",
}: ChatMessageInputProps) {
  const [value, setValue] = useState("")
  const [sending, setSending] = useState(false)

  const handleSubmit = useCallback(async () => {
    const trimmed = value.trim()
    if (!trimmed || disabled || sending) return
    setSending(true)
    try {
      const ok = await onSend(trimmed)
      if (ok) setValue("")
    } finally {
      setSending(false)
    }
  }, [value, disabled, sending, onSend])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      void handleSubmit()
    }
  }

  return (
    <div className="flex shrink-0 gap-2 border-t border-border bg-background p-3">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled || sending}
        rows={1}
        className="min-h-[40px] max-h-32 resize-none"
      />
      <Button
        type="button"
        size="icon"
        onClick={handleSubmit}
        disabled={!value.trim() || disabled || sending}
        className="shrink-0"
      >
        <Send className="size-4" />
      </Button>
    </div>
  )
}
