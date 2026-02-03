import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MessageCircle } from "lucide-react"
import { ChatPanel } from "@/components/chat/chat-panel"

export default async function GelistiriciDestekSohbetPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/giris")

  return (
    <div className="container mx-auto flex max-w-6xl flex-1 flex-col min-h-0 px-4 py-6 animate-in fade-in duration-300">
      {/* Sabit max yükseklik: chat alanı büyümez, scroll container içinde kayar */}
      <div className="flex min-h-[320px] max-h-[calc(100vh-8rem)] flex-1 flex-col overflow-hidden">
        <ChatPanel userId={user.id} />
      </div>
    </div>
  )
}
