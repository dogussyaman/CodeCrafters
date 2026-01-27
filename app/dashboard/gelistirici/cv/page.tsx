import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Upload, CheckCircle, XCircle, Clock } from "lucide-react"
import Link from "next/link"
import { CVDeleteButton } from "./cv-delete-button"

export default async function CVPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: cvs } = await supabase
    .from("cvs")
    .select("*")
    .eq("developer_id", user!.id)
    .order("created_at", { ascending: false })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "processed":
        return (
          <Badge className="bg-green-500/10 text-green-700 dark:text-green-400">
            <CheckCircle className="mr-1 size-3" />
            İşlendi
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="secondary">
            <Clock className="mr-1 size-3" />
            İşleniyor
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 size-3" />
            Hata
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 min-h-screen">
      {/* Başlık */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">CV Yönetimi</h1>
          <p className="text-muted-foreground">CV'lerinizi yükleyin ve yönetin</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/gelistirici/cv/yukle">
            <Upload className="mr-2 size-4" />
            Yeni CV Yükle
          </Link>
        </Button>
      </div>

      {/* CV Listesi */}
      {!cvs || cvs.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="size-16 text-muted-foreground mb-4 opacity-20" />
            <h3 className="text-lg font-semibold mb-2">Henüz CV yüklemediniz</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Eşleşme algoritmasının çalışması için lütfen CV'nizi yükleyin
            </p>
            <Button asChild>
              <Link href="/dashboard/gelistirici/cv/yukle">
                <Upload className="mr-2 size-4" />
                İlk CV'nizi Yükleyin
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {cvs.map((cv) => (
            <Card key={cv.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="size-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{cv.file_name}</CardTitle>
                      <CardDescription className="mt-1">Yüklenme: {formatDate(cv.created_at)}</CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(cv.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {cv.parsed_data && (
                      <div className="flex gap-4">
                        <span>
                          Tespit edilen yetenekler:{" "}
                          <span className="font-medium">{cv.parsed_data.skills?.length || 0}</span>
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={cv.file_url} target="_blank">
                        Görüntüle
                      </Link>
                    </Button>
                    <CVDeleteButton cvId={cv.id} fileUrl={cv.file_url} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
