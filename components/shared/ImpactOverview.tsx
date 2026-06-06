import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'

interface MediaRef {
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
}

interface ImpactItem {
  title?: string | null
  body?: Record<string, unknown> | null
}

interface ImpactOverviewProps {
  titleImage?: MediaRef | number | null
  quoteIcon?: MediaRef | number | null
  quote?: Record<string, unknown> | null
  quoteAttribution?: string | null
  title?: Record<string, unknown> | null
  headerIcon?: MediaRef | number | null
  impactItems?: ImpactItem[] | null
}

function DefaultHeaderIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="w-[84px] h-[84px] flex-shrink-0" aria-hidden="true">
      <circle cx="32" cy="32" r="32" fill="#4BC8E8" />
      <path d="M20 32h24M36 22l12 10-12 10" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

function DefaultQuoteIcon({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 64 48"
      className={`w-[72px] h-[54px] text-brand-orange ${flip ? 'rotate-180' : ''}`}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M0 48V29.3C0 12.3 10.9 3.1 32.7 0l3.6 5.8C24.5 8.3 18.4 13.5 17.5 22H28V48H0zm36 0V29.3C36 12.3 46.9 3.1 68.7 0l3.6 5.8C60.5 8.3 54.4 13.5 53.5 22H64V48H36z" />
    </svg>
  )
}

export function ImpactOverview({
  titleImage,
  quoteIcon,
  quote,
  quoteAttribution,
  title,
  headerIcon,
  impactItems,
}: ImpactOverviewProps) {
  const titleImg = typeof titleImage === 'object' && titleImage !== null ? (titleImage as MediaRef) : null
  const quoteIconImg = typeof quoteIcon === 'object' && quoteIcon !== null ? (quoteIcon as MediaRef) : null
  const headerIconImg = typeof headerIcon === 'object' && headerIcon !== null ? (headerIcon as MediaRef) : null

  const hasContent = titleImg || quote || title || (impactItems && impactItems.length > 0)
  if (!hasContent) return null

  return (
    <section id="impact-overview" className="bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col">

        {/* Div 1: title wrapper — image, icon, title in a row */}
        <div className="flex flex-row items-center gap-6">
          {titleImg?.url && (
            <div className="overflow-hidden flex-shrink-0 w-1/2">
              <Image
                src={titleImg.url}
                alt={titleImg.alt ?? ''}
                width={titleImg.width ?? 600}
                height={titleImg.height ?? 300}
                className="w-full h-56 object-cover"
              />
            </div>
          )}

          {headerIconImg?.url ? (
            <Image src={headerIconImg.url} alt="" width={84} height={84} className="flex-shrink-0" />
          ) : (
            <DefaultHeaderIcon />
          )}

          {title && (
            <div className="font-sans leading-none text-center
              [&_h1]:text-[4rem] [&_h1]:font-[700] [&_h1]:uppercase [&_h1]:text-brand-orange [&_h1]:leading-none [&_h1]:mb-0
              [&_h2]:text-[4rem] [&_h2]:font-[700] [&_h2]:uppercase [&_h2]:text-brand-orange [&_h2]:leading-none [&_h2]:mb-0
              [&_h3]:text-[4rem] [&_h3]:font-[700] [&_h3]:uppercase [&_h3]:text-brand-orange [&_h3]:leading-none [&_h3]:mb-0
              [&_p]:text-2xl [&_p]:font-[900] [&_p]:text-brand-orange [&_p]:leading-snug [&_p]:mb-0">
              <RichText data={title as never} />
            </div>
          )}
        </div>

        {/* Div 2: quote + impact items */}
        <div className="flex flex-row gap-8 md:gap-12 items-start">

          {/* Quote */}
          {quote && (
            <div className="w-2/5 flex-shrink-0 flex flex-col">

              {/* Upper quote icon */}
              <div>
                {quoteIconImg?.url ? (
                  <Image src={quoteIconImg.url} alt="" width={72} height={54} className="object-contain" />
                ) : (
                  <DefaultQuoteIcon />
                )}
              </div>

              {/* Text wrapper */}
              <div className="flex flex-col px-10 -mt-[25px]">
                <div className="font-serif text-text-dark text-base leading-relaxed text-center [&_p]:mb-1 [&_p:last-child]:mb-0">
                  <RichText data={quote as never} />
                </div>
                {quoteAttribution && (
                  <div className="font-serif italic text-text-muted text-base text-right mt-1 -translate-x-[25px]">
                    {quoteAttribution}
                  </div>
                )}
              </div>

              {/* Lower quote icon */}
              <div className="flex justify-end -mt-[25px]">
                {quoteIconImg?.url ? (
                  <Image src={quoteIconImg.url} alt="" width={72} height={54} className="object-contain scale-x-[-1] scale-y-[-1]" />
                ) : (
                  <DefaultQuoteIcon flip />
                )}
              </div>

            </div>
          )}

          {/* Impact items timeline */}
          {impactItems && impactItems.length > 0 && (
            <div className="w-3/5 relative">
              {/* Vertical centre line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#4BC8E8] -translate-x-1/2" />

              <div className="flex flex-col gap-8">
                {impactItems.map((item, i) => {
                  const isLeft = i % 2 === 0
                  return (
                    <div key={i} className="relative grid grid-cols-2">
                      {/* Orange dot on the line */}
                      <div className="absolute left-1/2 top-1/2 w-3 h-3 rounded-full bg-brand-orange -translate-x-1/2 -translate-y-1/2 z-10 ring-2 ring-white" />

                      {/* Left cell */}
                      <div className="pr-6 text-right">
                        {isLeft && item.title && (
                          <>
                            <p className="font-sans font-bold text-brand-blue text-[20px] mb-1">{item.title}</p>
                            {item.body && (
                              <div className="font-sans text-text-dark text-base leading-relaxed [&_p]:mb-1 [&_p:last-child]:mb-0">
                                <RichText data={item.body as never} />
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Right cell */}
                      <div className="pl-6">
                        {!isLeft && item.title && (
                          <>
                            <p className="font-sans font-bold text-brand-blue text-[20px] mb-1">{item.title}</p>
                            {item.body && (
                              <div className="font-sans text-text-dark text-base leading-relaxed [&_p]:mb-1 [&_p:last-child]:mb-0">
                                <RichText data={item.body as never} />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  )
}
