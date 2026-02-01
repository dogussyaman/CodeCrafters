"use client"

import Link from "next/link"
import { Marquee } from "@/components/ui/marquee"
import { cn } from "@/lib/utils"
import { Users, Heart, Code2, Sparkles } from "lucide-react"

const CONTRIBUTORS = [
  { label: "CodeCrafters Topluluk", icon: Users, href: "/topluluk" },
  { label: "Açık Kaynak Katkıcıları", icon: Code2, href: "/projeler" },
  { label: "Destek Verenler", icon: Heart, href: "/destek" },
  { label: "Geliştirici Ekibi", icon: Sparkles, href: "/hakkimizda" },
]

function ContributorItem({
  label,
  icon: Icon,
  href,
}: {
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex shrink-0 items-center gap-3 rounded-xl border px-5 py-3 transition-colors",
        "border-border/60 bg-muted/30 hover:bg-muted/60 hover:border-primary/30",
        "dark:border-border dark:bg-muted/20 dark:hover:bg-muted/40"
      )}
    >
      <Icon className="size-5 text-primary" />
      <span className="text-sm font-medium text-foreground/90">{label}</span>
    </Link>
  )
}

export function ContributorsMarquee() {
  return (
    <section className="relative w-full overflow-hidden py-16 md:py-20">
      <div className="container mx-auto px-4 mb-8 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Katkıda Bulunanlar
        </h2>
        <p className="text-muted-foreground text-sm max-w-xl mx-auto mt-2">
          CodeCrafters topluluğu ve destek verenler.
        </p>
      </div>
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        <Marquee pauseOnHover className="[--duration:25s]">
          {CONTRIBUTORS.map((item) => (
            <ContributorItem key={item.label} {...item} />
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-linear-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-linear-to-l from-background to-transparent" />
      </div>
    </section>
  )
}
