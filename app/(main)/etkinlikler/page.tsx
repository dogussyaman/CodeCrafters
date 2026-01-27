import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock } from "lucide-react"

export default function EtkinliklerPage() {
  const etkinlikler = [
    {
      id: 1,
      baslik: "React Summit Istanbul 2024",
      aciklama: "React ekosistemindeki en son gelişmeleri keşfedin",
      tarih: "15 Mart 2024",
      saat: "09:00 - 18:00",
      konum: "Istanbul Congress Center",
      katilimci: 500,
      tip: "Konferans",
      durum: "Yakında",
    },
    {
      id: 2,
      baslik: "Backend Masters Workshop",
      aciklama: "Node.js ve mikroservis mimarisi üzerine uygulamalı workshop",
      tarih: "22 Mart 2024",
      saat: "14:00 - 17:00",
      konum: "Online",
      katilimci: 200,
      tip: "Workshop",
      durum: "Kayıt Açık",
    },
    {
      id: 3,
      baslik: "AI & Machine Learning Meetup",
      aciklama: "Yapay zeka projelerini paylaşın ve networking yapın",
      tarih: "28 Mart 2024",
      saat: "18:30 - 21:00",
      konum: "Ankara Techpark",
      katilimci: 150,
      tip: "Meetup",
      durum: "Kayıt Açık",
    },
    {
      id: 4,
      baslik: "DevOps Turkey Conference",
      aciklama: "CI/CD, Kubernetes ve cloud native uygulamalar",
      tarih: "5 Nisan 2024",
      saat: "10:00 - 19:00",
      konum: "Izmir Kongre Merkezi",
      katilimci: 800,
      tip: "Konferans",
      durum: "Erken Kayıt",
    },
    {
      id: 5,
      baslik: "Women in Tech Panel",
      aciklama: "Teknoloji sektöründe kadınlar için kariyer paneli",
      tarih: "12 Nisan 2024",
      saat: "19:00 - 21:00",
      konum: "Online",
      katilimci: 300,
      tip: "Panel",
      durum: "Kayıt Açık",
    },
    {
      id: 6,
      baslik: "Hackathon: Build for Good",
      aciklama: "48 saatlik sosyal etki odaklı hackathon",
      tarih: "19-21 Nisan 2024",
      saat: "Cuma 18:00 - Pazar 18:00",
      konum: "Bursa Teknokent",
      katilimci: 100,
      tip: "Hackathon",
      durum: "Son Günler",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">

        <div className="absolute bottom-10 left-10 size-96 bg-primary/10 rounded-full blur-[120px]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
              Yaklaşan <span className="gradient-text">Etkinlikler</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              Sektörün önde gelen etkinliklerine katılın, networking yapın ve kendinizi geliştirin
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="pb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {["Tümü", "Konferans", "Workshop", "Meetup", "Hackathon", "Panel"].map((tip) => (
              <Button key={tip} variant="outline" size="sm">
                {tip}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {etkinlikler.map((etkinlik) => (
              <Card
                key={etkinlik.id}
                className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary">{etkinlik.tip}</Badge>
                    <Badge
                      variant={etkinlik.durum === "Son Günler" ? "destructive" : "default"}
                      className={etkinlik.durum === "Erken Kayıt" ? "bg-green-500" : ""}
                    >
                      {etkinlik.durum}
                    </Badge>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">{etkinlik.baslik}</CardTitle>
                  <CardDescription>{etkinlik.aciklama}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="size-4 shrink-0" />
                    <span>{etkinlik.tarih}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="size-4 shrink-0" />
                    <span>{etkinlik.saat}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="size-4 shrink-0" />
                    <span>{etkinlik.konum}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="size-4 shrink-0" />
                    <span>{etkinlik.katilimci} katılımcı</span>
                  </div>
                  <Button className="w-full mt-4">Kayıt Ol</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Host CTA */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Etkinlik Düzenlemek İster misiniz?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Kendi etkinliğinizi organize edin ve topluluğumuzu davet edin
            </p>
            <Button size="lg" asChild>
              <Link href="/iletisim">Etkinlik Öner</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
