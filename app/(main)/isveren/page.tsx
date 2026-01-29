import Link from "next/link"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CreateCompanyRequestForm } from "@/components/company-request/create-company-request-form"
import {
  Building2,
  Users,
  Target,
  Zap,
  Shield,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Search,
  FileText,
  BarChart3,
  Clock,
  DollarSign,
  Globe,
  Award,
  MessageSquare,
} from "lucide-react"

export const metadata: Metadata = {
  title: "İşverenler İçin | Codecrafters",
  description: "Yapay zeka destekli işe alım platformu ile doğru yetenekleri bulun. Codecrafters ile işe alım süreçlerinizi optimize edin.",
}

export default function IsverenPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-20 right-10 size-96 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 left-10 size-96 bg-secondary/10 rounded-full blur-[120px]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
              <span className="gradient-text">Doğru Yetenekleri</span> Bulun
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              Yapay zeka destekli işe alım platformu ile en uygun yazılım geliştiricilerini keşfedin
            </p>
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              <Badge variant="secondary" className="text-sm px-3 py-1">
                <Zap className="mr-1 h-3 w-3" />
                Yapay Zeka Destekli
              </Badge>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                <Shield className="mr-1 h-3 w-3" />
                Güvenli
              </Badge>
              <Badge variant="secondary" className="text-sm px-3 py-1">
                <TrendingUp className="mr-1 h-3 w-3" />
                Hızlı Eşleştirme
              </Badge>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="group">
                <Link href="/auth/kayit">
                  Hemen Başlayın
                  <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/iletisim">Demo Talep Edin</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Neden Codecrafters?</h2>
              <p className="text-xl text-muted-foreground">
                İşe alım süreçlerinizi %90 daha hızlı ve verimli hale getirin
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                    <Search className="size-6 text-primary" />
                  </div>
                  <CardTitle>Akıllı Aday Arama</CardTitle>
                  <CardDescription>
                    Yapay zeka algoritmalarımız CV'leri analiz ederek size en uygun adayları otomatik olarak bulur
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-primary" />
                      <span>50+ teknoloji tanıma</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-primary" />
                      <span>Deneyim seviyesi analizi</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-primary" />
                      <span>Kültürel uyum değerlendirmesi</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                    <Clock className="size-6 text-primary" />
                  </div>
                  <CardTitle>Hızlı İşe Alım</CardTitle>
                  <CardDescription>
                    Geleneksel işe alım süreçlerinden 10 kat daha hızlı. İlk aday önerilerini dakikalar içinde alın
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-primary" />
                      <span>Anında CV analizi</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-primary" />
                      <span>Otomatik eşleştirme</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-primary" />
                      <span>Hızlı başvuru yönetimi</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                    <BarChart3 className="size-6 text-primary" />
                  </div>
                  <CardTitle>Detaylı Raporlama</CardTitle>
                  <CardDescription>
                    İşe alım süreçlerinizi analiz edin, performans metriklerinizi takip edin ve optimize edin
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-primary" />
                      <span>Başvuru istatistikleri</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-primary" />
                      <span>Eşleştirme oranları</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-primary" />
                      <span>Zaman tasarrufu analizi</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Separator className="max-w-6xl mx-auto" />

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Nasıl Çalışır?</h2>
              <p className="text-xl text-muted-foreground">
                Basit ve etkili işe alım süreci
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: "01",
                  title: "İlan Oluşturun",
                  description: "İş tanımınızı, gereksinimlerinizi ve tercihlerinizi belirtin",
                  icon: FileText,
                },
                {
                  step: "02",
                  title: "Otomatik Eşleştirme",
                  description: "Yapay zeka algoritmamız size en uygun adayları bulur",
                  icon: Zap,
                },
                {
                  step: "03",
                  title: "Adayları İnceleyin",
                  description: "Eşleşen adayların CV'lerini ve profillerini detaylı inceleyin",
                  icon: Users,
                },
                {
                  step: "04",
                  title: "İletişime Geçin",
                  description: "Beğendiğiniz adaylarla doğrudan iletişime geçin ve görüşme ayarlayın",
                  icon: MessageSquare,
                },
              ].map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary font-bold text-xl mb-4">
                      {item.step}
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 mb-4">
                      <item.icon className="size-8 text-primary mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </div>
                  {idx < 3 && (
                    <div className="hidden md:block absolute top-8 left-full w-full">
                      <ArrowRight className="size-6 text-muted-foreground mx-auto" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Separator className="max-w-6xl mx-auto" />

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Özellikler</h2>
              <p className="text-xl text-muted-foreground">
                İşe alım süreçlerinizi kolaylaştıran güçlü araçlar
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Building2 className="size-5 text-primary" />
                    </div>
                    <CardTitle>Şirket Profili Yönetimi</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Şirketinizin profilini oluşturun, logo ve bilgilerinizi güncelleyin. Marka kimliğinizi yansıtın.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Target className="size-5 text-primary" />
                    </div>
                    <CardTitle>Hedefli İlan Yayınlama</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    İlanlarınızı doğru adaylara ulaştırın. Yapay zeka algoritmamız ilanınızı en uygun adaylara gösterir.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Users className="size-5 text-primary" />
                    </div>
                    <CardTitle>Başvuru Yönetimi</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Tüm başvuruları tek bir yerden yönetin. Adayları filtreleyin, sıralayın ve durumlarını takip edin.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Award className="size-5 text-primary" />
                    </div>
                    <CardTitle>Kaliteli Aday Havuzu</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    10.000+ aktif geliştirici arasından size en uygun yetenekleri bulun. Tüm adaylar doğrulanmış profillere sahip.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Shield className="size-5 text-primary" />
                    </div>
                    <CardTitle>Güvenli ve Gizli</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Tüm verileriniz şifrelenmiş olarak saklanır. KVKK ve GDPR uyumlu platform ile güvenle çalışın.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Globe className="size-5 text-primary" />
                    </div>
                    <CardTitle>7/24 Erişim</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Platformumuza istediğiniz zaman, istediğiniz yerden erişin. Mobil uyumlu arayüz ile her yerden yönetin.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Separator className="max-w-6xl mx-auto" />

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { value: "10K+", label: "Aktif Geliştirici", icon: Users },
              { value: "500+", label: "Şirket Ortağımız", icon: Building2 },
              { value: "15K+", label: "Başarılı Eşleşme", icon: Target },
              { value: "95%", label: "Memnuniyet Oranı", icon: Award },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 text-primary mb-4">
                  <stat.icon className="size-8" />
                </div>
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator className="max-w-6xl mx-auto" />

      {/* Şirket kayıt talebi */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="border-primary/20 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-primary" />
                  <CardTitle>Şirket kayıt talebi</CardTitle>
                </div>
                <CardDescription>
                  Platformda şirket hesabı açmak için giriş yapıp talebinizi gönderin. İncelendikten sonra size dönüş yapacağız.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CreateCompanyRequestForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="max-w-6xl mx-auto" />

      {/* Pricing CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Hemen Başlayın</h2>
            <p className="text-xl text-muted-foreground mb-8">
              İşe alım süreçlerinizi optimize etmek için bugün kaydolun
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="group">
                <Link href="/auth/kayit">
                  Ücretsiz Kaydol
                  <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/iletisim">Demo Talep Edin</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Kurumsal paketler için{" "}
              <Link href="/iletisim" className="text-primary hover:underline">
                bizimle iletişime geçin
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
