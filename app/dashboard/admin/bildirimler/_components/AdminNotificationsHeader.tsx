"use client"

import { Bell } from "lucide-react"

export function AdminNotificationsHeader() {
    return (
        <div className="mb-6">
            <h1 className="text-3xl font-bold flex items-center gap-3">
                <Bell className="size-8 text-primary" />
                Toplu Bildirim Gönder
            </h1>
            <p className="text-muted-foreground mt-2">
                Tüm kullanıcılara veya belirli rollere <span className="font-semibold">platform içi bildirim</span>{" "}
                gönderin. Bu ekran <span className="font-semibold">e-posta göndermez</span>, sadece bildirim
                merkezinde görünecek kayıtlar oluşturur.
            </p>
        </div>
    )
}

