"use client"

import { useActionState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react"
import { createProject, updateProject, type ProjectFormState } from "../actions"
import { toast } from "sonner"

interface ProjectFormProps {
  mode: "create" | "edit"
  projectId?: string
  initialValues?: {
    title: string
    description: string
    long_description?: string | null
    technologies: string[]
    github_url?: string | null
    demo_url?: string | null
    category?: string | null
    inspired_by?: string | null
    status: string
  }
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="gap-2">
      {pending && <Loader2 className="size-4 animate-spin" />}
      {pending ? "Kaydediliyor..." : "Kaydet"}
    </Button>
  )
}

export function ProjectForm({ mode, projectId, initialValues }: ProjectFormProps) {
  const router = useRouter()
  const action =
    mode === "create"
      ? createProject
      : (prev: ProjectFormState, fd: FormData) => updateProject(projectId!, prev, fd)

  const [state, formAction] = useActionState(action, { ok: false })

  useEffect(() => {
    if (state.ok) {
      toast.success(mode === "create" ? "Proje eklendi" : "Proje güncellendi")
      if (mode === "create") router.push("/dashboard/gelistirici/projelerim")
      else router.refresh()
    } else if (state.error) {
      toast.error(state.error)
    }
  }, [state, mode, router])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/gelistirici/projelerim">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <CardTitle>{mode === "create" ? "Yeni Proje" : "Projeyi Düzenle"}</CardTitle>
            <CardDescription>
              {mode === "create"
                ? "Proje bilgilerini girin. Taslak olarak kaydedip sonra yayınlayabilirsiniz."
                : "Proje bilgilerini güncelleyin."}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Başlık *</Label>
            <Input
              id="title"
              name="title"
              placeholder="Proje adı"
              defaultValue={initialValues?.title}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Kısa açıklama *</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Birkaç cümleyle projeyi tanıtın"
              defaultValue={initialValues?.description}
              rows={3}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="long_description">Detaylı açıklama</Label>
            <Textarea
              id="long_description"
              name="long_description"
              placeholder="Kurulum, kullanım, katkı rehberi vb."
              defaultValue={initialValues?.long_description ?? ""}
              rows={6}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="technologies">Teknolojiler</Label>
            <Input
              id="technologies"
              name="technologies"
              placeholder="React, TypeScript, Node.js (virgülle ayırın)"
              defaultValue={Array.isArray(initialValues?.technologies) ? initialValues.technologies.join(", ") : ""}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="github_url">GitHub URL</Label>
              <Input
                id="github_url"
                name="github_url"
                type="url"
                placeholder="https://github.com/..."
                defaultValue={initialValues?.github_url ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="demo_url">Demo URL</Label>
              <Input
                id="demo_url"
                name="demo_url"
                type="url"
                placeholder="https://..."
                defaultValue={initialValues?.demo_url ?? ""}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="inspired_by">İlham alınan proje</Label>
            <Input
              id="inspired_by"
              name="inspired_by"
              placeholder="URL veya kısa açıklama (örn: GitHub repo linki)"
              defaultValue={initialValues?.inspired_by ?? ""}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Input
                id="category"
                name="category"
                placeholder="örn. Web, CLI, Oyun"
                defaultValue={initialValues?.category ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Durum</Label>
              <select
                id="status"
                name="status"
                defaultValue={initialValues?.status ?? "draft"}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="draft">Taslak</option>
                <option value="published">Yayınla</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <SubmitButton />
            <Button type="button" variant="outline" asChild>
              <Link href="/dashboard/gelistirici/projelerim">İptal</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
