import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"

export function ProjectsHowToJoin() {
  return (
    <Alert variant="default" className="border-primary/30 bg-primary/5">
      <Info className="size-4" />
      <AlertTitle className="text-base font-semibold">Projeye Nasıl Katılırım?</AlertTitle>
      <AlertDescription className="mt-2 space-y-3">
          <p>
            <strong className="text-foreground">1. Bu siteden:</strong> Proje detay sayfasındaki &quot;Katılma isteği
            gönder&quot; butonu ile proje sahibine istek gönderebilirsiniz. İstek onaylandığında proje ekibine dahil
            olursunuz.
          </p>
          <p>
            <strong className="text-foreground">2. GitHub üzerinden:</strong> Projenin GitHub bağlantısına giderek
            repoyu <strong>clone</strong> veya <strong>fork</strong> edebilirsiniz. Yerel geliştirme için:{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">git clone &lt;repo-url&gt;</code>.
            Katkıda bulunmak için genelde repoyu fork’layıp değişikliklerinizi yaptıktan sonra pull request açarsınız.
          </p>
          <p>
            <strong className="text-foreground">3. CONTRIBUTING.md:</strong> Repoda <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">CONTRIBUTING.md</code>{" "}
            dosyası varsa katkı süreci ve kurallar orada açıklanır; önce ona göz atmanız önerilir.
          </p>
      </AlertDescription>
    </Alert>
  )
}
