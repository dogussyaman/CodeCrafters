import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Plus } from "lucide-react"
import Link from "next/link"

interface HrCompanyCalloutProps {
    companyCount: number | null
}

export function HrCompanyCallout({ companyCount }: HrCompanyCalloutProps) {
    if (companyCount && companyCount > 0) return null

    return (
        <Card className="border-primary/50 bg-primary/5 dark:bg-zinc-900/50 dark:border-zinc-800">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Building2 className="size-5" />
                    Şirket Ekleyin
                </CardTitle>
                <CardDescription>İş ilanı yayınlamak için önce şirket bilgilerini eklemeniz gerekiyor</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild>
                    <Link href="/dashboard/ik/sirketler/olustur">
                        <Plus className="mr-2 size-4" />
                        Şirket Ekle
                    </Link>
                </Button>
            </CardContent>
        </Card>
    )
}

