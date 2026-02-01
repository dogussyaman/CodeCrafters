"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { GLOSSARY_CATEGORIES, type GlossaryCategory } from "@/lib/glossary"
import { cn } from "@/lib/utils"

export function GlossaryCategoryTabs() {
  const searchParams = useSearchParams()
  const q = searchParams.get("q") ?? ""
  const category = (searchParams.get("category") ?? "") as GlossaryCategory | ""

  const isValidCategory = (c: string): c is GlossaryCategory =>
    GLOSSARY_CATEGORIES.some((cat) => cat.id === c)

  const currentCategory = isValidCategory(category) ? category : null

  return (
    <div className="flex flex-wrap gap-2 mt-6">
      <Link
        href={q ? `/terimler?q=${encodeURIComponent(q)}` : "/terimler"}
        className={cn(
          "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
          !currentCategory
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        )}
      >
        Tümü
      </Link>
      {GLOSSARY_CATEGORIES.map((cat) => {
        const href = q
          ? `/terimler?q=${encodeURIComponent(q)}&category=${cat.id}`
          : `/terimler?category=${cat.id}`
        return (
          <Link
            key={cat.id}
            href={href}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              currentCategory === cat.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {cat.label}
          </Link>
        )
      })}
    </div>
  )
}
