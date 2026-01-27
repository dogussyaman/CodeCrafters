import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, Play } from "lucide-react"
import Link from "next/link"

export default async function MatchingPage() {
  const supabase = await createClient()

  // İşlenmiş CV'leri al
  const { data: processedCVs } = await supabase
    .from("cvs")
    .select(
      `
      *,
      profiles:developer_id (
        full_name,
        email
      )
    `,
    )
    .eq("status", "processed")

  // Aktif ilanları al
  const { data: activeJobs } = await supabase
    .from("job_postings")
    .select(
      `
      *,
      companies:company_id (
        name
      )
    `,
    )
    .eq("status", "active")

  // Son eşleşmeleri al
  const { data: recentMatches } = await supabase
    .from("matches")
    .select(
      `
      *,
      job_postings:job_id (
        title,
        companies:company_id (
          name
        )
      ),
      profiles:developer_id (
        full_name
      )
    `,
    )
    .order("created_at", { ascending: false })
    .limit(10)

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Eşleştirme Sistemi</h1>
          <p className="text-muted-foreground">CV ve iş ilanı eşleştirmelerini yönetin</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/admin/eslestirme/calistir">
            <Play className="mr-2 size-4" />
            Eşleştirme Çalıştır
          </Link>
        </Button>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">İşlenmiş CV</CardTitle>
            <CardDescription>Eşleştirmeye hazır</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{processedCVs?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Aktif İlan</CardTitle>
            <CardDescription>Eşleştirmeye açık</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeJobs?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Toplam Eşleşme</CardTitle>
            <CardDescription>Oluşturulan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{recentMatches?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Son Eşleşmeler */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="size-5" />
            Son Eşleşmeler
          </CardTitle>
          <CardDescription>En son oluşturulan eşleşmeler</CardDescription>
        </CardHeader>
        <CardContent>
          {!recentMatches || recentMatches.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Henüz eşleşme yok</p>
              <p className="text-sm mt-1">Eşleştirme algoritmasını çalıştırın</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentMatches.map((match: any) => (
                <div key={match.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{match.profiles?.full_name}</div>
                    <div className="text-xs text-muted-foreground">
                      {match.job_postings?.title} • {match.job_postings?.companies?.name}
                    </div>
                  </div>
                  <Badge className="bg-primary/10 text-primary">%{match.match_score}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
