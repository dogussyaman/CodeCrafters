import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Plus, ArrowRight } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"

const statusLabels: Record<string, string> = {
  pending: "Beklemede",
  approved: "Onaylandı",
  rejected: "Reddedildi",
}

export default async function AdminSirketTalepleriPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/giris")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  const role = profile?.role
  if (role !== "admin" && role !== "platform_admin" && role !== "mt") {
    redirect("/dashboard/admin")
  }

  const { data: requests, error } = await supabase
    .from("company_requests")
    .select("id, user_id, company_name, company_website, company_description, company_size, industry, reason, status, created_at, created_company_id, plan")
    .order("created_at", { ascending: false })

  if (error) {
    return (
      <div className="container mx-auto p-6 min-h-screen">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="h-6 w-6" />
          Şirket Talepleri
        </h1>
        <p className="text-destructive mt-2">Veriler yüklenemedi: {error.message}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Building2 className="size-8 text-primary" />
          Şirket Talepleri
        </h1>
        <p className="text-muted-foreground mt-2">
          Kullanıcıların şirket kayıt talepleri. Onaylanan talepler için &quot;Şirket oluştur&quot; ile yeni şirket ekleyebilirsiniz.
        </p>
      </div>

      <div className="space-y-4">
        {!requests?.length ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Henüz şirket talebi yok.
            </CardContent>
          </Card>
        ) : (
          requests.map((r: {
            id: string
            user_id: string
            company_name: string
            company_website: string | null
            company_description: string | null
            company_size: string | null
            industry: string | null
            reason: string
            status: string
            created_at: string
            created_company_id: string | null
            plan?: string | null
          }) => (
            <Card key={r.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-4 flex-wrap">
                <div>
                  <CardTitle className="text-base">{r.company_name}</CardTitle>
                  <CardDescription>
                    {r.company_website && `${r.company_website} · `}
                    Kullanıcı ID: {r.user_id.slice(0, 8)}... · {formatDistanceToNow(new Date(r.created_at), { addSuffix: true, locale: tr })}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {r.plan && (
                    <Badge variant="outline" className="capitalize">
                      {r.plan === "orta" ? "Orta" : r.plan === "premium" ? "Premium" : "Free"}
                    </Badge>
                  )}
                  <Badge variant={r.status === "pending" ? "default" : "secondary"}>
                    {statusLabels[r.status] ?? r.status}
                  </Badge>
                  {r.status === "approved" && !r.created_company_id && (
                    <Button size="sm" asChild>
                      <Link href={`/dashboard/admin/sirketler/olustur?from_request=${r.id}`}>
                        <Plus className="h-4 w-4 mr-1" />
                        Şirket oluştur
                      </Link>
                    </Button>
                  )}
                  {r.created_company_id && (
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/dashboard/admin/sirketler/${r.created_company_id}`}>
                        Şirketi görüntüle
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {r.company_description && (
                  <p className="text-sm text-muted-foreground">{r.company_description}</p>
                )}
                {(r.company_size || r.industry) && (
                  <p className="text-xs text-muted-foreground">
                    {[r.company_size, r.industry].filter(Boolean).join(" · ")}
                  </p>
                )}
                <p className="text-sm whitespace-pre-wrap">{r.reason}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
