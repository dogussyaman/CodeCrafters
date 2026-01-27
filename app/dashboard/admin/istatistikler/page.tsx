import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Users, Briefcase } from "lucide-react"

export default async function StatisticsPage() {
  const supabase = await createClient()

  // Detaylı istatistikler
  const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true })
  const { count: developers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "developer")
  const { count: hrUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "hr")

  const { count: companies } = await supabase.from("companies").select("*", { count: "exact", head: true })
  const { count: totalJobs } = await supabase.from("job_postings").select("*", { count: "exact", head: true })
  const { count: activeJobs } = await supabase
    .from("job_postings")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")

  const { count: totalCVs } = await supabase.from("cvs").select("*", { count: "exact", head: true })
  const { count: processedCVs } = await supabase
    .from("cvs")
    .select("*", { count: "exact", head: true })
    .eq("status", "processed")

  const { count: matches } = await supabase.from("matches").select("*", { count: "exact", head: true })
  const { count: applications } = await supabase.from("applications").select("*", { count: "exact", head: true })

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Platform İstatistikleri</h1>
        <p className="text-muted-foreground">Detaylı platform metrikleri ve raporlar</p>
      </div>

      {/* Kullanıcı İstatistikleri */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-5" />
            Kullanıcı İstatistikleri
          </CardTitle>
          <CardDescription>Kayıtlı kullanıcı dağılımı</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">{totalUsers || 0}</div>
              <div className="text-sm text-muted-foreground">Toplam Kullanıcı</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">{developers || 0}</div>
              <div className="text-sm text-muted-foreground">Geliştirici</div>
              <div className="text-xs text-muted-foreground">
                %{totalUsers ? Math.round(((developers || 0) / totalUsers) * 100) : 0}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">{hrUsers || 0}</div>
              <div className="text-sm text-muted-foreground">İK Uzmanı</div>
              <div className="text-xs text-muted-foreground">
                %{totalUsers ? Math.round(((hrUsers || 0) / totalUsers) * 100) : 0}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* İş İlanı İstatistikleri */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="size-5" />
            İş İlanı İstatistikleri
          </CardTitle>
          <CardDescription>İlan ve başvuru metrikleri</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">{companies || 0}</div>
              <div className="text-sm text-muted-foreground">Şirket</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">{totalJobs || 0}</div>
              <div className="text-sm text-muted-foreground">Toplam İlan</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">{activeJobs || 0}</div>
              <div className="text-sm text-muted-foreground">Aktif İlan</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">{applications || 0}</div>
              <div className="text-sm text-muted-foreground">Başvuru</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Eşleştirme İstatistikleri */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="size-5" />
            Eşleştirme İstatistikleri
          </CardTitle>
          <CardDescription>CV ve eşleştirme performansı</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">{totalCVs || 0}</div>
              <div className="text-sm text-muted-foreground">Toplam CV</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">{processedCVs || 0}</div>
              <div className="text-sm text-muted-foreground">İşlenmiş CV</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">{matches || 0}</div>
              <div className="text-sm text-muted-foreground">Eşleşme</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">
                {developers && matches ? Math.round(matches / developers) : 0}
              </div>
              <div className="text-sm text-muted-foreground">Ort. Eşleşme/Kişi</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performans Metrikleri */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="size-5" />
            Platform Performansı
          </CardTitle>
          <CardDescription>Önemli performans göstergeleri</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">
                {processedCVs && totalCVs ? Math.round((processedCVs / totalCVs) * 100) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">CV İşleme Oranı</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">
                {applications && totalJobs ? Math.round(applications / totalJobs) : 0}
              </div>
              <div className="text-sm text-muted-foreground">Ort. Başvuru/İlan</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-foreground">
                {matches && totalJobs ? Math.round(matches / totalJobs) : 0}
              </div>
              <div className="text-sm text-muted-foreground">Ort. Eşleşme/İlan</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
