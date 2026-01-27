import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Plus, Globe } from "lucide-react"
import Link from "next/link"

export default async function CompaniesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: companies } = await supabase
    .from("companies")
    .select("*")
    .eq("created_by", user!.id)
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Şirketler</h1>
          <p className="text-muted-foreground">Şirket bilgilerinizi yönetin</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/ik/sirketler/olustur">
            <Plus className="mr-2 size-4" />
            Yeni Şirket
          </Link>
        </Button>
      </div>

      {!companies || companies.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Building2 className="size-16 text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-lg font-semibold mb-2">Henüz şirket eklemediniz</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              İş ilanı yayınlamak için önce şirket bilgilerini ekleyin
            </p>
            <Button asChild>
              <Link href="/dashboard/ik/sirketler/olustur">
                <Plus className="mr-2 size-4" />
                İlk Şirketi Ekle
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {companies.map((company) => (
            <Card key={company.id} className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="size-14 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Building2 className="size-7 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-xl truncate">{company.name}</CardTitle>
                    {company.industry && <CardDescription className="mt-1">{company.industry}</CardDescription>}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {company.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{company.description}</p>
                )}
                {company.website && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Globe className="size-4" />
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors truncate"
                    >
                      {company.website}
                    </a>
                  </div>
                )}
                <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                  <Link href={`/dashboard/ik/sirketler/${company.id}/duzenle`}>Düzenle</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
