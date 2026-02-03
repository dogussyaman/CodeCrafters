import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Plus, MapPin, DollarSign } from "lucide-react"
import Link from "next/link"

export default async function CompanyJobsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: profile } = await supabase.from("profiles").select("company_id").eq("id", user.id).single()

  const { data: jobs } = await supabase
    .from("job_postings")
    .select(
      `
      *,
      companies:company_id (
        name
      )
    `,
    )
    .eq("company_id", profile?.company_id ?? "")
    .order("created_at", { ascending: false })

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return null
    if (min && max) return `₺${min.toLocaleString()} - ₺${max.toLocaleString()}`
    if (min) return `₺${min.toLocaleString()}+`
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">İş İlanları</h1>
          <p className="text-muted-foreground">Şirketiniz için ilanlar oluşturun ve yönetin</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/company/ilanlar/olustur">
            <Plus className="mr-2 size-4" />
            Yeni İlan
          </Link>
        </Button>
      </div>

      {!jobs || jobs.length === 0 ? (
        <Card className="border-dashed bg-card border-border">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Briefcase className="size-16 text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-lg font-semibold mb-2">Henüz ilan oluşturmadınız</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              İlk iş ilanınızı oluşturarak aday aramaya başlayın
            </p>
            <Button asChild>
              <Link href="/dashboard/company/ilanlar/olustur">
                <Plus className="mr-2 size-4" />
                İlk İlanı Oluştur
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {jobs.map((job: any) => (
            <Card
              key={job.id}
              className="bg-card border-border hover:border-primary/50 transition-colors"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      <Badge
                        variant={job.status === "active" ? "default" : "secondary"}
                        className={job.status === "active" ? "bg-success/10 text-success" : ""}
                      >
                        {job.status === "active" ? "Aktif" : job.status === "draft" ? "Taslak" : "Kapalı"}
                      </Badge>
                    </div>
                    <CardDescription>{job.companies?.name}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  {job.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="size-4" />
                      {job.location}
                    </div>
                  )}
                  {job.job_type && (
                    <Badge variant="outline" className="capitalize">
                      {job.job_type.replace("-", " ")}
                    </Badge>
                  )}
                  {job.experience_level && (
                    <Badge variant="outline" className="capitalize">
                      {job.experience_level}
                    </Badge>
                  )}
                  {formatSalary(job.salary_min, job.salary_max) && (
                    <div className="flex items-center gap-1 font-medium text-foreground">
                      <DollarSign className="size-4" />
                      {formatSalary(job.salary_min, job.salary_max)}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/dashboard/company/ilanlar/${job.id}`}>Düzenle</Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/dashboard/company/eslesmeler?job=${job.id}`}>Eşleşmeleri Gör</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

