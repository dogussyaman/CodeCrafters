"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Mail, MapPin, Phone, Send, CheckCircle2, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { contactFormSchema, type ContactFormValues } from "@/lib/validations"

export default function IletisimPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  })

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true)

    try {
      const supabase = createClient()

      const { error } = await supabase.from("contact_messages").insert({
        name: data.ad,
        email: data.email,
        subject: data.konu,
        message: data.mesaj,
      })

      if (error) {
        throw error
      }

      toast.success("Mesajınız başarıyla gönderildi!", {
        description: "En kısa sürede size dönüş yapacağız.",
        icon: <CheckCircle2 className="h-5 w-5" />,
      })

      reset()
    } catch (error: any) {
      console.error("Contact form error:", error)

      // Kullanıcı dostu hata mesajları
      let errorMessage = "Mesaj gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin."

      if (error?.code === "23505") {
        errorMessage = "Bu mesaj zaten gönderilmiş. Lütfen farklı bir mesaj yazın."
      } else if (error?.message?.includes("network") || error?.message?.includes("fetch")) {
        errorMessage = "İnternet bağlantınızı kontrol edin ve tekrar deneyin."
      }

      toast.error("Hata", {
        description: errorMessage,
        icon: <AlertCircle className="h-5 w-5" />,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">

        <div className="absolute top-20 left-10 size-96 bg-accent/10 rounded-full blur-[120px]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
              <span className="gradient-text">İletişime</span> Geçin
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              Sorularınız, önerileriniz veya iş birliği teklifleriniz için bize ulaşın
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>İletişim Bilgileri</CardTitle>
                  <CardDescription>
                    Size en hızlı şekilde dönüş yapabilmemiz için aşağıdaki kanalları kullanabilirsiniz
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Mail className="size-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">E-posta</h3>
                      <p className="text-sm text-muted-foreground">hello@codecrafters.com</p>
                      <p className="text-sm text-muted-foreground">support@codecrafters.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Phone className="size-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Telefon</h3>
                      <p className="text-sm text-muted-foreground">(123) 456-7890</p>
                      <p className="text-xs text-muted-foreground mt-1">Hafta içi 09:00 - 18:00</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <MapPin className="size-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Adres</h3>
                      <p className="text-sm text-muted-foreground">
                        123 İnovasyon Caddesi
                        <br />
                        Teknoloji Şehri, TC 12345
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sık Sorulan Sorular</CardTitle>
                  <CardDescription>Hızlı cevaplar için SSS bölümümüze göz atın</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-left text-sm">
                        Platform tamamen ücretsiz mi?
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        Evet, geliştiriciler için tüm temel özellikler ücretsizdir. CV analizi, iş eşleştirme ve başvuru
                        yapma gibi tüm özellikleri ücretsiz kullanabilirsiniz.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-left text-sm">
                        Eşleşme süreci ne kadar sürer?
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        CV analizi anında tamamlanır. Yapay zeka algoritmamız profilinizi oluşturur oluşturmaz, size uygun
                        iş ilanlarını göstermeye başlar.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                      <AccordionTrigger className="text-left text-sm">
                        Şirket olarak nasıl kayıt olabilirim?
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        Kayıt sayfasından üye olun, admin tarafından İK rolü verilmesini bekleyin. Alternatif olarak
                        satış ekibimizle iletişime geçerek kurumsal paket bilgisi alabilirsiniz.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                      <AccordionTrigger className="text-left text-sm">
                        Verilerim güvende mi?
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        Kesinlikle! Tüm verileriniz şifrelenmiş olarak saklanır ve KVKK'ya tam uyumluyuz. Verileriniz asla
                        üçüncü şahıslarla paylaşılmaz.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                      <AccordionTrigger className="text-left text-sm">
                        Destek saatleriniz nedir?
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        E-posta desteğimiz 7/24 aktiftir. Telefon desteği hafta içi 09:00-18:00 saatleri arasında
                        hizmet vermektedir. Acil durumlar için canlı destek hattımızı kullanabilirsiniz.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Mesaj Gönderin</CardTitle>
                <CardDescription>Formu doldurun, size en kısa sürede dönüş yapalım</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ad">
                      Ad Soyad <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="ad"
                      {...register("ad")}
                      placeholder="Adınız ve soyadınız"
                      className={errors.ad ? "border-destructive" : ""}
                    />
                    {errors.ad && <p className="text-sm text-destructive">{errors.ad.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      E-posta <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="email@example.com"
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="konu">
                      Konu <span className="text-destructive">*</span>
                    </Label>
                    <Select onValueChange={(value) => setValue("konu", value)}>
                      <SelectTrigger className={errors.konu ? "border-destructive" : ""}>
                        <SelectValue placeholder="Bir konu seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="genel">Genel Bilgi</SelectItem>
                        <SelectItem value="ik-surecleri">İK Süreçleri ve Kurumsal</SelectItem>
                        <SelectItem value="teknik">Teknik Destek</SelectItem>
                        <SelectItem value="is-birligi">İş Birliği</SelectItem>
                        <SelectItem value="satis">Satış ve Fiyatlandırma</SelectItem>
                        <SelectItem value="sikayet">Şikayet ve Öneri</SelectItem>
                        <SelectItem value="diger">Diğer</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.konu && <p className="text-sm text-destructive">{errors.konu.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mesaj">
                      Mesaj <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="mesaj"
                      {...register("mesaj")}
                      placeholder="Mesajınızı buraya yazın..."
                      rows={6}
                      className={errors.mesaj ? "border-destructive" : ""}
                    />
                    {errors.mesaj && <p className="text-sm text-destructive">{errors.mesaj.message}</p>}
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                        Gönderiliyor...
                      </>
                    ) : (
                      <>
                        <Send className="size-4 mr-2" />
                        Gönder
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator className="max-w-6xl mx-auto" />

      {/* Map Placeholder */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Ofisimizi Ziyaret Edin</h2>
            <div className="aspect-video rounded-xl bg-muted border border-border overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Harita entegrasyonu yakında eklenecek</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    123 İnovasyon Caddesi, Teknoloji Şehri, TC 12345
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
