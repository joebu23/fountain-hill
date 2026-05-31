import { RichText } from '@payloadcms/richtext-lexical/react'

interface CampaignTitleBlockProps {
  headline?: string | null
  subheadline?: Record<string, unknown> | null
}

function ArrowRight() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      className="w-14 h-14 flex-shrink-0"
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="32" fill="#4BC8E8" />
      <path
        d="M20 32h24M36 22l12 10-12 10"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export function CampaignTitleBlock({ headline, subheadline }: CampaignTitleBlockProps) {
  return (
    <div id="campaign-title-block">
      {headline && (
        <div className="flex items-start gap-4 mb-4">
          <div className="mt-1 flex-shrink-0">
            <ArrowRight />
          </div>
          <h1 className="font-sans leading-none">
            {(() => {
              const lower = headline.toLowerCase()
              const takesIdx = lower.indexOf('takes')
              if (takesIdx === -1) {
                return (
                  <span className="block font-extrabold italic uppercase text-4xl md:text-5xl lg:text-6xl text-brand-orange">
                    {headline}
                  </span>
                )
              }
              const before = headline.slice(0, takesIdx).trim()
              const after = headline.slice(takesIdx + 5).trim()
              return (
                <>
                  {before && (
                    <span className="block font-extrabold italic uppercase text-4xl md:text-5xl lg:text-6xl text-brand-orange">
                      {before}
                    </span>
                  )}
                  <span className="block font-normal italic text-lg md:text-xl text-text-muted text-center">
                    takes
                  </span>
                  {after && (
                    <span className="block font-extrabold italic uppercase text-4xl md:text-5xl lg:text-6xl text-brand-orange">
                      {after}
                    </span>
                  )}
                </>
              )
            })()}
          </h1>
        </div>
      )}
      {subheadline && (
        <div className="text-text-dark font-sans text-base md:text-lg leading-relaxed max-w-lg mt-4">
          <RichText data={subheadline as never} />
        </div>
      )}
    </div>
  )
}
