"use client"

import { useState, useEffect } from "react"
import { Building2, Search, Plus, Pencil, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import type { Company, SubscriptionStatus } from "@/lib/types"
import Link from "next/link"
import { TableRowSkeleton } from "@/components/skeleton-loaders"

const SUBSCRIPTION_LABELS: Record<SubscriptionStatus, string> = {
  pending_payment: "Ödeme Bekleniyor",
  active: "Aktif",
  past_due: "Gecikmiş",
  cancelled: "İptal",
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "-"
  try {
    return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "short", year: "numeric" })
  } catch {
    return "-"
  }
}

export default function AdminCompaniesPage() {
    const [companies, setCompanies] = useState<Company[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<"all" | SubscriptionStatus>("all")
    const supabase = createClient()

    useEffect(() => {
        fetchCompanies()
    }, [])

    const fetchCompanies = async () => {
        try {
            const { data, error } = await supabase
                .from("companies")
                .select("*")
                .order("created_at", { ascending: false })

            if (error) throw error
            setCompanies(data || [])
        } catch (error) {
            console.error("Şirketler yüklenirken hata:", error)
        } finally {
            setLoading(false)
        }
    }

    const filteredCompanies = companies
        .filter((company) =>
            company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            company.industry?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter((company) =>
            statusFilter === "all" ? true : company.subscription_status === statusFilter
        )

    return (
        <div className="container mx-auto p-6 min-h-screen">
            <div className="mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Building2 className="size-8 text-primary" />
                    Şirketler
                </h1>
                <p className="text-muted-foreground mt-2">
                    Platformdaki tüm şirketleri görüntüleyin ve yönetin
                </p>
            </div>

            <Card className="bg-card border-border/50 dark:bg-zinc-900/50 dark:border-zinc-800">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Tüm Şirketler</CardTitle>
                            <CardDescription>
                                {filteredCompanies.length} şirket bulundu
                            </CardDescription>
                        </div>
                        <Button asChild>
                            <Link href="/dashboard/admin/sirketler/olustur">
                                <Plus className="size-4 mr-2" />
                                Yeni Şirket
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Search */}
                    <div className="mb-6 space-y-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                                placeholder="Şirket adı veya sektör ara..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs text-muted-foreground mr-1">Filtre:</span>
                            <Button
                                size="sm"
                                variant={statusFilter === "all" ? "default" : "outline"}
                                onClick={() => setStatusFilter("all")}
                            >
                                Tümü
                            </Button>
                            <Button
                                size="sm"
                                variant={statusFilter === "active" ? "default" : "outline"}
                                onClick={() => setStatusFilter("active")}
                            >
                                Aktif abonelik
                            </Button>
                            <Button
                                size="sm"
                                variant={statusFilter === "pending_payment" ? "default" : "outline"}
                                onClick={() => setStatusFilter("pending_payment")}
                            >
                                Ödeme bekleyenler
                            </Button>
                        </div>
                    </div>

                    {/* Table */}
                    {loading ? (
                        <div className="border rounded-lg border-border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-border">
                                        <TableHead>Şirket Adı</TableHead>
                                        <TableHead>Sektör</TableHead>
                                        <TableHead>Çalışan Sayısı</TableHead>
                                        <TableHead>Konum</TableHead>
                                        <TableHead>Plan</TableHead>
                                        <TableHead>Abonelik</TableHead>
                                        <TableHead>Son Ödeme</TableHead>
                                        <TableHead className="text-right">İşlemler</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <TableRowSkeleton key={i} columns={8} />
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : filteredCompanies.length === 0 ? (
                        <div className="py-12 text-center">
                            <Building2 className="size-16 mx-auto mb-4 text-muted-foreground/50" />
                            <p className="text-muted-foreground">
                                {searchQuery ? "Arama kriterlerine uygun şirket bulunamadı" : "Henüz şirket eklenmemiş"}
                            </p>
                        </div>
                    ) : (
                        <div className="border rounded-lg border-border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-border">
                                        <TableHead>Şirket Adı</TableHead>
                                        <TableHead>Sektör</TableHead>
                                        <TableHead>Çalışan Sayısı</TableHead>
                                        <TableHead>Konum</TableHead>
                                        <TableHead>Plan</TableHead>
                                        <TableHead>Abonelik</TableHead>
                                        <TableHead>Son Ödeme</TableHead>
                                        <TableHead className="text-right">İşlemler</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCompanies.map((company) => (
                                        <TableRow key={company.id} className="border-border">
                                            <TableCell className="font-medium">{company.name}</TableCell>
                                            <TableCell>{company.industry || "-"}</TableCell>
                                            <TableCell>{company.employee_count || "-"}</TableCell>
                                            <TableCell>{company.location || "-"}</TableCell>
                                            <TableCell>
                                                {company.plan ? (
                                                    <Badge variant="secondary" className="capitalize">
                                                        {company.plan === "orta" ? "Orta" : company.plan === "premium" ? "Premium" : "Free"}
                                                    </Badge>
                                                ) : (
                                                    "-"
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {company.subscription_status ? (
                                                    <Badge
                                                        variant={
                                                            company.subscription_status === "active"
                                                                ? "success"
                                                                : company.subscription_status === "pending_payment"
                                                                  ? "warning"
                                                                  : company.subscription_status === "past_due"
                                                                    ? "destructive"
                                                                    : "secondary"
                                                        }
                                                    >
                                                        {SUBSCRIPTION_LABELS[company.subscription_status]}
                                                    </Badge>
                                                ) : (
                                                    "-"
                                                )}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground text-sm">
                                                {formatDate(company.last_payment_at)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        asChild
                                                        className="hover:bg-primary/10 hover:text-primary"
                                                    >
                                                        <Link href={`/dashboard/admin/sirketler/${company.id}`}>
                                                            <Eye className="size-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        asChild
                                                        className="hover:bg-primary/10 hover:text-primary"
                                                    >
                                                        <Link href={`/dashboard/admin/sirketler/${company.id}/duzenle`}>
                                                            <Pencil className="size-4" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
