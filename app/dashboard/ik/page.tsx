import { createClient } from "@/lib/supabase/server"
import { HrHeader } from "./_components/HrHeader"
import { HrStats } from "./_components/HrStats"
import { HrCompanyCallout } from "./_components/HrCompanyCallout"
import { HrRecentJobs } from "./_components/HrRecentJobs"

export default async function HRDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Şirket sayısını al
  const { count: companyCount } = await supabase
    .from("companies")
    .select("*", { count: "exact", head: true })
    .eq("created_by", user!.id)

  // İlan sayısını al
  const { count: jobCount } = await supabase
    .from("job_postings")
    .select("*", { count: "exact", head: true })
    .eq("created_by", user!.id)

  // Başvuru sayısını al (kendi ilanlarına yapılan)
  const { data: myJobs } = await supabase.from("job_postings").select("id").eq("created_by", user!.id)

  const jobIds = myJobs?.map((job) => job.id) || []
  const { count: applicationCount } = await supabase
    .from("applications")
    .select("*", { count: "exact", head: true })
    .in("job_id", jobIds.length > 0 ? jobIds : [""])

  // Son ilanları al
  const { data: recentJobs } = await supabase
    .from("job_postings")
    .select(
      `
      *,
      companies:company_id (
        name
      )
    `,
    )
    .eq("created_by", user!.id)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 min-h-screen">
      <HrHeader />
      <HrStats companyCount={companyCount ?? 0} jobCount={jobCount ?? 0} applicationCount={applicationCount ?? 0} />
      <HrCompanyCallout companyCount={companyCount ?? 0} />
      <HrRecentJobs recentJobs={recentJobs ?? null} />
    </div>
  )
}
