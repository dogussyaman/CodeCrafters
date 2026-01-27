import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "./_components/AdminHeader"
import { AdminMainStats } from "./_components/AdminMainStats"
import { AdminDetailStats } from "./_components/AdminDetailStats"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Toplam kullanıcı sayıları
  const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true })

  const { count: developerCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "developer")

  const { count: hrCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "hr")

  // Şirket sayısı
  const { count: companyCount } = await supabase.from("companies").select("*", { count: "exact", head: true })

  // İlan sayısı
  const { count: jobCount } = await supabase.from("job_postings").select("*", { count: "exact", head: true })

  const { count: activeJobCount } = await supabase
    .from("job_postings")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")

  // Eşleşme sayısı
  const { count: matchCount } = await supabase.from("matches").select("*", { count: "exact", head: true })

  // CV sayısı
  const { count: cvCount } = await supabase.from("cvs").select("*", { count: "exact", head: true })

  const { count: processedCVCount } = await supabase
    .from("cvs")
    .select("*", { count: "exact", head: true })
    .eq("status", "processed")

  // Başvuru sayısı
  const { count: applicationCount } = await supabase.from("applications").select("*", { count: "exact", head: true })

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 min-h-screen">
      <AdminHeader />
      <AdminMainStats
        totalUsers={totalUsers ?? 0}
        companyCount={companyCount ?? 0}
        jobCount={jobCount ?? 0}
        activeJobCount={activeJobCount ?? 0}
        matchCount={matchCount ?? 0}
      />
      <AdminDetailStats
        developerCount={developerCount ?? 0}
        hrCount={hrCount ?? 0}
        cvCount={cvCount ?? 0}
        processedCVCount={processedCVCount ?? 0}
        applicationCount={applicationCount ?? 0}
        jobCount={jobCount ?? 0}
      />
    </div>
  )
}
