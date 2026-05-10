interface Stat {
  statValue?: string | null
  statLabel?: string | null
}

interface StatGridProps {
  heading: string
  stats: Stat[]
}

export function StatGrid({ heading, stats }: StatGridProps) {
  if (!stats || stats.length === 0) return null

  return (
    <section className="py-16 md:py-24 bg-surface-light">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {heading && (
          <h2 className="font-sans uppercase tracking-widest text-sm text-brand-blue font-semibold text-center mb-10">
            {heading}
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm p-8 text-center"
            >
              {stat.statValue && (
                <p className="font-sans font-extrabold text-2xl md:text-3xl text-brand-orange leading-tight mb-3">
                  {stat.statValue}
                </p>
              )}
              {stat.statLabel && (
                <p className="font-sans text-text-dark text-sm leading-relaxed">{stat.statLabel}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
