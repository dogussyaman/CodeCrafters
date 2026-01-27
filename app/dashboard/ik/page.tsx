import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Briefcase, Users, Star, Plus, TrendingUp } from "lucide-react"
import Link from "next/link"
import type { JobPostingWithCompany } from "@/lib/dashboard-types"

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
      {/* Başlık */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">İK Paneli</h1>
        <p className="text-muted-foreground">İşe alım süreçlerinizi yönetin</p>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card border-border/50 dark:bg-zinc-900/50 dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Şirketler</CardTitle>
            <Building2 className="size-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{companyCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Kayıtlı şirket</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50 dark:bg-zinc-900/50 dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Aktif İlanlar</CardTitle>
            <Briefcase className="size-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{jobCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">İş ilanı</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50 dark:bg-zinc-900/50 dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Başvurular</CardTitle>
            <Users className="size-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{applicationCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Toplam başvuru</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50 dark:bg-zinc-900/50 dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Eşleşmeler</CardTitle>
            <Star className="size-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">-</div>
            <p className="text-xs text-muted-foreground mt-1">Potansiyel aday</p>
          </CardContent>
        </Card>
      </div>

      {/* Hızlı Aksiyonlar */}
      {(!companyCount || companyCount === 0) && (
        <Card className="border-primary/50 bg-primary/5 dark:bg-zinc-900/50 dark:border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="size-5" />
              Şirket Ekleyin
            </CardTitle>
            <CardDescription>İş ilanı yayınlamak için önce şirket bilgilerini eklemeniz gerekiyor</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/ik/sirketler/olustur">
                <Plus className="mr-2 size-4" />
                Şirket Ekle
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Son İlanlar */}
      <Card className="bg-card border-border/50 dark:bg-zinc-900/50 dark:border-zinc-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="size-5" />
                Son İlanlar
              </CardTitle>
              <CardDescription>Yayınladığınız iş ilanları</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/ik/ilanlar/olustur">
                <Plus className="mr-2 size-4" />
                Yeni İlan
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!recentJobs || recentJobs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Briefcase className="size-12 mx-auto mb-4 opacity-20" />
              <p>Henüz ilan yok</p>
              <p className="text-sm mt-1">İlk iş ilanınızı oluşturun</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentJobs.map((job: JobPostingWithCompany) => (
                <div key={job.id} className="flex items-start justify-between p-4 border border-border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{job.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{job.companies?.name}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {job.location && <span>{job.location}</span>}
                      {job.job_type && <span className="capitalize">{job.job_type.replace("-", " ")}</span>}
                      <span
                        className={job.status === "active" ? "text-green-600 dark:text-green-400" : "text-yellow-600"}
                      >
                        {job.status === "active" ? "Aktif" : "Taslak"}
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/dashboard/ik/ilanlar/${job.id}`}>Görüntüle</Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
