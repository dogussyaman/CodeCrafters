import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building2, Briefcase, Star, TrendingUp, UserCheck } from "lucide-react"

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
      {/* Başlık */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Yönetim Paneli</h1>
        <p className="text-muted-foreground">Platform genel bakış ve yönetim</p>
      </div>

      {/* Ana İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-card border-border/50 dark:bg-zinc-900/50 dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Kullanıcı</CardTitle>
            <Users className="size-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Kayıtlı kullanıcı</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50 dark:bg-zinc-900/50 dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Şirketler</CardTitle>
            <Building2 className="size-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{companyCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Kayıtlı şirket</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50 dark:bg-zinc-900/50 dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">İş İlanları</CardTitle>
            <Briefcase className="size-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{jobCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">{activeJobCount || 0} aktif</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50 dark:bg-zinc-900/50 dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Eşleşmeler</CardTitle>
            <Star className="size-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{matchCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Toplam eşleşme</p>
          </CardContent>
        </Card>
      </div>

      {/* Detaylı İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border-border/50 dark:bg-zinc-900/50 dark:border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <UserCheck className="size-5" />
              Kullanıcı Dağılımı
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Geliştiriciler</span>
              <span className="text-sm font-medium">{developerCount || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">İK Uzmanları</span>
              <span className="text-sm font-medium">{hrCount || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50 dark:bg-zinc-900/50 dark:border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="size-5" />
              CV İstatistikleri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Toplam CV</span>
              <span className="text-sm font-medium">{cvCount || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">İşlenmiş</span>
              <span className="text-sm font-medium">{processedCVCount || 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50 dark:bg-zinc-900/50 dark:border-zinc-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Briefcase className="size-5" />
              Başvuru İstatistikleri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Toplam Başvuru</span>
              <span className="text-sm font-medium">{applicationCount || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Ortalama/İlan</span>
              <span className="text-sm font-medium">
                {jobCount && applicationCount ? Math.round(applicationCount / jobCount) : 0}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
