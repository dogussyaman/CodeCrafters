import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, Heart, Eye } from "lucide-react"
import { createServerClient } from "@/lib/supabase/server"

export default async function ProjelerPage() {
  const supabase = await createServerClient()

  const { data: projeler } = await supabase
    .from("projects")
    .select("*")
    .eq("status", "published")
    .order("stars", { ascending: false })
    .limit(20)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">

        <div className="absolute top-20 left-10 size-96 bg-secondary/10 rounded-full blur-[120px]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
              Topluluk <span className="gradient-text">Projeleri</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              Topluluğumuzun geliştirdiği açık kaynak projeler ve boilerplate'ler
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {projeler && projeler.length > 0 ? (
              projeler.map((proje: any) => {
                const teknolojiler = Array.isArray(proje.technologies)
                  ? proje.technologies
                  : JSON.parse(proje.technologies || "[]")

                return (
                  <Card
                    key={proje.id}
                    className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50"
                  >
                    <Link href={`/projeler/${proje.id}`}>
                      <CardHeader>
                        <CardTitle className="group-hover:text-primary transition-colors">{proje.title}</CardTitle>
                        <CardDescription>{proje.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {teknolojiler.slice(0, 4).map((tek: string) => (
                            <Badge key={tek} variant="secondary" className="text-xs">
                              {tek}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Heart className="size-4" />
                            <span>{proje.stars?.toLocaleString("tr-TR") || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="size-4" />
                            <span>{proje.views?.toLocaleString("tr-TR") || 0}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          {proje.github_url && (
                            <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                              <a href={proje.github_url} target="_blank" rel="noopener noreferrer">
                                <Github className="size-4 mr-2" />
                                GitHub
                              </a>
                            </Button>
                          )}
                          <Button size="sm" className="flex-1">
                            Detay
                          </Button>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                )
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">Henüz proje bulunmuyor.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Submit CTA */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Kendi Projenizi Paylaşın</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Geliştirdiğiniz açık kaynak projeleri topluluğumuzla paylaşmak için başvurun
            </p>
            <Button size="lg" asChild>
              <Link href="/iletisim">Proje Gönder</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
