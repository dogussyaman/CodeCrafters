import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Star, Briefcase, Upload, TrendingUp, ChevronRight, MapPin } from "lucide-react"
import Link from "next/link"
import type { MatchWithJob } from "@/lib/dashboard-types"

export default async function DeveloperDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Profil bilgisini al
  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single()

  // CV sayısını al
  const { count: cvCount } = await supabase
    .from("cvs")
    .select("*", { count: "exact", head: true })
    .eq("developer_id", user.id)

  // Eşleşme sayısını al
  const { count: matchCount } = await supabase
    .from("matches")
    .select("*", { count: "exact", head: true })
    .eq("developer_id", user.id)

  // Başvuru sayısını al
  const { count: applicationCount } = await supabase
    .from("applications")
    .select("*", { count: "exact", head: true })
    .eq("developer_id", user.id)

  // Son eşleşmeleri al
  const { data: recentMatches } = await supabase
    .from("matches")
    .select(
      `
      *,
      job_postings:job_id (
        title,
        location,
        job_type,
        companies:company_id (
          name,
          logo_url
        )
      )
    `,
    )
    .eq("developer_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 min-h-screen animate-in fade-in duration-500">
      {/* Modern Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/10 p-8 sm:p-12">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 size-64 bg-primary/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 size-64 bg-blue-500/10 rounded-full blur-3xl opacity-50" />

        <div className="relative z-10 max-w-2xl">
          <Badge variant="outline" className="mb-4 bg-background/50 backdrop-blur-sm border-primary/20 text-primary">
            Geliştirici Paneli
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">
            Merhaba, <span className="text-primary">{profile?.full_name || "Geliştirici"}</span> 👋
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Kariyer hedeflerine ulaşmak için doğru yerdesin. İş başvurularını yönet, eşleşmelerini incele ve profilini güçlendir.
          </p>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="group hover:shadow-lg transition-all duration-300 border-primary/10 bg-gradient-to-br from-background to-primary/5 dark:from-zinc-900/50 dark:to-primary/10 dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Yüklenen CV</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
              <FileText className="size-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground mb-1">{cvCount || 0}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="text-primary font-medium">Güncel</span> CV'niz sistemde kayıtlı
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border-orange-500/10 bg-gradient-to-br from-background to-orange-500/5 dark:from-zinc-900/50 dark:to-orange-500/10 dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Eşleşmeler</CardTitle>
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
              <Star className="size-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground mb-1">{matchCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              Size uygun pozisyon sayısı
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 border-blue-500/10 bg-gradient-to-br from-background to-blue-500/5 dark:from-zinc-900/50 dark:to-blue-500/10 dark:border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Başvurular</CardTitle>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <Briefcase className="size-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground mb-1">{applicationCount || 0}</div>
            <p className="text-xs text-muted-foreground">
              Aktif iş başvurunuz
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Son Eşleşmeler */}
        <div className="lg:col-span-2 space-y-6">
          {(!cvCount || cvCount === 0) && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
              <div className="p-4 bg-amber-500/20 rounded-full shrink-0">
                <Upload className="size-8 text-amber-600 dark:text-amber-500" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-semibold text-lg text-foreground mb-1">Henüz CV Yüklemediniz</h3>
                <p className="text-muted-foreground text-sm mb-4 sm:mb-0">
                  Size en uygun iş ilanlarını bulabilmemiz için CV'nizi yükleyerek profilinizi oluşturun.
                </p>
              </div>
              <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white border-none shrink-0">
                <Link href="/dashboard/gelistirici/cv">
                  <Upload className="mr-2 size-4" />
                  CV Yükle
                </Link>
              </Button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="size-5 text-primary" />
              Son Eşleşmeler
            </h2>
            <Button variant="ghost" size="sm" asChild className="hover:bg-primary/5 hover:text-primary">
              <Link href="/dashboard/gelistirici/eslesmeler">
                Tümünü Gör <ChevronRight className="ml-1 size-4" />
              </Link>
            </Button>
          </div>

          <Card className="bg-card border-border/50 dark:bg-zinc-900/50 dark:border-zinc-800 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              {!recentMatches || recentMatches.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                  <div className="size-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                    <Star className="size-8 text-muted-foreground/40" />
                  </div>
                  <h3 className="font-medium text-lg mb-1">Henüz eşleşme yok</h3>
                  <p className="text-muted-foreground text-sm max-w-sm">
                    CV'niz analiz edildiğinde ve uygun ilanlar bulunduğunda burada listelenecekler.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {recentMatches.map((match: MatchWithJob) => (
                    <div
                      key={match.id}
                      className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 hover:bg-muted/30 transition-colors"
                    >
                      <div className="size-12 rounded-lg bg-background border flex items-center justify-center shrink-0 shadow-sm">
                        <span className="font-bold text-primary text-lg">
                          {match.job_postings?.companies?.name?.substring(0, 1) || "C"}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground truncate">
                            {match.job_postings?.title}
                          </h3>
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-0 pointer-events-none text-[10px] px-2 h-5">
                            %{match.match_score}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            {match.job_postings?.companies?.name}
                          </span>
                          {match.job_postings?.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="size-3" />
                              {match.job_postings.location}
                            </span>
                          )}
                        </div>
                      </div>

                      <Button size="sm" asChild className="shrink-0 w-full sm:w-auto opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <Link href={`/dashboard/gelistirici/eslesmeler/${match.id}`}>
                          İncele
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Hızlı İşlemler & İpuçları */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-card to-muted/30 border-border/50 dark:from-zinc-900/50 dark:to-zinc-900/30 dark:border-zinc-800">
            <CardHeader>
              <CardTitle className="text-lg">Hızlı İşlemler</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Button variant="outline" className="w-full justify-start h-auto py-3 px-4 hover:border-primary/50 hover:bg-primary/5 transition-all" asChild>
                <Link href="/dashboard/gelistirici/cv/yukle">
                  <div className="p-2 rounded-full bg-primary/10 text-primary mr-3">
                    <Upload className="size-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Yeni CV Yükle</div>
                    <div className="text-xs text-muted-foreground">Profilinizi güncel tutun</div>
                  </div>
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start h-auto py-3 px-4 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all" asChild>
                <Link href="/dashboard/gelistirici/basvurular">
                  <div className="p-2 rounded-full bg-blue-500/10 text-blue-600 mr-3">
                    <Briefcase className="size-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Başvurularım</div>
                    <div className="text-xs text-muted-foreground">Durum kontrolü yapın</div>
                  </div>
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none bg-primary/5 dark:bg-primary/10 shadow-none">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Star className="size-4 text-primary fill-primary" />
                İpucu
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Profil doluluk oranınızı artırmak, daha iyi iş eşleşmeleri almanızı sağlar. Yeteneklerinizi detaylandırmayı unutmayın.
              </p>
              <Button size="sm" variant="link" asChild className="p-0 h-auto text-primary">
                <Link href="/dashboard/gelistirici/profil">Profile Git →</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
