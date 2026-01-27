"use client"

import { createClient } from "@/lib/supabase/client"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Calendar, Shield } from "lucide-react"
import { useEffect, useState } from "react"
import { UserCardSkeleton } from "@/components/skeleton-loaders"
import { useToast } from "@/hooks/use-toast"

interface Profile {
  id: string
  full_name: string
  email: string
  role: string
  created_at: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<Profile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setIsLoading(true)
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })
    if (data) setUsers(data)
    setIsLoading(false)
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", userId)

      if (error) throw error

      toast({
        title: "Başarılı",
        description: "Kullanıcı rolü başarıyla güncellendi.",
        variant: "default",
      })
      fetchUsers()
    } catch (error) {
      toast({
        title: "Hata",
        description: "Kullanıcı rolü güncellenirken bir sorun oluştu.",
        variant: "destructive",
      })
      console.error(error)
    }
  }

  const getRoleBadge = (role: string) => {
    const roleConfig: Record<string, { label: string; className: string }> = {
      developer: { label: "Geliştirici", className: "bg-blue-500/10 text-blue-700 dark:text-blue-400" },
      hr: { label: "İK Uzmanı", className: "bg-green-500/10 text-green-700 dark:text-green-400" },
      admin: { label: "Yönetici", className: "bg-purple-500/10 text-purple-700 dark:text-purple-400" },
    }

    const config = roleConfig[role] || { label: role, className: "" }
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getInitials = (name: string) => {
    if (!name) return "??"
    return name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8 min-h-screen">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Kullanıcı Yönetimi</h1>
          <p className="text-muted-foreground">Tüm platform kullanıcıları ve rol yönetimi</p>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <UserCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Kullanıcı Yönetimi</h1>
        <p className="text-muted-foreground">Tüm platform kullanıcıları ve rol yönetimi</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {users?.map((user) => (
          <Card key={user.id} className="hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="size-12">
                    <AvatarFallback className="from-primary to-accent text-white">
                      {getInitials(user.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <CardTitle className="text-lg">{user.full_name}</CardTitle>
                      {getRoleBadge(user.role)}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="size-4" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="size-4" />
                        Kayıt: {formatDate(user.created_at)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 ml-auto md:ml-0">
                  <Shield className="size-4 text-muted-foreground" />
                  <Select value={user.role} onValueChange={(newRole) => handleRoleChange(user.id, newRole)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="developer">Geliştirici</SelectItem>
                      <SelectItem value="hr">İK Uzmanı</SelectItem>
                      <SelectItem value="admin">Yönetici</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
