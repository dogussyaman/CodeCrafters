"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Heart, Code2, Sparkles, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const CONTRIBUTORS = [
  {
    label: "CodeCrafters Topluluk",
    description: "Geliştiriciler ve işverenlerin buluştuğu topluluk.",
    icon: Users,
    href: "/topluluk",
    gradient: "from-violet-500/20 via-primary/10 to-transparent",
    iconBg: "bg-violet-500/20",
  },
  {
    label: "Açık Kaynak Katkıcıları",
    description: "Projelerini paylaşan ve işbirliği yapan geliştiriciler.",
    icon: Code2,
    href: "/projeler",
    gradient: "from-emerald-500/20 via-primary/10 to-transparent",
    iconBg: "bg-emerald-500/20",
  },
  {
    label: "Destek Verenler",
    description: "Canlı destek ve yardım talepleriyle yanımızda olanlar.",
    icon: Heart,
    href: "/destek",
    gradient: "from-rose-500/20 via-primary/10 to-transparent",
    iconBg: "bg-rose-500/20",
  },
  {
    label: "Geliştirici Ekibi",
    description: "CodeCrafters'ı inşa eden ve sürekli geliştiren ekip.",
    icon: Sparkles,
    href: "/hakkimizda",
    gradient: "from-amber-500/20 via-primary/10 to-transparent",
    iconBg: "bg-amber-500/20",
  },
]

function ContributorCard({
  label,
  description,
  icon: Icon,
  href,
  gradient,
  iconBg,
}: {
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  gradient: string
  iconBg: string
}) {
  return (
    <Link href={href} className="block h-full group">
      <Card
        className={cn(
          "relative h-full overflow-hidden border-border/60 bg-card/50 backdrop-blur-sm",
          "transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30",
          "hover:-translate-y-0.5"
        )}
      >
        <div className={cn("absolute inset-0 bg-linear-to-br opacity-50 pointer-events-none", gradient)} />
        <CardContent className="relative z-10 p-6 flex flex-col gap-4">
          <div
            className={cn(
              "size-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110",
              iconBg,
              "text-primary"
            )}
          >
            <Icon className="size-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
              {label}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{description}</p>
          </div>
          <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2 transition-[gap]">
            Keşfet
            <ArrowRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </CardContent>
      </Card>
    </Link>
  )
}

export function ContributorsSection() {
  return (
    <section className="relative w-full py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Katkıda Bulunanlar
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            CodeCrafters topluluğu ve platforma destek veren herkes.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CONTRIBUTORS.map((item) => (
            <ContributorCard key={item.label} {...item} />
          ))}
        </div>
      </div>
    </section>
  )
}
