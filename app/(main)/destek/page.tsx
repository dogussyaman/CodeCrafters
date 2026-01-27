"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
    Mail,
    Phone,
    MessageCircle,
    Clock,
    CheckCircle2,
    AlertCircle,
    HelpCircle,
    BookOpen,
    CreditCard,
    User,
    ArrowRight,
} from "lucide-react"

export default function DestekPage() {
    const [activeTab, setActiveTab] = useState("genel")

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">

                <div className="absolute top-20 right-10 size-96 bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-10 left-10 size-96 bg-secondary/10 rounded-full blur-[120px]" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
                            <span className="gradient-text">Destek</span> Merkezi
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8 text-pretty">
                            Size yardımcı olmak için buradayız. Sorularınızın cevaplarını bulun veya bizimle iletişime geçin.
                        </p>
                    </div>
                </div>
            </section>

            {/* Alert Section */}
            <section className="pb-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Önemli Duyuru</AlertTitle>
                            <AlertDescription>
                                Sistem bakımı nedeniyle 15 Ocak 2026 tarihinde 02:00-04:00 saatleri arasında hizmetlerimizde
                                kesinti yaşanabilir.
                            </AlertDescription>
                        </Alert>
                    </div>
                </div>
            </section>

            {/* Support Channels */}
            <section className="pb-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl font-bold mb-8 text-center">Destek Kanalları</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <Card className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-center justify-between mb-2">
                                        <Mail className="h-8 w-8 text-primary" />
                                        <Badge variant="outline">7/24</Badge>
                                    </div>
                                    <CardTitle>E-posta Desteği</CardTitle>
                                    <CardDescription>Detaylı sorularınız için</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        support@codecrafters.com adresinden bize ulaşın.
                                    </p>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Ortalama yanıt: 2-4 saat</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-center justify-between mb-2">
                                        <Phone className="h-8 w-8 text-primary" />
                                        <Badge>Hafta içi</Badge>
                                    </div>
                                    <CardTitle>Telefon Desteği</CardTitle>
                                    <CardDescription>Acil durumlar için</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4">(123) 456-7890 numarasından arayın.</p>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">09:00 - 18:00</span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-lg transition-shadow border-primary/50">
                                <CardHeader>
                                    <div className="flex items-center justify-between mb-2">
                                        <MessageCircle className="h-8 w-8 text-primary" />
                                        <Badge className="bg-green-500">Çevrimiçi</Badge>
                                    </div>
                                    <CardTitle>Canlı Destek</CardTitle>
                                    <CardDescription>Anında yardım alın</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground mb-4">
                                        Sohbet başlatın, hemen yardımcı olalım.
                                    </p>
                                    <Button className="w-full group">
                                        Sohbet Başlat
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            <Separator className="max-w-6xl mx-auto" />

            {/* FAQ Section with Tabs */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-8 text-center">Sık Sorulan Sorular</h2>

                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-4 mb-8">
                                <TabsTrigger value="genel" className="gap-2">
                                    <HelpCircle className="h-4 w-4" />
                                    Genel
                                </TabsTrigger>
                                <TabsTrigger value="teknik" className="gap-2">
                                    <BookOpen className="h-4 w-4" />
                                    Teknik
                                </TabsTrigger>
                                <TabsTrigger value="fatura" className="gap-2">
                                    <CreditCard className="h-4 w-4" />
                                    Faturalandırma
                                </TabsTrigger>
                                <TabsTrigger value="hesap" className="gap-2">
                                    <User className="h-4 w-4" />
                                    Hesap
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="genel">
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger className="text-left">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                CodeCrafters nedir ve nasıl çalışır?
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">
                                            CodeCrafters, yazılım geliştiricileri ve şirketleri yapay zeka destekli eşleştirme algoritması
                                            ile buluşturan bir platformdur. CV'nizi yükleyin, sistemimiz becerilerinizi analiz eder ve size
                                            en uygun iş fırsatlarını önerir.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="item-2">
                                        <AccordionTrigger className="text-left">
                                            Platform tamamen ücretsiz mi?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">
                                            Evet! Yazılım geliştiriciler için tüm temel özellikler tamamen ücretsizdir. CV analizi, iş
                                            eşleştirme, profil oluşturma ve başvuru yapma gibi tüm özellikleri ücretsiz kullanabilirsiniz.
                                            Şirketler için farklı paketlerimiz mevcuttur.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="item-3">
                                        <AccordionTrigger className="text-left">
                                            Hangi programlama dillerini destekliyorsunuz?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">
                                            Platformumuz JavaScript, Python, Java, C#, Go, Rust, PHP, Ruby ve daha birçok popüler
                                            programlama dilini desteklemektedir. CV analiz sistemimiz 50'den fazla teknoloji ve framework'ü
                                            tanıyabilir.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="item-4">
                                        <AccordionTrigger className="text-left">
                                            Eşleşme süreci ne kadar sürer?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">
                                            CV analizi anında tamamlanır. Yapay zeka algoritmamız profilinizi oluşturur oluşturmaz, size
                                            uygun iş ilanlarını göstermeye başlar. Yeni ilanlar eklendiğinde de otomatik olarak
                                            bilgilendirilirsiniz.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="item-5">
                                        <AccordionTrigger className="text-left">
                                            Verilerim güvende mi?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">
                                            Kesinlikle! Tüm verileriniz şifrelenmiş olarak saklanır ve KVKK'ya tam uyumluyuz. Verileriniz
                                            asla üçüncü şahıslarla paylaşılmaz. Gizlilik politikamızı inceleyerek detaylı bilgi
                                            alabilirsiniz.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="item-6">
                                        <AccordionTrigger className="text-left">
                                            Şirketler için İK paneli neler sunuyor?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">
                                            İK panelimiz; otomatik aday puanlama, mülakat takvimi yönetimi, ekip içi aday değerlendirme notları ve detaylı işe alım analitiği gibi kurumsal ihtiyaçlara yönelik gelişmiş özellikler sunar.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="item-7">
                                        <AccordionTrigger className="text-left">
                                            Headhunter veya Danışmanlık firmaları kullanabilir mi?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">
                                            Evet, "Kurumsal" paketimiz ile danışmanlık firmaları birden fazla müşteri hesabı yönetebilir, adayları farklı projeler için kategorize edebilir ve profesyonel raporlar oluşturabilir.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </TabsContent>

                            <TabsContent value="teknik">
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="tech-1">
                                        <AccordionTrigger className="text-left">
                                            CV yüklerken hangi formatları destekliyorsunuz?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">
                                            PDF, DOCX, DOC ve TXT formatlarını destekliyoruz. En iyi sonuçlar için PDF formatını
                                            öneriyoruz. Maksimum dosya boyutu 5MB'dır.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="tech-2">
                                        <AccordionTrigger className="text-left">
                                            Profil fotoğrafı yükleyemiyorum, ne yapmalıyım?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">
                                            Fotoğrafınızın JPG, PNG veya WebP formatında ve 2MB'dan küçük olduğundan emin olun. Sorun
                                            devam ederse, tarayıcınızın önbelleğini temizleyin veya farklı bir tarayıcı deneyin. Hala
                                            sorun yaşıyorsanız destek ekibimize ulaşın.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="tech-3">
                                        <AccordionTrigger className="text-left">
                                            Mobil uygulama var mı?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">
                                            Şu anda web platformumuz tüm cihazlarda responsive olarak çalışmaktadır. iOS ve Android
                                            uygulamalarımız 2026 Q2'de yayınlanacaktır. Duyurulardan haberdar olmak için bültenimize
                                            abone olabilirsiniz.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="tech-4">
                                        <AccordionTrigger className="text-left">
                                            API entegrasyonu sunuyor musunuz?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">
                                            Evet, kurumsal paketlerimizde RESTful API erişimi sunuyoruz. API dokümantasyonumuz için
                                            developers.codecrafters.com adresini ziyaret edebilir veya satış ekibimizle iletişime
                                            geçebilirsiniz.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </TabsContent>

                            <TabsContent value="fatura">
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="bill-1">
                                        <AccordionTrigger className="text-left">
                                            Ücretli paketler nelerdir?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">
                                            Geliştiriciler için platform tamamen ücretsizdir. Şirketler için Başlangıç (₺999/ay), Profesyonel
                                            (₺2.999/ay) ve Kurumsal (özel fiyatlandırma) paketlerimiz bulunmaktadır. Detaylar için
                                            fiyatlandırma sayfamızı ziyaret edin.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="bill-2">
                                        <AccordionTrigger className="text-left">
                                            Hangi ödeme yöntemlerini kabul ediyorsunuz?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">
                                            Kredi kartı, banka kartı ve havale/EFT ile ödeme alıyoruz. Kurumsal müşterilerimiz için fatura
                                            ile ödeme seçeneği de mevcuttur. Tüm ödemeler SSL ile şifrelenir.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="bill-3">
                                        <AccordionTrigger className="text-left">
                                            İptal ve iade politikanız nedir?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">
                                            Aboneliğinizi istediğiniz zaman iptal edebilirsiniz. İptal sonrası mevcut dönem sonuna kadar
                                            hizmetlerimizi kullanmaya devam edebilirsiniz. İlk 14 gün içinde memnun kalmazsanız tam iade
                                            garantisi sunuyoruz.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="bill-4">
                                        <AccordionTrigger className="text-left">
                                            Fatura nasıl alabilirim?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">
                                            Her ödeme sonrası otomatik olarak e-fatura gönderilir. Geçmiş faturalarınıza hesap
                                            ayarlarınızdan "Faturalandırma" bölümünden ulaşabilirsiniz. Kurumsal fatura için şirket
                                            bilgilerinizi profil ayarlarınızdan güncelleyin.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </TabsContent>

                            <TabsContent value="hesap">
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="acc-1">
                                        <AccordionTrigger className="text-left">
                                            Hesap nasıl oluşturabilirim?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">
                                            Kayıt sayfasından e-posta adresiniz ile veya Google/GitHub hesabınız ile hızlıca kayıt
                                            olabilirsiniz. Kayıt sonrası e-posta doğrulaması yapmanız gerekmektedir.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="acc-2">
                                        <AccordionTrigger className="text-left">
                                            Şifremi unuttum, ne yapmalıyım?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">
                                            Giriş sayfasındaki "Şifremi Unuttum" linkine tıklayın. E-posta adresinizi girin, size şifre
                                            sıfırlama linki göndereceğiz. Link 1 saat geçerlidir.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="acc-3">
                                        <AccordionTrigger className="text-left">
                                            Hesabımı nasıl silebilirim?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">
                                            Hesap ayarlarından "Hesabı Sil" seçeneğini kullanabilirsiniz. Bu işlem geri alınamaz ve tüm
                                            verileriniz kalıcı olarak silinir. Silme işlemi öncesi tüm verilerinizi dışa aktarabilirsiniz.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="acc-4">
                                        <AccordionTrigger className="text-left">
                                            E-posta adresimi değiştirebilir miyim?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">
                                            Evet, hesap ayarlarından e-posta adresinizi güncelleyebilirsiniz. Yeni e-posta adresinize
                                            doğrulama linki gönderilecektir. Doğrulama sonrası değişiklik tamamlanır.
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="acc-5">
                                        <AccordionTrigger className="text-left">
                                            İki faktörlü kimlik doğrulama (2FA) nasıl aktif edilir?
                                        </AccordionTrigger>
                                        <AccordionContent className="text-muted-foreground">
                                            Hesap ayarlarından "Güvenlik" bölümüne gidin ve "İki Faktörlü Kimlik Doğrulama" seçeneğini
                                            aktif edin. Google Authenticator veya benzeri bir uygulama ile QR kodu taratın. Hesabınızın
                                            güvenliği için 2FA kullanmanızı şiddetle öneriyoruz.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </section>

            <Separator className="max-w-6xl mx-auto" />

            {/* CTA Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <Card className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-primary/20">
                            <CardHeader className="text-center">
                                <CardTitle className="text-2xl">Sorunuz cevap bulamadı mı?</CardTitle>
                                <CardDescription>
                                    Destek ekibimiz size yardımcı olmak için hazır. Bizimle iletişime geçin.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button size="lg" asChild className="group">
                                    <a href="/iletisim">
                                        İletişime Geçin
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </a>
                                </Button>
                                <Button size="lg" variant="outline" asChild>
                                    <a href="mailto:support@codecrafters.com">
                                        <Mail className="mr-2 h-4 w-4" />
                                        E-posta Gönderin
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    )
}
