"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { useFormStatus } from "react-dom"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Loader2, ImagePlus, X } from "lucide-react"
import { createProject, updateProject, uploadProjectImage, type ProjectFormState } from "../actions"
import { toast } from "sonner"

interface ProjectFormProps {
  mode: "create" | "edit"
  projectId?: string
  /** Create sayfasında tam sayfa layout kullanıldığında Card sarmalayıcı kaldırılır */
  noCard?: boolean
  /** Create başarılı olunca yönlendirilecek path (admin için /dashboard/admin/projeler) */
  redirectBasePath?: string
  /** Geri / İptal linki (admin için /dashboard/admin/projeler) */
  listPath?: string
  initialValues?: {
    title: string
    description: string
    long_description?: string | null
    technologies: string[]
    github_url?: string | null
    demo_url?: string | null
    image_url?: string | null
    category?: string | null
    inspired_by?: string | null
    status: string
  }
}

function SubmitButton({ status }: { status: string }) {
  const { pending } = useFormStatus()
  const isPublish = status === "published"
  const label = pending
    ? isPublish
      ? "Yayınlanıyor..."
      : "Kaydediliyor..."
    : isPublish
      ? "Yayınla"
      : "Kaydet"
  return (
    <Button type="submit" disabled={pending} className="gap-2">
      {pending && <Loader2 className="size-4 animate-spin" />}
      {label}
    </Button>
  )
}

const defaultListPath = "/dashboard/gelistirici/projelerim"

export function ProjectForm({ mode, projectId, initialValues, noCard, redirectBasePath, listPath = defaultListPath }: ProjectFormProps) {
  const router = useRouter()
  const [imageUrl, setImageUrl] = useState(initialValues?.image_url ?? "")
  const [status, setStatus] = useState(initialValues?.status ?? "draft")
  const action =
    mode === "create"
      ? createProject
      : (prev: ProjectFormState, fd: FormData) => updateProject(projectId!, prev, fd)

  const [state, formAction] = useActionState(action, { ok: false })
  const [uploadState, uploadFormAction] = useActionState(uploadProjectImage, { ok: false })
  const [isUploading, setIsUploading] = useState(false)
  const uploadFormRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.ok) {
      toast.success(mode === "create" ? "Proje eklendi" : "Proje güncellendi")
      if (mode === "create") {
        const path = redirectBasePath ?? "/dashboard/gelistirici/projelerim"
        window.location.href = path
      } else {
        router.refresh()
      }
    } else if (state.error) {
      toast.error(state.error)
    }
  }, [state, mode, router, redirectBasePath])

  useEffect(() => {
    setIsUploading(false)
    if (uploadState.ok && uploadState.url) {
      setImageUrl(uploadState.url)
      toast.success("Görsel yüklendi")
    } else if (uploadState.error) {
      toast.error(uploadState.error)
    }
  }, [uploadState])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file?.size) return
    setIsUploading(true)
    uploadFormRef.current?.requestSubmit()
  }

  const header = (
    <div className={noCard ? "mb-6" : undefined}>
      {!noCard && (
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={listPath}>
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
        </div>
      )}
      <div className={noCard ? undefined : "mt-2"}>
        <h1 className="text-2xl font-semibold tracking-tight">
          {mode === "create" ? "Yeni Proje" : "Projeyi Düzenle"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "create"
            ? "Proje bilgilerini girin. Taslak olarak kaydedip sonra yayınlayabilirsiniz."
            : "Proje bilgilerini güncelleyin."}
        </p>
      </div>
    </div>
  )

  const formContent = (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Proje görseli (opsiyonel)</Label>
        {imageUrl ? (
          <div className="flex items-start gap-3">
            <div className="relative size-24 overflow-hidden rounded-lg border bg-muted shrink-0">
              <Image src={imageUrl} alt="Proje görseli" fill className="object-cover" sizes="96px" />
            </div>
            <Button type="button" variant="outline" size="sm" className="gap-1" onClick={() => setImageUrl("")}>
              <X className="size-3.5" />
              Kaldır
            </Button>
          </div>
        ) : (
          <form ref={uploadFormRef} action={uploadFormAction} className="flex flex-wrap items-center gap-2">
            <input
              type="file"
              name="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="text-sm file:mr-2 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-primary-foreground file:text-sm"
              onChange={handleFileChange}
            />
            {isUploading && (
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Loader2 className="size-4 animate-spin" />
                Yükleniyor…
              </span>
            )}
            <span className="text-xs text-muted-foreground">Dosya seçildiğinde otomatik yüklenir</span>
          </form>
        )}
      </div>
      <form action={formAction} className="space-y-6">
          {state.error && (
            <div className="rounded-md bg-destructive/10 text-destructive text-sm p-3" role="alert">
              {state.error}
            </div>
          )}
          <input type="hidden" name="image_url" value={imageUrl} />
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
              <Select
                value={status}
                onValueChange={setStatus}
              >
                <SelectTrigger id="status" className="w-full">
                  <SelectValue placeholder="Durum seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Taslak</SelectItem>
                  <SelectItem value="published">Yayınla</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" name="status" value={status} />
            </div>
          </div>
          <div className="flex gap-2">
            <SubmitButton status={status} />
            <Button type="button" variant="outline" asChild>
              <Link href={listPath}>İptal</Link>
            </Button>
          </div>
        </form>
    </div>
  )

  if (noCard) {
    return (
      <div>
        {header}
        {formContent}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={listPath}>
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
        {formContent}
      </CardContent>
    </Card>
  )
}
