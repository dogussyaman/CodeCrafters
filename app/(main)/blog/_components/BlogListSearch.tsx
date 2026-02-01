"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText, Search } from "lucide-react"
import { Label } from "@/components/ui/label"

type PostRow = {
  id: string
  title: string
  slug: string
  body: string | null
  published_at: string | null
  created_at: string
  profiles?: { full_name?: string; avatar_url?: string } | null
}

interface BlogListSearchProps {
  initialPosts: PostRow[]
  render?: (filteredPosts: PostRow[]) => React.ReactNode
}

export function BlogListSearch({ initialPosts, render }: BlogListSearchProps) {
  const [q, setQ] = useState("")

  const filteredPosts = useMemo(() => {
    const lower = q.toLowerCase().trim()
    if (!lower) return initialPosts
    return initialPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(lower) ||
        (post.body ?? "").toLowerCase().includes(lower)
    )
  }, [initialPosts, q])

  if (render) {
    return (
      <>
        <div className="mb-8 max-w-md">
          <Label htmlFor="blog-search" className="sr-only">
            Yazı ara
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="blog-search"
              type="search"
              placeholder="Başlık veya içerik ara..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        {render(filteredPosts)}
      </>
    )
  }

  if (!filteredPosts.length) {
    return (
      <>
        <div className="mb-8 max-w-md">
          <Label htmlFor="blog-search" className="sr-only">
            Yazı ara
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              id="blog-search"
              type="search"
              placeholder="Başlık veya içerik ara..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="size-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {q ? "Arama sonucu bulunamadı." : "Henüz yayınlanmış yazı yok."}
            </p>
          </CardContent>
        </Card>
      </>
    )
  }

  return (
    <>
      <div className="mb-8 max-w-md">
        <Label htmlFor="blog-search" className="sr-only">
          Yazı ara
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            id="blog-search"
            type="search"
            placeholder="Başlık veya içerik ara..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => {
          const authorName = post.profiles?.full_name ?? "CodeCrafters"
          const avatarUrl = post.profiles?.avatar_url ?? null
          const dateStr = post.published_at
            ? new Date(post.published_at).toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : new Date(post.created_at).toLocaleDateString("tr-TR")
          const excerpt = (post.body || "")
            .replace(/#{1,6}\s/g, "")
            .slice(0, 160)
          return (
            <li key={post.id}>
              <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-primary/20">
                <Link href={`/blog/${post.slug}`} className="block h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-2 text-lg leading-snug">
                      {post.title}
                    </CardTitle>
                    <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground">
                      <Avatar className="size-8">
                        <AvatarImage src={avatarUrl ?? undefined} />
                        <AvatarFallback className="text-xs">
                          {authorName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{authorName}</span>
                      <span>·</span>
                      <time dateTime={post.published_at ?? post.created_at}>
                        {dateStr}
                      </time>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                      {excerpt}…
                    </p>
                    <span className="inline-block mt-3 text-sm font-medium text-primary hover:underline">
                      Devamını oku →
                    </span>
                  </CardContent>
                </Link>
              </Card>
            </li>
          )
        })}
      </ul>
    </>
  )
}
