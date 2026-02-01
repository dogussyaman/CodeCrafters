"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function addBlogComment(postId: string, body: string, parentId: string | null = null) {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "Yorum yapmak için giriş yapmalısınız" }

  const trimmed = body?.trim()
  if (!trimmed || trimmed.length < 2) return { ok: false, error: "En az 2 karakter yazın" }

  const { data: post } = await supabase
    .from("blog_posts")
    .select("id, slug")
    .eq("id", postId)
    .eq("status", "published")
    .single()
  if (!post) return { ok: false, error: "Yazı bulunamadı" }

  const { error } = await supabase.from("blog_comments").insert({
    post_id: postId,
    user_id: user.id,
    parent_id: parentId || null,
    body: trimmed,
  })
  if (error) {
    console.error("Blog comment insert error:", error)
    return { ok: false, error: "Yorum eklenemedi" }
  }

  revalidatePath(`/blog/${post.slug}`)
  revalidatePath("/blog")
  return { ok: true }
}
