import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, UserPlus, Mail, Phone, Calendar, ShieldAlert } from "lucide-react"
import Link from "next/link"
import { format, formatDistanceToNow } from "date-fns"
import { tr } from "date-fns/locale"

export default async function CompanyEmployeesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile } = await supabase.from("profiles").select("company_id").eq("id", user.id).single()

  if (!profile?.company_id) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl min-h-screen">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-lg font-semibold">Şirket Bulunamadı</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Bu kullanıcıya bağlı bir şirket bulunamadı. Lütfen sistem yöneticiniz ile iletişime geçin.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { data: employees } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, title, phone, avatar_url, created_at, updated_at, must_change_password")
    .eq("company_id", profile.company_id)
    .order("created_at", { ascending: true })

  const roleLabel: Record<string, string> = {
    company_admin: "Şirket Sahibi",
    hr: "İK",
    developer: "Geliştirici",
    admin: "Admin",
    platform_admin: "Platform Admin",
    mt: "MT",
  }

  const roleVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
    company_admin: "default",
    hr: "secondary",
    developer: "outline",
    admin: "destructive",
  }

  const total = employees?.length ?? 0
  const hrCount = employees?.filter((e: { role: string }) => e.role === "hr").length ?? 0
  const ownerCount = employees?.filter((e: { role: string }) => e.role === "company_admin").length ?? 0

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 min-h-screen max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Çalışanlar</h1>
          <p className="text-muted-foreground">
            Şirketinizdeki İK ve diğer kullanıcıların listesini görüntüleyin ve yönetin.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/company/calisanlar/olustur">
            <UserPlus className="mr-2 size-4" />
            Yeni İK Kullanıcısı
          </Link>
        </Button>
      </div>

      {!employees || employees.length === 0 ? (
        <Card className="border-dashed bg-muted/30 border-border">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="size-16 text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-lg font-semibold mb-2">Henüz çalışan eklenmemiş</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              İlk İK kullanıcınızı oluşturarak şirketiniz adına ilan yönetimine başlayabilirsiniz.
            </p>
            <Button asChild>
              <Link href="/dashboard/company/calisanlar/olustur">
                <UserPlus className="mr-2 size-4" />
                İK Kullanıcısı Oluştur
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card className="bg-card border-border">
              <CardContent className="pt-4 pb-4">
                <p className="text-2xl font-semibold tabular-nums">{total}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Toplam üye</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="pt-4 pb-4">
                <p className="text-2xl font-semibold tabular-nums">{ownerCount}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Şirket sahibi</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="pt-4 pb-4">
                <p className="text-2xl font-semibold tabular-nums">{hrCount}</p>
                <p className="text-xs text-muted-foreground mt-0.5">İK kullanıcısı</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="pt-4 pb-4">
                <p className="text-2xl font-semibold tabular-nums">{total - ownerCount - hrCount}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Diğer</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground">Ekip listesi</h2>
            <div className="grid grid-cols-1 gap-4">
              {employees.map((emp: {
                id: string
                full_name: string | null
                email: string | null
                role: string
                title: string | null
                phone: string | null
                avatar_url: string | null
                created_at: string
                updated_at?: string | null
                must_change_password?: boolean | null
              }) => (
                <Card key={emp.id} className="bg-card border-border overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-5">
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className="shrink-0 size-12 rounded-full bg-muted flex items-center justify-center overflow-hidden border border-border">
                          {emp.avatar_url ? (
                            <img
                              src={emp.avatar_url}
                              alt=""
                              className="size-full object-cover"
                            />
                          ) : (
                            <span className="text-lg font-semibold text-muted-foreground">
                              {(emp.full_name ?? "?").slice(0, 1).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-foreground truncate">
                              {emp.full_name ?? "—"}
                            </span>
                            <Badge variant={roleVariant[emp.role] ?? "outline"} className="shrink-0 text-xs">
                              {roleLabel[emp.role] ?? emp.role}
                            </Badge>
                            {emp.must_change_password && (
                              <Badge variant="outline" className="shrink-0 text-xs border-amber-500/40 text-amber-700 dark:text-amber-400">
                                <ShieldAlert className="size-3 mr-0.5" />
                                Şifre sıfırlama bekliyor
                              </Badge>
                            )}
                          </div>
                          {emp.title && (
                            <p className="text-sm text-muted-foreground">{emp.title}</p>
                          )}
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            {emp.email && (
                              <a
                                href={`mailto:${emp.email}`}
                                className="inline-flex items-center gap-1.5 hover:text-foreground hover:underline"
                              >
                                <Mail className="size-3.5 shrink-0" />
                                <span className="truncate">{emp.email}</span>
                              </a>
                            )}
                            {emp.phone && (
                              <span className="inline-flex items-center gap-1.5">
                                <Phone className="size-3.5 shrink-0" />
                                {emp.phone}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1.5" title={`Katıldığı tarih: ${format(new Date(emp.created_at), "d MMMM yyyy", { locale: tr })}`}>
                              <Calendar className="size-3.5 shrink-0" />
                              <span>Katıldı: {format(new Date(emp.created_at), "d MMM yyyy", { locale: tr })}</span>
                              <span className="text-muted-foreground/80">({formatDistanceToNow(new Date(emp.created_at), { addSuffix: true, locale: tr })})</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

