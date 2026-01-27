import Link from "next/link"
import { Button } from "@/components/ui/button"

export function ProjectsSubmitCta() {
    return (
        <section className="py-16 md:py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Kendi Projenizi Paylaşın</h2>
                    <p className="text-lg md:text-xl text-muted-foreground mb-8">
                        Geliştirdiğiniz açık kaynak projeleri topluluğumuzla paylaşmak için başvurun
                    </p>
                    <Button size="lg" asChild>
                        <Link href="/iletisim">Proje Gönder</Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}

