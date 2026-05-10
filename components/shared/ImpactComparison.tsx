import { Testimonial } from './Testimonial'

interface ImpactMetric {
  currentLabel?: string | null
  currentDescription?: string | null
  projectedLabel?: string | null
  projectedDescription?: string | null
}

interface TestimonialRef {
  quote?: Record<string, unknown> | null
  attribution?: string | null
  attributionTitle?: string | null
}

interface CampaignPageImpact {
  impactHeading?: string | null
  impactMetrics?: ImpactMetric[] | null
  impactTestimonial?: TestimonialRef | string | null
}

interface ImpactComparisonProps {
  page: CampaignPageImpact
}

export function ImpactComparison({ page }: ImpactComparisonProps) {
  const testimonial =
    page.impactTestimonial && typeof page.impactTestimonial === 'object'
      ? (page.impactTestimonial as TestimonialRef)
      : null

  return (
    <section className="py-16 md:py-24 bg-surface-light">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {page.impactHeading && (
          <div className="flex items-center justify-center gap-6 mb-12">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="w-14 h-14 flex-shrink-0" aria-hidden="true">
              <circle cx="32" cy="32" r="32" fill="#4BC8E8" />
              <path d="M20 32h24M36 22l12 10-12 10" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
            <h2 className="font-serif text-4xl md:text-5xl text-brand-blue leading-tight">
              IMPACT<br />
              <span className="text-brand-orange">at a</span><br />
              GLANCE
            </h2>
          </div>
        )}

        {page.impactMetrics && page.impactMetrics.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {page.impactMetrics.map((metric, i) => (
              <div key={i} className="grid grid-cols-2 gap-4">
                {/* Currently card */}
                <div className="bg-white rounded-2xl p-5">
                  {metric.currentLabel && (
                    <p className="font-sans font-bold text-brand-blue text-sm mb-2">
                      {metric.currentLabel}
                    </p>
                  )}
                  {metric.currentDescription && (
                    <p className="font-sans text-text-dark text-xs leading-relaxed">
                      {metric.currentDescription}
                    </p>
                  )}
                </div>
                {/* Your Impact card */}
                <div className="bg-brand-orange rounded-2xl p-5">
                  {metric.projectedLabel && (
                    <p className="font-sans font-bold text-white text-sm mb-2">
                      {metric.projectedLabel}
                    </p>
                  )}
                  {metric.projectedDescription && (
                    <p className="font-sans text-white/90 text-xs leading-relaxed">
                      {metric.projectedDescription}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {testimonial && testimonial.quote && (
          <div className="max-w-2xl mx-auto">
            <Testimonial
              quote={testimonial.quote as Record<string, unknown>}
              attribution={testimonial.attribution ?? ''}
              attributionTitle={testimonial.attributionTitle}
            />
          </div>
        )}
      </div>
    </section>
  )
}
