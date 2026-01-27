"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AdminNotificationsExamples() {
    return (
        <Card className="bg-card border-border/50 dark:bg-zinc-900/50 dark:border-zinc-800">
            <CardHeader>
                <CardTitle>Bildirim Örnekleri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="p-3 border rounded-lg border-border/50 dark:border-zinc-800">
                    <p className="font-medium">Yeni İş İlanı Duyurusu</p>
                    <p className="text-sm text-muted-foreground">
                        Başlık: "Yeni İş İlanı Eklendi" | İçerik: "Senior React Developer pozisyonu açıldı" | Link:
                        "/is-ilanlari"
                    </p>
                </div>
                <div className="p-3 border rounded-lg border-border/50 dark:border-zinc-800">
                    <p className="font-medium">Yeni Proje Duyurusu</p>
                    <p className="text-sm text-muted-foreground">
                        Başlık: "Yeni Proje Eklendi" | İçerik: "E-Ticaret projesi eklendi" | Link: "/projeler"
                    </p>
                </div>
                <div className="p-3 border rounded-lg border-border/50 dark:border-zinc-800">
                    <p className="font-medium">Sistem Bakımı</p>
                    <p className="text-sm text-muted-foreground">
                        Başlık: "Planlı Bakım" | İçerik: "Sistem 20:00-22:00 arası bakımda olacak"
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}

