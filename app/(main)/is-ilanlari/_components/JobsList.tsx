import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Building2, Clock, DollarSign, MapPin } from "lucide-react"

interface JobsListProps {
    ilanlar: any[] | null
}

export function JobsList({ ilanlar }: JobsListProps) {
    return (
        <section className="pb-16">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto space-y-4">
                    {ilanlar && ilanlar.length > 0 ? (
                        ilanlar.map((ilan: any) => (
                            <Card
                                key={ilan.id}
                                className="hover:shadow-lg transition-all duration-300 hover:border-primary/50"
                            >
                                <Link href={`/is-ilanlari/${ilan.id}`}>
                                    <CardHeader>
                                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge variant="secondary">{ilan.experience_level}</Badge>
                                                    <Badge variant="outline">{ilan.job_type}</Badge>
                                                    <span className="text-xs text-muted-foreground ml-auto md:ml-0">
                                                        <Clock className="size-3 inline mr-1" />
                                                        {new Date(ilan.created_at).toLocaleDateString("tr-TR")}
                                                    </span>
                                                </div>
                                                <CardTitle className="hover:text-primary transition-colors cursor-pointer mb-2">
                                                    {ilan.title}
                                                </CardTitle>
                                                <CardDescription className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="size-4" />
                                                        <span>{ilan.companies?.name}</span>
                                                    </div>
                                                    {ilan.location && (
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="size-4" />
                                                            <span>{ilan.location}</span>
                                                        </div>
                                                    )}
                                                    {(ilan.salary_min || ilan.salary_max) && (
                                                        <div className="flex items-center gap-2">
                                                            <DollarSign className="size-4" />
                                                            <span>
                                                                ₺{ilan.salary_min?.toLocaleString("tr-TR")} - ₺
                                                                {ilan.salary_max?.toLocaleString("tr-TR")}
                                                            </span>
                                                        </div>
                                                    )}
                                                </CardDescription>
                                            </div>
                                            <Button className="md:mt-0">Detay</Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {ilan.job_skills?.slice(0, 5).map((js: any, idx: number) => (
                                                <Badge key={idx} variant="secondary" className="text-xs">
                                                    {js.skills?.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Link>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">Henüz aktif ilan bulunmuyor.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

