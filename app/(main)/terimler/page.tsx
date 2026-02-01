import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { BookOpen, ExternalLink } from "lucide-react"
import {
  getGlossaryByLetter,
  getGlossaryByCategory,
  searchGlossary,
  GLOSSARY_CATEGORIES,
  type GlossaryCategory,
} from "@/lib/glossary"
import { GlossarySearch } from "./_components/GlossarySearch"
import { GlossaryCategoryTabs } from "./_components/GlossaryCategoryTabs"

function isValidCategory(c: string): c is GlossaryCategory {
  return GLOSSARY_CATEGORIES.some((cat) => cat.id === c)
}

export default async function TerimlerPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>
}) {
  const { q, category } = await searchParams
  const byLetter = getGlossaryByLetter()
  const byCategory = getGlossaryByCategory()
  const letters = Object.keys(byLetter).sort()
  const searchResults = q ? searchGlossary(q) : null
  const activeCategory = category && isValidCategory(category) ? category : null

  // Kategori seçiliyse ve arama yoksa: o kategorideki terimleri harfe göre grupla
  const termsByLetterInCategory =
    activeCategory && !q
      ? (() => {
          const terms = byCategory[activeCategory]
          const grouped: Record<string, typeof terms> = {}
          for (const t of terms) {
            const letter = t.term[0].toUpperCase()
            if (!grouped[letter]) grouped[letter] = []
            grouped[letter].push(t)
          }
          for (const key of Object.keys(grouped)) {
            grouped[key].sort((a, b) => a.term.localeCompare(b.term))
          }
          return grouped
        })()
      : null

  const categoryLabel = activeCategory
    ? GLOSSARY_CATEGORIES.find((c) => c.id === activeCategory)?.label ?? activeCategory
    : null

  return (
    <div className="min-h-screen bg-background py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-2 flex items-center gap-2">
            <BookOpen className="size-10" />
            Yazılım Terimleri
          </h1>
          <p className="text-muted-foreground">
            Geliştiriciler için sık kullanılan terimler ve kısa açıklamaları.
          </p>
        </div>

        <GlossarySearch />
        <GlossaryCategoryTabs />

        {searchResults !== null ? (
          <section className="mt-8">
            <h2 className="text-xl font-semibold mb-4">
              {q ? `"${q}" araması (${searchResults.length} sonuç)` : "Tüm terimler"}
            </h2>
            {searchResults.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  Arama sonucu bulunamadı.
                </CardContent>
              </Card>
            ) : (
              <ul className="space-y-4">
                {searchResults.map((t) => (
                  <li key={t.term}>
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {t.term}
                            {t.link && (
                              <a
                                href={t.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground"
                                aria-label="Kaynak"
                              >
                                <ExternalLink className="size-4" />
                              </a>
                            )}
                          </CardTitle>
                          {t.category && (
                            <span className="text-xs rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
                              {GLOSSARY_CATEGORIES.find((c) => c.id === t.category)?.label ?? t.category}
                            </span>
                          )}
                        </div>
                        <CardDescription className="text-base text-foreground/90">
                          {t.definition}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ) : termsByLetterInCategory ? (
          <section className="mt-8 space-y-8">
            <h2 className="text-xl font-semibold mb-4">{categoryLabel} terimleri</h2>
            {Object.keys(termsByLetterInCategory)
              .sort()
              .map((letter) => (
                <div key={letter}>
                  <h3 className="text-2xl font-bold mb-4 border-b pb-2">{letter}</h3>
                  <ul className="space-y-3">
                    {termsByLetterInCategory[letter].map((t) => (
                      <li key={t.term}>
                        <Card>
                          <CardHeader className="py-3">
                            <CardTitle className="text-base flex items-center gap-2">
                              {t.term}
                              {t.link && (
                                <a
                                  href={t.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-muted-foreground hover:text-foreground"
                                  aria-label="Kaynak"
                                >
                                  <ExternalLink className="size-4" />
                                </a>
                              )}
                            </CardTitle>
                            <CardDescription className="text-sm text-foreground/90">
                              {t.definition}
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </section>
        ) : (
          <section className="mt-8 space-y-8">
            {letters.map((letter) => (
              <div key={letter}>
                <h2 className="text-2xl font-bold mb-4 border-b pb-2">{letter}</h2>
                <ul className="space-y-3">
                  {byLetter[letter].map((t) => (
                    <li key={t.term}>
                      <Card>
                        <CardHeader className="py-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <CardTitle className="text-base flex items-center gap-2">
                              {t.term}
                              {t.link && (
                                <a
                                  href={t.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-muted-foreground hover:text-foreground"
                                  aria-label="Kaynak"
                                >
                                  <ExternalLink className="size-4" />
                                </a>
                              )}
                            </CardTitle>
                            {t.category && (
                              <span className="text-xs rounded-full bg-muted px-2 py-0.5 text-muted-foreground">
                                {GLOSSARY_CATEGORIES.find((c) => c.id === t.category)?.label ?? t.category}
                              </span>
                            )}
                          </div>
                          <CardDescription className="text-sm text-foreground/90">
                            {t.definition}
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  )
}
