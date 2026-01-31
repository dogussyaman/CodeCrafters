import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { CompanySidebar } from "@/components/company-sidebar"
import { ModernFooter } from "@/components/modern-footer"

export default async function CompanyLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/giris")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || profile.role !== "company_admin") {
    redirect("/auth/giris")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader profile={profile} />
      <div className="flex flex-1">
        <CompanySidebar />
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex min-h-0 flex-1 flex-col">{children}</div>
            <ModernFooter />
          </div>
        </main>
      </div>
    </div>
  )
}

