import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Github, ExternalLink, Heart, Eye, ArrowLeft, Code2 } from "lucide-react"
import { createServerClient } from "@/lib/supabase/server"

export default async function ProjeDetayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerClient()

  const { data: proje, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .single()

  if (error || !proje) {
    notFound()
  }

  const teknolojiler = Array.isArray(proje.technologies) ? proje.technologies : JSON.parse(proje.technologies || "[]")

  return (
    <div className="min-h-screen bg-background py-32">
      <div className="container mx-auto px-4 max-w-5xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/projeler">
            <ArrowLeft className="mr-2 size-4" />
            Tüm Projeler
          </Link>
        </Button>

        <Card className="overflow-hidden">
          {proje.image_url && (
            <div className="w-full h-80 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Code2 className="size-32 text-primary/30" />
            </div>
          )}
          <CardContent className="p-8">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Heart className="size-4" />
                  <span>{proje.stars?.toLocaleString("tr-TR") || 0} beğeni</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="size-4" />
                  <span>{proje.views?.toLocaleString("tr-TR") || 0} görüntülenme</span>
                </div>
                {proje.category && <Badge variant="secondary">{proje.category}</Badge>}
              </div>
              <h1 className="text-4xl font-bold mb-4">{proje.title}</h1>
              <p className="text-xl text-muted-foreground mb-6">{proje.description}</p>
              <div className="flex gap-3">
                {proje.github_url && (
                  <Button asChild>
                    <Link href={proje.github_url} target="_blank">
                      <Github className="mr-2 size-4" />
                      GitHub
                    </Link>
                  </Button>
                )}
                {proje.demo_url && (
                  <Button variant="outline" asChild>
                    <Link href={proje.demo_url} target="_blank">
                      <ExternalLink className="mr-2 size-4" />
                      Demo
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            <Separator className="my-8" />

            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Proje Detayları</h2>
                <p className="text-muted-foreground whitespace-pre-line">
                  {proje.long_description || proje.description}
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Kullanılan Teknolojiler</h2>
                <div className="flex flex-wrap gap-2">
                  {teknolojiler.map((tek: string) => (
                    <Badge key={tek} variant="secondary" className="text-sm">
                      {tek}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-6">
                <h3 className="font-semibold mb-3">Bu projeyi beğendiniz mi?</h3>
                <div className="flex gap-3">
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Heart className="size-4" />
                    Beğen
                  </Button>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Github className="size-4" />
                    Star Ver
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
