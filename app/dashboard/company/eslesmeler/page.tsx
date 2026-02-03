import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

export default async function CompanyMatchesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile } = await supabase.from("profiles").select("company_id").eq("id", user.id).single()

  const { data: companyJobs } = await supabase
    .from("job_postings")
    .select("id")
    .eq("company_id", profile?.company_id ?? "")

  const jobIds = companyJobs?.map((job) => job.id) || []

  const { data: matches } = await supabase
    .from("matches")
    .select(
      `
      *,
      job_postings:job_id (
        title,
        location
      ),
      profiles:developer_id (
        full_name,
        email
      )
    `,
    )
    .in("job_id", jobIds.length > 0 ? jobIds : [""])
    .order("match_score", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Eşleşmeler</h1>
        <p className="text-muted-foreground">Şirket ilanlarınıza uygun bulunan adaylar</p>
      </div>

      {!matches || matches.length === 0 ? (
        <Card className="border-dashed bg-card border-border">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Star className="size-16 text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-lg font-semibold mb-2">Henüz eşleşme yok</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Geliştiriciler CV yükledikçe ilanlarınıza uygun adaylar burada görünecek
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {matches.map((match: any) => (
            <Card
              key={match.id}
              className="bg-card border-border hover:border-primary/50 transition-colors"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{match.profiles?.full_name}</CardTitle>
                    <CardDescription className="mt-1">
                      {match.job_postings?.title} • {match.job_postings?.location}
                    </CardDescription>
                  </div>
                  <Badge className="bg-primary/10 text-primary">%{match.match_score} Uyumlu</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">{match.profiles?.email}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

