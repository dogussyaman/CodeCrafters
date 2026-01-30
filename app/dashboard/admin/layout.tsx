import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { ModernFooter } from "@/components/modern-footer"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/giris")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const isAdmin = profile?.role === "admin" || profile?.role === "platform_admin"
  if (!profile || !isAdmin) {
    redirect("/auth/giris")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader profile={profile} />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          <div className="flex flex-col min-h-full">
            <div className="flex-1">{children}</div>
            <ModernFooter />
          </div>
        </main>
      </div>
    </div>
  )
}
