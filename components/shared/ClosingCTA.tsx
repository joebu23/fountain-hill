import { RichText } from '@payloadcms/richtext-lexical/react'

interface CampaignPageClosing {
  closingHeading?: string | null
  closingBody?: Record<string, unknown> | null
  closingCTALabel?: string | null
}

interface ClosingCTAProps {
  page: CampaignPageClosing
  donateUrl: string
}

export function ClosingCTA({ page, donateUrl }: ClosingCTAProps) {
  return (
    <section className="py-16 md:py-24 bg-brand-blue text-white text-center">
      <div className="max-w-3xl mx-auto px-4 md:px-8">
        {page.closingHeading && (
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-8">
            {page.closingHeading}
          </h2>
        )}
        {page.closingBody && (
          <div className="font-sans text-white/90 text-base md:text-lg leading-relaxed mb-10 [&_p]:mb-4">
            <RichText data={page.closingBody as never} />
          </div>
        )}
        {page.closingCTALabel && (
          <a
            href={donateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border-2 border-white text-white rounded-full px-8 py-3 font-sans font-semibold uppercase tracking-wide hover:bg-white hover:text-brand-blue transition-colors"
          >
            {page.closingCTALabel}
          </a>
        )}
      </div>
    </section>
  )
}
