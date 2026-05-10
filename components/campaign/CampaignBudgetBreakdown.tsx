import { RichText } from '@payloadcms/richtext-lexical/react'
import { EndorsementQuote } from '@/components/shared/EndorsementQuote'

interface MediaRef {
  url?: string | null
  alt?: string | null
}

interface TestimonialRef {
  quote?: Record<string, unknown> | null
  attribution?: string | null
  attributionTitle?: string | null
  photo?: MediaRef | null
}

interface CampaignPageBudget {
  budgetHeading?: string | null
  budgetItems?: { label: string; amount: number }[] | null
  budgetBodyText?: Record<string, unknown> | null
  budgetEndorsement?: TestimonialRef | string | null
}

interface CampaignBudgetBreakdownProps {
  page: CampaignPageBudget
  goalAmount: number
  donateUrl: string
}

function formatCurrency(amount: number) {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}

export function CampaignBudgetBreakdown({ page, goalAmount, donateUrl }: CampaignBudgetBreakdownProps) {
  const endorsement =
    page.budgetEndorsement && typeof page.budgetEndorsement === 'object'
      ? (page.budgetEndorsement as TestimonialRef)
      : null

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {/* Left — budget */}
          <div>
            <p className="font-sans font-extrabold text-4xl md:text-5xl text-brand-orange mb-8 leading-none">
              {formatCurrency(goalAmount)}<br />
              <span className="text-2xl text-text-muted font-semibold">CAMPAIGN GOAL</span>
            </p>

            {page.budgetItems && page.budgetItems.length > 0 && (
              <ul className="space-y-4 mb-8">
                {page.budgetItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-4 border-l-4 border-brand-orange pl-4">
                    <div className="flex-1">
                      <p className="font-sans font-semibold text-text-dark">{item.label}</p>
                    </div>
                    <p className="font-sans font-bold text-brand-orange flex-shrink-0">
                      {formatCurrency(item.amount)}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            {page.budgetBodyText && (
              <div className="font-sans text-brand-orange italic text-base leading-relaxed mb-8 font-medium">
                <RichText data={page.budgetBodyText as never} />
              </div>
            )}

            <p className="font-sans font-semibold text-text-dark mb-4">
              Join Us. Make Your Impact Today.
            </p>
            <a
              href={donateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-brand-orange text-white rounded-full px-8 py-3 font-sans font-semibold uppercase tracking-wide hover:bg-orange-600 transition-colors"
            >
              Donate Here
            </a>
          </div>

          {/* Right — endorsement */}
          <div className="flex items-start">
            {endorsement && endorsement.quote ? (
              <EndorsementQuote
                quote={endorsement.quote as never}
                attribution={endorsement.attribution ?? ''}
                attributionTitle={endorsement.attributionTitle ?? undefined}
                photo={endorsement.photo ?? undefined}
              />
            ) : (
              <div className="w-full rounded-2xl overflow-hidden">
                <img
                  src="https://placehold.co/600x400/EBF4FB/2B6CB0?text=Endorsement+Quote"
                  alt="Campaign endorsement"
                  className="w-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
