"use client"

import { useState } from "react"
import { Loader2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"

export function AdminNotificationsForm() {
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [href, setHref] = useState("")
    const [targetRole, setTargetRole] = useState("all")
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!title.trim()) {
            toast({
                title: "Hata",
                description: "Başlık alanı zorunludur",
                variant: "destructive",
            })
            return
        }

        setLoading(true)

        try {
            const { data, error } = await supabase.rpc("broadcast_notification", {
                p_title: title,
                p_body: body || null,
                p_href: href || null,
                p_target_role: targetRole,
                p_data: {},
            })

            if (error) throw error

            toast({
                title: "Başarılı",
                description: `${data} kullanıcıya bildirim gönderildi`,
            })

            setTitle("")
            setBody("")
            setHref("")
            setTargetRole("all")
        } catch (error: any) {
            console.error("Bildirim gönderme hatası:", error)
            toast({
                title: "Hata",
                description: error.message || "Bildirim gönderilemedi",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="bg-card border-border/50 dark:bg-zinc-900/50 dark:border-zinc-800">
            <CardHeader>
                <CardTitle>Yeni Bildirim (In-App)</CardTitle>
                <CardDescription>
                    Başlık ve isteğe bağlı içerik/link ile, seçtiğiniz role giden in-app bildirim oluşturun.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Başlık *</Label>
                        <Input
                            id="title"
                            placeholder="Örn: Yeni İş İlanı Eklendi"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="body">İçerik</Label>
                        <Textarea
                            id="body"
                            placeholder="Bildirim detayları..."
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            rows={4}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="href">Link (Opsiyonel)</Label>
                        <Input
                            id="href"
                            placeholder="/is-ilanlari"
                            value={href}
                            onChange={(e) => setHref(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                            Kullanıcılar bildirime tıkladığında yönlendirilecek sayfa
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="target">Hedef Kitle *</Label>
                        <Select value={targetRole} onValueChange={setTargetRole}>
                            <SelectTrigger id="target">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tüm Kullanıcılar</SelectItem>
                                <SelectItem value="developer">Sadece Geliştiriciler</SelectItem>
                                <SelectItem value="hr">Sadece İK Uzmanları</SelectItem>
                                <SelectItem value="admin">Sadece Adminler</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="submit" disabled={loading} className="flex-1">
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                    Gönderiliyor...
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 size-4" />
                                    Bildirim Gönder
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

