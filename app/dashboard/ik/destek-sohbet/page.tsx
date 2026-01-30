import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MessageCircle } from "lucide-react"
import { ChatPanel } from "@/components/chat/chat-panel"

export default async function IKDestekSohbetPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/giris")

  return (
    <div className="container mx-auto max-w-6xl px-4 py-6 animate-in fade-in duration-300">
      <div className="mb-6 flex items-center gap-2">
        <MessageCircle className="size-6 text-primary" />
        <h1 className="text-2xl font-bold">Canlı Destek Sohbeti</h1>
      </div>
      <p className="mb-6 text-sm text-muted-foreground">
        Destek ekibimizle anlık sohbet edebilirsiniz. Mesajlarınız canlı iletilir.
      </p>
      <ChatPanel userId={user.id} />
    </div>
  )
}
