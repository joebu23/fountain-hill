import { RichText } from '@payloadcms/richtext-lexical/react'

interface MissionStatementProps {
  heading: string
  body?: Record<string, unknown> | null
}

export function MissionStatement({ heading, body }: MissionStatementProps) {
  if (!heading && !body) return null

  return (
    <section className="py-16 md:py-24 bg-surface-light">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {heading && (
          <h2 className="font-serif text-3xl md:text-4xl text-brand-blue mb-10 text-center">
            {heading}
          </h2>
        )}
        {body && (
          <div className="flex gap-6 items-start">
            {/* Decorative large quotation marks */}
            <div className="flex-shrink-0 -mt-2" aria-hidden="true">
              <span
                className="block text-[6rem] leading-none font-serif text-brand-orange select-none"
                style={{ lineHeight: 0.8 }}
              >
                "
              </span>
            </div>
            <div className="font-sans text-text-dark text-lg leading-relaxed [&_p]:mb-4 flex-1">
              <RichText data={body as never} />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
