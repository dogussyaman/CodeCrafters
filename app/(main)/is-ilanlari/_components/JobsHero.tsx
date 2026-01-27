import { Button } from "@/components/ui/button"

export function JobsHero() {
    return (
        <section className="relative pt-24 pb-14 md:pt-28 md:pb-18 overflow-hidden">
            <div className="absolute top-20 right-10 size-96 bg-secondary/10 rounded-full blur-[120px]" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
                        <span className="gradient-text">İş İlanları</span>
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8 text-pretty">
                        Hayallerinizdeki işi bulun, kariyer hedfinize ulaşın
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
                        <input
                            type="text"
                            placeholder="Pozisyon ara..."
                            className="flex-1 px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <Button size="lg">İlan Ara</Button>
                    </div>
                </div>
            </div>
        </section>
    )
}

