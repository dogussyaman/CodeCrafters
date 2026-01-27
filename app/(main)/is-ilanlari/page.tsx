import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin, DollarSign, Clock } from "lucide-react"
import { createServerClient } from "@/lib/supabase/server"

export default async function IsIlanlariPage() {
  const supabase = await createServerClient()

  const { data: ilanlar } = await supabase
    .from("job_postings")
    .select(`
      *,
      companies (
        name,
        logo_url
      ),
      job_skills (
        skills (
          name
        )
      )
    `)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(20)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">

        <div className="absolute top-20 right-10 size-96 bg-secondary/10 rounded-full blur-[120px]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
              <span className="gradient-text">İş İlanları</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              Hayallerinizdeki işi bulun, kariyer hedfinize ulaşın
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Pozisyon ara..."
                className="flex-1 px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button size="lg">İlan Ara</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {["Tümü", "Uzaktan", "Hibrit", "Ofis", "Junior", "Mid-Level", "Senior"].map((filtre) => (
              <Button key={filtre} variant="outline" size="sm">
                {filtre}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs List */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-4">
            {ilanlar && ilanlar.length > 0 ? (
              ilanlar.map((ilan: any) => (
                <Card key={ilan.id} className="hover:shadow-lg transition-all duration-300 hover:border-primary/50">
                  <Link href={`/is-ilanlari/${ilan.id}`}>
                    <CardHeader>
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">{ilan.experience_level}</Badge>
                            <Badge variant="outline">{ilan.job_type}</Badge>
                            <span className="text-xs text-muted-foreground ml-auto md:ml-0">
                              <Clock className="size-3 inline mr-1" />
                              {new Date(ilan.created_at).toLocaleDateString("tr-TR")}
                            </span>
                          </div>
                          <CardTitle className="hover:text-primary transition-colors cursor-pointer mb-2">
                            {ilan.title}
                          </CardTitle>
                          <CardDescription className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Building2 className="size-4" />
                              <span>{ilan.companies?.name}</span>
                            </div>
                            {ilan.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="size-4" />
                                <span>{ilan.location}</span>
                              </div>
                            )}
                            {(ilan.salary_min || ilan.salary_max) && (
                              <div className="flex items-center gap-2">
                                <DollarSign className="size-4" />
                                <span>
                                  ₺{ilan.salary_min?.toLocaleString("tr-TR")} - ₺
                                  {ilan.salary_max?.toLocaleString("tr-TR")}
                                </span>
                              </div>
                            )}
                          </CardDescription>
                        </div>
                        <Button className="md:mt-0">Detay</Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {ilan.job_skills?.slice(0, 5).map((js: any, idx: number) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {js.skills?.name}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Henüz aktif ilan bulunmuyor.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Post Job CTA */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">İlan Vermek İster misiniz?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Binlerce yetenekli yazılımcıya ulaşın ve ekibinizi büyütün
            </p>
            <Button size="lg" asChild>
              <Link href="/auth/kayit">İK Olarak Kayıt Ol</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
