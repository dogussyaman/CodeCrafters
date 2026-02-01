"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const projectSchema = z.object({
  title: z.string().min(2, "Başlık en az 2 karakter olmalıdır"),
  description: z.string().min(10, "Açıklama en az 10 karakter olmalıdır"),
  long_description: z.string().optional(),
  technologies: z.array(z.string()).default([]),
  github_url: z.string().url().optional().or(z.literal("")),
  demo_url: z.string().url().optional().or(z.literal("")),
  category: z.string().optional(),
  inspired_by: z.string().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
})

export type ProjectFormState = { ok: boolean; error?: string }

export async function createProject(_prev: ProjectFormState, formData: FormData): Promise<ProjectFormState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "Oturum açmanız gerekiyor" }

  const raw = {
    title: formData.get("title"),
    description: formData.get("description"),
    long_description: formData.get("long_description") || undefined,
    technologies: (formData.get("technologies") as string)?.split(",").map((s) => s.trim()).filter(Boolean) ?? [],
    github_url: (formData.get("github_url") as string) || null,
    demo_url: (formData.get("demo_url") as string) || null,
    category: (formData.get("category") as string) || null,
    inspired_by: (formData.get("inspired_by") as string) || null,
    status: (formData.get("status") as string) || "draft",
  }
  const parsed = projectSchema.safeParse(raw)
  if (!parsed.success) {
    const msg = parsed.error.flatten().formErrors[0] ?? "Veri doğrulama hatası"
    return { ok: false, error: msg }
  }

  const { error } = await supabase.from("projects").insert({
    ...parsed.data,
    github_url: parsed.data.github_url || null,
    demo_url: parsed.data.demo_url || null,
    category: parsed.data.category || null,
    inspired_by: parsed.data.inspired_by?.trim() || null,
    created_by: user.id,
  })

  if (error) {
    console.error("Project create error:", error)
    return { ok: false, error: "Proje eklenirken bir hata oluştu" }
  }

  revalidatePath("/dashboard/gelistirici/projelerim")
  revalidatePath("/projeler")
  return { ok: true }
}

export async function updateProject(
  projectId: string,
  _prev: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "Oturum açmanız gerekiyor" }

  const raw = {
    title: formData.get("title"),
    description: formData.get("description"),
    long_description: formData.get("long_description") || undefined,
    technologies: (formData.get("technologies") as string)?.split(",").map((s) => s.trim()).filter(Boolean) ?? [],
    github_url: (formData.get("github_url") as string) || null,
    demo_url: (formData.get("demo_url") as string) || null,
    category: (formData.get("category") as string) || null,
    inspired_by: (formData.get("inspired_by") as string) || null,
    status: (formData.get("status") as string) || "draft",
  }
  const parsed = projectSchema.safeParse(raw)
  if (!parsed.success) {
    const msg = parsed.error.flatten().formErrors[0] ?? "Veri doğrulama hatası"
    return { ok: false, error: msg }
  }

  const { error } = await supabase
    .from("projects")
    .update({
      ...parsed.data,
      github_url: parsed.data.github_url || null,
      demo_url: parsed.data.demo_url || null,
      category: parsed.data.category || null,
      inspired_by: parsed.data.inspired_by?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", projectId)
    .eq("created_by", user.id)

  if (error) {
    console.error("Project update error:", error)
    return { ok: false, error: "Proje güncellenirken bir hata oluştu" }
  }

  revalidatePath("/dashboard/gelistirici/projelerim")
  revalidatePath(`/dashboard/gelistirici/projelerim/${projectId}/duzenle`)
  revalidatePath("/projeler")
  revalidatePath(`/projeler/${projectId}`)
  return { ok: true }
}

export async function deleteProject(projectId: string): Promise<ProjectFormState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "Oturum açmanız gerekiyor" }

  const { error } = await supabase.from("projects").delete().eq("id", projectId).eq("created_by", user.id)

  if (error) {
    console.error("Project delete error:", error)
    return { ok: false, error: "Proje silinirken bir hata oluştu" }
  }

  revalidatePath("/dashboard/gelistirici/projelerim")
  revalidatePath("/projeler")
  return { ok: true }
}

export async function respondToJoinRequest(
  requestId: string,
  status: "approved" | "rejected"
): Promise<ProjectFormState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "Oturum açmanız gerekiyor" }

  const { data: req } = await supabase
    .from("project_join_requests")
    .select("id, project_id, user_id, status")
    .eq("id", requestId)
    .single()
  if (!req || req.status !== "pending") return { ok: false, error: "İstek bulunamadı veya zaten yanıtlandı" }

  const { data: project } = await supabase
    .from("projects")
    .select("id, title, created_by")
    .eq("id", req.project_id)
    .single()
  if (!project || project.created_by !== user.id) return { ok: false, error: "Yetkiniz yok" }

  const { error: updateError } = await supabase
    .from("project_join_requests")
    .update({ status, responded_at: new Date().toISOString() })
    .eq("id", requestId)
  if (updateError) {
    console.error("Join request update error:", updateError)
    return { ok: false, error: "Yanıt kaydedilemedi" }
  }

  const notifTitle =
    status === "approved"
      ? "Proje katılma isteğiniz onaylandı"
      : "Proje katılma isteğiniz reddedildi"
  const notifBody =
    status === "approved"
      ? `"${project.title}" projesine katılma isteğiniz onaylandı.`
      : `"${project.title}" projesine katılma isteğiniz reddedildi.`
  await supabase.from("notifications").insert({
    recipient_id: req.user_id,
    actor_id: user.id,
    type: "system",
    title: notifTitle,
    body: notifBody,
    href: "/projeler",
    data: { project_id: req.project_id, request_id: requestId, status },
  })

  revalidatePath("/dashboard/gelistirici/projelerim")
  return { ok: true }
}
