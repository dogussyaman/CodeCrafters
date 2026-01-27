import { createClient } from "@/lib/supabase/server"
import { SkillsManager } from "./skills-manager"

export default async function SkillsPage() {
  const supabase = await createClient()

  // Order by created_at desc to show newest first, or name as before. 
  // Original was name ascending. Let's keep name ascending or use created_at if we want to see new ones.
  // I'll stick to name for better organization, or maybe just pass data.
  const { data: skills } = await supabase.from("skills").select("*").order("name", { ascending: true })

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Yetenek Yönetimi</h1>
        <p className="text-muted-foreground">Platform yetenekleri ve kategorileri</p>
      </div>

      <SkillsManager initialSkills={skills || []} />
    </div>
  )
}
