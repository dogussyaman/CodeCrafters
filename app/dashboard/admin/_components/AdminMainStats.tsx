import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Building2, Star, Users } from "lucide-react"

interface AdminMainStatsProps {
    totalUsers: number | null
    companyCount: number | null
    jobCount: number | null
    activeJobCount: number | null
    matchCount: number | null
}

export function AdminMainStats({
    totalUsers,
    companyCount,
    jobCount,
    activeJobCount,
    matchCount,
}: AdminMainStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-card border-border/50 dark:bg-zinc-900/50 dark:border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Toplam Kullanıcı</CardTitle>
                    <Users className="size-5 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-foreground">{totalUsers || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">Kayıtlı kullanıcı</p>
                </CardContent>
            </Card>

            <Card className="bg-card border-border/50 dark:bg-zinc-900/50 dark:border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Şirketler</CardTitle>
                    <Building2 className="size-5 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-foreground">{companyCount || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">Kayıtlı şirket</p>
                </CardContent>
            </Card>

            <Card className="bg-card border-border/50 dark:bg-zinc-900/50 dark:border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">İş İlanları</CardTitle>
                    <Briefcase className="size-5 text-purple-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-foreground">{jobCount || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">{activeJobCount || 0} aktif</p>
                </CardContent>
            </Card>

            <Card className="bg-card border-border/50 dark:bg-zinc-900/50 dark:border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Eşleşmeler</CardTitle>
                    <Star className="size-5 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-foreground">{matchCount || 0}</div>
                    <p className="text-xs text-muted-foreground mt-1">Toplam eşleşme</p>
                </CardContent>
            </Card>
        </div>
    )
}

