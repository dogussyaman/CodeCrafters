"use client"

import { Marquee } from "@/components/ui/marquee"
import { cn } from "@/lib/utils"

const LOGOS = [
  { name: "Next.js", slug: "nextdotjs", href: "https://nextjs.org" },
  { name: "Supabase", slug: "supabase", href: "https://supabase.com" },
  { name: "Tailwind CSS", slug: "tailwindcss", href: "https://tailwindcss.com" },
  { name: "TypeScript", slug: "typescript", href: "https://www.typescriptlang.org" },
  { name: "React", slug: "react", href: "https://react.dev" },
  { name: "Vercel", slug: "vercel", href: "https://vercel.com" },
]

function LogoItem({
  name,
  slug,
  href,
}: {
  name: string
  slug: string
  href: string
}) {
  const iconUrl = `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${slug}.svg`
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex shrink-0 items-center gap-3 rounded-xl border px-5 py-3 transition-colors",
        "border-border/60 bg-muted/30 hover:bg-muted/60 hover:border-primary/30",
        "dark:border-border dark:bg-muted/20 dark:hover:bg-muted/40"
      )}
      aria-label={name}
    >
      <img
        src={iconUrl}
        alt=""
        className="size-8 object-contain filter-[invert(0.5)] dark:filter-[invert(0.8)]"
        width={32}
        height={32}
      />
      <span className="text-sm font-medium text-foreground/90">{name}</span>
    </a>
  )
}

export function LogoCloudSection() {
  return (
    <section className="relative w-full overflow-hidden py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-2xl font-bold tracking-tight text-foreground mb-10">
          Bu platformda kullanılan teknolojiler
        </h2>
        <p className="text-center text-muted-foreground text-sm max-w-xl mx-auto mb-12">
          CodeCrafters, modern ve güvenilir araçlarla geliştirilmiştir.
        </p>
      </div>
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        <Marquee pauseOnHover className="[--duration:30s]">
          {LOGOS.map((logo) => (
            <LogoItem key={logo.slug} {...logo} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:35s] mt-4">
          {[...LOGOS].reverse().map((logo) => (
            <LogoItem key={logo.slug} {...logo} />
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-linear-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-linear-to-l from-background to-transparent" />
      </div>
    </section>
  )
}
