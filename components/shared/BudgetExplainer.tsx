import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'

interface MediaRef {
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
}

interface AmountItem {
  amount?: string | null
  title?: string | null
}

interface BudgetExplainerProps {
  title?: string | null
  subtitle?: string | null
  subtext?: Record<string, unknown> | null
  amounts?: AmountItem[] | null
  statement?: Record<string, unknown> | null
  ctaLabel?: string | null
  ctaLink?: string | null
  qrCode?: MediaRef | number | null
  image?: MediaRef | number | null
  quoteIcon?: MediaRef | number | null
  quote?: Record<string, unknown> | null
  quoteAttribution?: Record<string, unknown> | null
}

function ArrowIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="w-6 h-6 flex-shrink-0" aria-hidden="true">
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

export function BudgetExplainer({
  title,
  subtitle,
  subtext,
  amounts,
  statement,
  ctaLabel,
  ctaLink,
  qrCode,
  image,
  quoteIcon,
  quote,
  quoteAttribution,
}: BudgetExplainerProps) {
  const imageRef = typeof image === 'object' && image !== null ? (image as MediaRef) : null
  const qrRef = typeof qrCode === 'object' && qrCode !== null ? (qrCode as MediaRef) : null
  const quoteIconImg = typeof quoteIcon === 'object' && quoteIcon !== null ? (quoteIcon as MediaRef) : null

  const hasContent = title || subtitle || subtext || (amounts && amounts.length > 0) || statement || imageRef || quote
  if (!hasContent) return null

  return (
    <section id="budget-explainer" className="bg-white py-8">
      <div className="max-w-6xl mx-auto px-4 md:px-8">

        {/* Wrapper — flex row, 20/80 */}
        <div className="flex flex-row gap-0">

          {/* Left (20%) — title, subtitle, subtext */}
          <div className="w-1/5 flex-shrink-0 flex flex-col gap-4 pr-6 text-center">
            {title && (
              <p className="font-sans font-black text-brand-orange leading-none" style={{ fontSize: '5rem' }}>
                {title}
              </p>
            )}
            {subtitle && (
              <p className="font-sans font-bold text-brand-orange text-xl uppercase tracking-wide -mt-4">
                {subtitle}
              </p>
            )}
            {subtext && (
              <div className="font-sans font-bold text-brand-orange text-[18px] leading-snug text-right [&_p]:mb-0">
                <RichText data={subtext as never} />
              </div>
            )}
          </div>

          {/* Right (80%) — two inner divs as flex row */}
          <div className="flex-1 flex flex-row gap-8 border-l border-brand-blue pl-8">

            {/* Left inner — amounts, statement, CTA, QR */}
            <div className="w-2/5 flex-shrink-0 flex flex-col gap-5">
              {amounts && amounts.length > 0 && (
                <div className="flex flex-col gap-3">
                  {amounts.map((item, i) => (
                    <div key={i} className="flex flex-row items-start gap-3">
                      <div className="mt-1">
                        <ArrowIcon />
                      </div>
                      <div>
                        {item.amount && (
                          <p className="font-sans font-bold text-brand-orange text-[20px] leading-tight">{item.amount}</p>
                        )}
                        {item.title && (
                          <p className="font-sans text-text-dark text-base">{item.title}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {statement && (
                <div className="font-sans font-[600] text-brand-blue leading-snug [&_p]:text-base [&_p]:mb-0">
                  <RichText data={statement as never} />
                </div>
              )}

              {ctaLabel && ctaLink && (
                <a
                  href={ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-brand-orange text-white rounded-full px-8 py-3 font-sans font-bold uppercase tracking-widest text-sm hover:bg-orange-600 transition-colors self-start"
                >
                  {ctaLabel}
                </a>
              )}

              {qrRef?.url && (
                <Image
                  src={qrRef.url}
                  alt={qrRef.alt ?? 'QR Code'}
                  width={qrRef.width ?? 120}
                  height={qrRef.height ?? 120}
                  className="object-contain h-[150px] w-auto self-start"
                />
              )}
            </div>

            {/* Right inner — image + quote */}
            <div className="flex-1 flex flex-col gap-4">
              {imageRef?.url && (
                <div className="overflow-hidden">
                  <Image
                    src={imageRef.url}
                    alt={imageRef.alt ?? ''}
                    width={imageRef.width ?? 600}
                    height={imageRef.height ?? 400}
                    className="w-full object-cover"
                  />
                </div>
              )}

              {quote && (
                <div className="flex flex-col">

                  {/* Upper quote icon */}
                  <div>
                    {quoteIconImg?.url ? (
                      <Image src={quoteIconImg.url} alt="" width={72} height={54} className="object-contain" />
                    ) : (
                      <DefaultQuoteIcon />
                    )}
                  </div>

                  {/* Text wrapper */}
                  <div className="flex flex-col px-14 -mt-[25px]">
                    <div className="font-serif text-text-dark text-base leading-relaxed text-center [&_p]:mb-1 [&_p:last-child]:mb-0">
                      <RichText data={quote as never} />
                    </div>
                    {quoteAttribution && (
                      <div className="font-serif italic text-text-muted text-base text-right mt-1 -translate-x-[25px] [&_p]:mb-0">
                        <RichText data={quoteAttribution as never} />
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
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
