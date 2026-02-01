import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Github, ExternalLink, Heart, Eye, ArrowLeft, Code2 } from "lucide-react"
import { createServerClient } from "@/lib/supabase/server"
import { ProjectLikeButton } from "./_components/ProjectLikeButton"
import { ProjectJoinRequestButton } from "./_components/ProjectJoinRequestButton"

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

  const [{ count: likesCount }, { data: { user } }] = await Promise.all([
    supabase.from("project_likes").select("*", { count: "exact", head: true }).eq("project_id", id),
    supabase.auth.getUser(),
  ])
  const userLiked = user
    ? (await supabase.from("project_likes").select("id").eq("project_id", id).eq("user_id", user.id).maybeSingle()).data != null
    : false

  const joinRequest = user
    ? (await supabase.from("project_join_requests").select("id, status").eq("project_id", id).eq("user_id", user.id).maybeSingle()).data
    : null
  const isOwner = user && proje.created_by === user.id
  const showJoinRequestButton = user && !isOwner

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
                  <span>{(likesCount ?? 0).toLocaleString("tr-TR")} beğeni</span>
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

              {proje.inspired_by && (
                <div className="rounded-lg border bg-muted/20 p-4">
                  <h3 className="font-semibold mb-1">İlham alınan proje</h3>
                  {proje.inspired_by.startsWith("http") ? (
                    <a
                      href={proje.inspired_by}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {proje.inspired_by}
                    </a>
                  ) : (
                    <p className="text-muted-foreground">{proje.inspired_by}</p>
                  )}
                </div>
              )}

              <div className="bg-muted/30 rounded-lg p-6">
                <h3 className="font-semibold mb-3">Bu projeyi beğendiniz mi?</h3>
                <div className="flex flex-wrap gap-3">
                  <ProjectLikeButton
                    projectId={proje.id}
                    initialLiked={userLiked}
                    initialCount={likesCount ?? 0}
                  />
                  {proje.github_url && (
                    <Button variant="outline" className="gap-2 bg-transparent" asChild>
                      <Link href={proje.github_url} target="_blank">
                        <Github className="size-4" />
                        GitHub&apos;da Star Ver
                      </Link>
                    </Button>
                  )}
                  {showJoinRequestButton && (
                    <ProjectJoinRequestButton
                      projectId={proje.id}
                      disabled={!!joinRequest}
                    />
                  )}
                </div>
                {showJoinRequestButton && joinRequest && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    {joinRequest.status === "pending"
                      ? "Katılma isteğiniz proje sahibine iletildi."
                      : joinRequest.status === "approved"
                        ? "Katılma isteğiniz onaylandı."
                        : "Katılma isteğiniz reddedildi."}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
