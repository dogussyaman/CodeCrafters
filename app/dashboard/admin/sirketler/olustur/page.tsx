"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Building2, UserPlus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminCreateCompanyPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [companyForm, setCompanyForm] = useState({
    name: "",
    description: "",
    industry: "",
    website: "",
    location: "",
    employeeCount: "",
    legalTitle: "",
    taxNumber: "",
    taxOffice: "",
    address: "",
    phone: "",
    contactEmail: "",
  })

  const [ownerForm, setOwnerForm] = useState({
    fullName: "",
    email: "",
    tempPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (!companyForm.name || !ownerForm.fullName || !ownerForm.email) {
        setError("Şirket adı, şirket sahibi adı ve e-posta zorunludur.")
        setLoading(false)
        return
      }

      const response = await fetch("/api/admin/create-company", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: companyForm.name,
          description: companyForm.description || undefined,
          industry: companyForm.industry || undefined,
          website: companyForm.website || undefined,
          location: companyForm.location || undefined,
          employeeCount: companyForm.employeeCount || undefined,
          legalTitle: companyForm.legalTitle || undefined,
          taxNumber: companyForm.taxNumber || undefined,
          taxOffice: companyForm.taxOffice || undefined,
          address: companyForm.address || undefined,
          phone: companyForm.phone || undefined,
          contactEmail: companyForm.contactEmail || ownerForm.email,
          ownerFullName: ownerForm.fullName,
          ownerEmail: ownerForm.email,
          tempPassword: ownerForm.tempPassword || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Şirket oluşturulurken bir hata oluştu.")
        toast({
          title: "Hata",
          description: data.error || "Şirket oluşturulamadı.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      toast({
        title: "Şirket oluşturuldu",
        description:
          "Şirket sahibi için kullanıcı hesabı oluşturuldu ve e-posta kuyruğuna eklendi.",
      })

      router.push("/dashboard/admin/sirketler")
    } catch (err: any) {
      console.error("Admin create company error:", err)
      setError(err?.message || "Beklenmeyen bir hata oluştu.")
      toast({
        title: "Hata",
        description: err?.message || "Beklenmeyen bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl min-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Building2 className="size-8 text-primary" />
            Yeni Şirket Oluştur
          </h1>
          <p className="text-muted-foreground mt-2">
            Şirket bilgilerini ve şirket sahibi kullanıcıyı tanımlayın. Bu işlem:
            <span className="font-semibold"> şirket kaydı oluşturur</span>,{" "}
            <span className="font-semibold">company_admin rolünde kullanıcı yaratır</span> ve
            <span className="font-semibold"> giriş bilgilerini e-posta kuyruğuna (email_queue) ekler</span>.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/admin/sirketler">Geri Dön</Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Şirket Bilgileri</CardTitle>
            <CardDescription>Platforma eklenecek şirketin temel bilgileri.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Şirket Adı <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={companyForm.name}
                onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                placeholder="Örn: Acme Technology"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industry">Sektör</Label>
                <Input
                  id="industry"
                  value={companyForm.industry}
                  onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })}
                  placeholder="Örn: Yazılım, Finans, E-ticaret"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employeeCount">Çalışan Sayısı</Label>
                <Input
                  id="employeeCount"
                  value={companyForm.employeeCount}
                  onChange={(e) =>
                    setCompanyForm({ ...companyForm, employeeCount: e.target.value })
                  }
                  placeholder="Örn: 11-50, 51-200"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={companyForm.website}
                  onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                  placeholder="https://ornek.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Konum</Label>
                <Input
                  id="location"
                  value={companyForm.location}
                  onChange={(e) => setCompanyForm({ ...companyForm, location: e.target.value })}
                  placeholder="İl / Ülke"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="legalTitle">Ticari Unvan</Label>
                <Input
                  id="legalTitle"
                  value={companyForm.legalTitle}
                  onChange={(e) => setCompanyForm({ ...companyForm, legalTitle: e.target.value })}
                  placeholder="Örn: Acme Teknoloji A.Ş."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxNumber">Vergi Numarası</Label>
                <Input
                  id="taxNumber"
                  value={companyForm.taxNumber}
                  onChange={(e) => setCompanyForm({ ...companyForm, taxNumber: e.target.value })}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taxOffice">Vergi Dairesi</Label>
                <Input
                  id="taxOffice"
                  value={companyForm.taxOffice}
                  onChange={(e) => setCompanyForm({ ...companyForm, taxOffice: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  value={companyForm.phone}
                  onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })}
                  placeholder="+90 ..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">İletişim E-postası</Label>
              <Input
                id="contactEmail"
                type="email"
                value={companyForm.contactEmail}
                onChange={(e) =>
                  setCompanyForm({ ...companyForm, contactEmail: e.target.value })
                }
                placeholder="Şirket iletişim adresi (boş bırakılırsa sahibi e-postası kullanılır)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Adres</Label>
              <Textarea
                id="address"
                value={companyForm.address}
                onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
                placeholder="Şirket adresi..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                value={companyForm.description}
                onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                placeholder="Şirket hakkında kısa bir açıklama..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="size-5 text-primary" />
              Şirket Sahibi Kullanıcı
            </CardTitle>
            <CardDescription>
              Şirket paneline erişecek ana kullanıcı. Giriş bilgileri e-posta kuyruğuna yazılacak.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ownerFullName">
                  Ad Soyad <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="ownerFullName"
                  value={ownerForm.fullName}
                  onChange={(e) => setOwnerForm({ ...ownerForm, fullName: e.target.value })}
                  placeholder="Örn: Ayşe Yılmaz"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ownerEmail">
                  E-posta <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="ownerEmail"
                  type="email"
                  value={ownerForm.email}
                  onChange={(e) => setOwnerForm({ ...ownerForm, email: e.target.value })}
                  placeholder="sahip@ornek.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tempPassword">Geçici Şifre (opsiyonel)</Label>
              <Input
                id="tempPassword"
                type="text"
                value={ownerForm.tempPassword}
                onChange={(e) => setOwnerForm({ ...ownerForm, tempPassword: e.target.value })}
                placeholder="Boş bırakılırsa otomatik üretilir"
              />
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="flex items-start gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
            <AlertCircle className="size-5 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/admin/sirketler">İptal</Link>
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Oluşturuluyor..." : "Şirketi Oluştur"}
          </Button>
        </div>
      </form>
    </div>
  )
}

