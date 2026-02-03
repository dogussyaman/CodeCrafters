import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, UserPlus } from "lucide-react"
import Link from "next/link"

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
          <CardHeader>
            <CardTitle>Şirket Bulunamadı</CardTitle>
            <CardDescription>
              Bu kullanıcıya bağlı bir şirket bulunamadı. Lütfen sistem yöneticiniz ile iletişime geçin.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const { data: employees } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, title, phone, created_at")
    .eq("company_id", profile.company_id)
    .order("created_at", { ascending: true })

  const roleLabel: Record<string, string> = {
    company_admin: "Şirket Sahibi",
    hr: "İK",
    developer: "Geliştirici",
    admin: "Admin",
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Çalışanlar</h1>
          <p className="text-muted-foreground">
            Şirketinizdeki İK ve diğer kullanıcıların listesini görüntüleyin.
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
        <Card className="border-dashed bg-card border-border">
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
        <div className="grid grid-cols-1 gap-4">
          {employees.map((emp: any) => (
            <Card
              key={emp.id}
              className="bg-card border-border"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-1">
                    <CardTitle className="text-lg">{emp.full_name}</CardTitle>
                    <CardDescription>{emp.email}</CardDescription>
                    {emp.phone && (
                      <p className="text-xs text-muted-foreground">Telefon: {emp.phone}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="outline">
                      {roleLabel[emp.role] ?? emp.role}
                    </Badge>
                    {emp.title && (
                      <span className="text-xs text-muted-foreground">{emp.title}</span>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

