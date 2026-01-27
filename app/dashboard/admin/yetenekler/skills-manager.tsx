"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, X } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

interface Skill {
    id: string
    name: string
    category: string
}

interface SkillsManagerProps {
    initialSkills: Skill[]
}

export function SkillsManager({ initialSkills }: SkillsManagerProps) {
    const [skills, setSkills] = useState<Skill[]>(initialSkills)
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [newSkill, setNewSkill] = useState({ name: "", category: "other" })

    const router = useRouter()
    // Assuming useToast is available, if not we'll fallback to alert or simple logic
    // I will check if use-toast exists in the component list first, but for now I'll risk it or implement a safe check.
    // Actually, I'll assume standard shadcn toast but purely client side logic is fine too.

    const supabase = createClient()

    const handleAddSkill = async () => {
        if (!newSkill.name.trim()) return

        setLoading(true)
        try {
            const { data, error } = await supabase
                .from("skills")
                .insert([{ name: newSkill.name, category: newSkill.category }])
                .select()
                .single()

            if (error) throw error

            setSkills([...skills, data])
            setNewSkill({ name: "", category: "other" })
            setIsOpen(false)
            router.refresh()
        } catch (error) {
            console.error("Error adding skill:", error)
            alert("Yetenek eklenirken bir hata oluştu.")
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteSkill = async (id: string) => {
        if (!confirm("Bu yeteneği silmek istediğinize emin misiniz?")) return

        try {
            const { error } = await supabase.from("skills").delete().eq("id", id)
            if (error) throw error

            setSkills(skills.filter((skill) => skill.id !== id))
            router.refresh()
        } catch (error) {
            console.error("Error deleting skill:", error)
            alert("Yetenek silinirken bir hata oluştu.")
        }
    }

    // Helper to group skills for display, similar to original page but now interactive
    const groupedSkills = skills.reduce(
        (acc, skill) => {
            const category = skill.category || "other"
            if (!acc[category]) acc[category] = []
            acc[category].push(skill)
            return acc
        },
        {} as Record<string, Skill[]>,
    )

    const getCategoryBadge = (category: string) => {
        const categoryConfig: Record<string, { label: string; className: string }> = {
            programming: { label: "Programlama", className: "bg-blue-500/10 text-blue-700 dark:text-blue-400" },
            framework: { label: "Framework", className: "bg-green-500/10 text-green-700 dark:text-green-400" },
            tool: { label: "Araç", className: "bg-purple-500/10 text-purple-700 dark:text-purple-400" },
            "soft-skill": { label: "Soft Skill", className: "bg-orange-500/10 text-orange-700 dark:text-orange-400" },
            language: { label: "Dil", className: "bg-pink-500/10 text-pink-700 dark:text-pink-400" },
            other: { label: "Diğer", className: "bg-gray-500/10 text-gray-700 dark:text-gray-400" },
        }

        const config = categoryConfig[category] || { label: category, className: "" }
        return <Badge className={config.className}>{config.label}</Badge>
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Yeni Yetenek Ekle
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Yeni Yetenek Ekle</DialogTitle>
                            <DialogDescription>
                                Platforma yeni bir yetenek ekleyin.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="name" className="text-right text-sm font-medium">
                                    İsim
                                </label>
                                <Input
                                    id="name"
                                    value={newSkill.name}
                                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                                    className="col-span-3"
                                    placeholder="Örn: React, Leadership"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="category" className="text-right text-sm font-medium">
                                    Kategori
                                </label>
                                <Select
                                    value={newSkill.category}
                                    onValueChange={(val) => setNewSkill({ ...newSkill, category: val })}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Kategori Seç" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="programming">Programlama</SelectItem>
                                        <SelectItem value="framework">Framework</SelectItem>
                                        <SelectItem value="tool">Araç</SelectItem>
                                        <SelectItem value="soft-skill">Soft Skill</SelectItem>
                                        <SelectItem value="language">Dil</SelectItem>
                                        <SelectItem value="other">Diğer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" onClick={handleAddSkill} disabled={loading}>
                                {loading ? "Ekleniyor..." : "Ekle"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                    <div key={category} className="bg-card rounded-lg border shadow-sm">
                        <div className="p-6 border-b flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h3 className="text-lg font-semibold">{getCategoryBadge(category)}</h3>
                                <span className="text-sm text-muted-foreground">({categorySkills.length})</span>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex flex-wrap gap-2">
                                {categorySkills.map((skill) => (
                                    <Badge key={skill.id} variant="outline" className="flex items-center gap-1 pl-3 pr-1 py-1">
                                        {skill.name}
                                        <button
                                            onClick={() => handleDeleteSkill(skill.id)}
                                            className="ml-1 hover:bg-destructive/10 hover:text-destructive rounded-full p-0.5 transition-colors"
                                            title="Sil"
                                        >
                                            <X className="h-3 w-3" />
                                            <span className="sr-only">Sil</span>
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
