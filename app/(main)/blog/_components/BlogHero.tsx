export function BlogHero() {
  return (
    <div className="relative min-h-[36vh] w-full overflow-hidden rounded-b-[2rem] bg-gradient-to-br from-primary via-primary/95 to-primary/85 pt-20 pb-14 md:pt-24 md:pb-16">
      {/* Subtle pattern */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
      />
      <div className="container relative mx-auto px-4 max-w-6xl">
        <header className="max-w-2xl">
          <span className="inline-block rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-white/90 backdrop-blur-sm">
            Blog
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white drop-shadow-sm md:text-4xl lg:text-5xl">
            Geliştirici eğitimleri ve topluluk yazıları
          </h1>
          <p className="mt-3 text-base leading-relaxed text-white/90 drop-shadow-sm md:text-lg">
            Kariyer ipuçları, teknoloji yazıları ve topluluk deneyimleri. Birlikte öğrenelim ve büyüyelim.
          </p>
          <div className="mt-6 h-0.5 w-16 rounded-full bg-white/40" />
        </header>
      </div>
    </div>
  )
}
