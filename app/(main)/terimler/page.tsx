import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, ExternalLink } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import type { GlossaryTerm } from "@/lib/glossary"
import {
  getGlossaryByLetter,
  getGlossaryByCategory,
  searchGlossary,
  getUsageContent,
  GLOSSARY_CATEGORIES,
} from "@/lib/glossary"
import { GlossarySearch } from "./_components/GlossarySearch"
import { GlossaryCategoryTabs } from "./_components/GlossaryCategoryTabs"
import { GlossaryPagination } from "./_components/GlossaryPagination"

const DEFAULT_PER_PAGE = 20

function isValidCategory(c: string): boolean {
  return GLOSSARY_CATEGORIES.some((cat) => cat.id === c)
}

function flattenByLetter(byLetter: Record<string, GlossaryTerm[]>): GlossaryTerm[] {
  const letters = Object.keys(byLetter).sort()
  return letters.flatMap((letter) => byLetter[letter])
}

export default async function TerimlerPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; page?: string; perPage?: string }>
}) {
  const { q, category, page: pageParam, perPage: perPageParam } = await searchParams
  const byLetter = getGlossaryByLetter()
  const byCategory = getGlossaryByCategory()
  const letters = Object.keys(byLetter).sort()
  const searchResults = q ? searchGlossary(q) : null
  const activeCategory = category && isValidCategory(category) ? category : null

  // Düz liste: arama sonucu, kategori terimleri veya tümü
  const allTerms: GlossaryTerm[] =
    searchResults !== null
      ? searchResults
      : activeCategory && !q
        ? (byCategory[activeCategory] ?? [])
        : flattenByLetter(byLetter)

  const perPage =
    perPageParam === "10" ? 10 : perPageParam === "20" ? 20 : DEFAULT_PER_PAGE
  const totalCount = allTerms.length
  const totalPages = Math.max(1, Math.ceil(totalCount / perPage))
  const page = Math.max(1, Math.min(totalPages, parseInt(pageParam ?? "1", 10) || 1))
  const start = (page - 1) * perPage
  const paginatedTerms = allTerms.slice(start, start + perPage)

  const categoryLabel = activeCategory
    ? GLOSSARY_CATEGORIES.find((c) => c.id === activeCategory)?.label ?? activeCategory
    : null

  const baseParams = { q: q ?? undefined, category: activeCategory ?? undefined }

  return (
    <div className="min-h-screen bg-background py-24">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2 flex items-center gap-2">
            <BookOpen className="size-10" />
            Yazılım Terimleri
          </h1>
          <p className="text-muted-foreground">
            Geliştiriciler için sık kullanılan terimler ve kısa açıklamaları.
          </p>
        </div>

        <GlossarySearch />

        <div className="grid grid-cols-12 gap-6 mt-8">
          <aside className="col-span-4">
            <GlossaryCategoryTabs />
          </aside>
          <main className="col-span-8 min-w-0">
            <section className="mt-8">
              <h2 className="text-xl font-semibold mb-4">
                {q
                  ? `"${q}" araması (${totalCount} sonuç)`
                  : activeCategory
                    ? `${categoryLabel} terimleri (${totalCount})`
                    : `Tüm terimler (${totalCount})`}
              </h2>
              {paginatedTerms.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    {q ? "Arama sonucu bulunamadı." : "Bu kategoride terim yok."}
                  </CardContent>
                </Card>
              ) : (
                <>
                  <ul className="space-y-4">
                    {paginatedTerms.map((t) => (
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
                              {t.description}
                            </CardDescription>
                            {t.detailed_description && (
                              <p className="text-sm text-muted-foreground mt-2">{t.detailed_description}</p>
                            )}
                            {getUsageContent(t) && (
                              <div className="mt-3 pt-3 border-t prose prose-sm dark:prose-invert max-w-none">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{getUsageContent(t)}</ReactMarkdown>
                              </div>
                            )}
                          </CardHeader>
                        </Card>
                      </li>
                    ))}
                  </ul>
                  <GlossaryPagination
                    currentPage={page}
                    totalPages={totalPages}
                    totalCount={totalCount}
                    perPage={perPage}
                    baseParams={baseParams}
                  />
                </>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}
