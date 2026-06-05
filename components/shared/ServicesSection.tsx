import Image from 'next/image'

interface MediaRef {
  url?: string | null
  alt?: string | null
}

interface ListItem {
  item: string
}

interface LeftGroup {
  leftTitle?: string | null
  list?: ListItem[] | null
}

interface RightGroup {
  image?: MediaRef | number | null
  title?: string | null
  ctaLabel?: string | null
  ctaLink?: string | null
  qrCodeImage?: MediaRef | number | null
  calloutImage?: MediaRef | number | null
}

interface ServicesSectionProps {
  leftGroup?: LeftGroup | null
  rightGroup?: RightGroup | null
}

function resolveMedia(ref: MediaRef | number | null | undefined): MediaRef | null {
  return typeof ref === 'object' && ref !== null ? (ref as MediaRef) : null
}

export function ServicesSection({ leftGroup, rightGroup }: ServicesSectionProps) {
  if (!leftGroup && !rightGroup) return null

  const heroImage = resolveMedia(rightGroup?.image)
  const qrImage = resolveMedia(rightGroup?.qrCodeImage)
  const calloutImage = resolveMedia(rightGroup?.calloutImage)

  return (
    <section id="services-section" className="flex flex-col md:flex-row">

      {/* Left — full-bleed bg, content aligned to page right-edge of this column */}
      <div
        className="bg-surface-light w-full md:w-[40%]"
      >
        <div
          className="w-full py-16 pr-8"
          style={{ paddingLeft: 'max(2rem, calc((100vw - 72rem) / 2 + 1.5rem))' }}
        >
          {leftGroup?.leftTitle && (
            <h2 className="font-sans font-bold text-2xl text-brand-blue mb-8 leading-tight text-center max-w-[270px] mx-auto">
              {leftGroup.leftTitle}
            </h2>
          )}
          {leftGroup?.list && leftGroup.list.length > 0 && (
            <ul className="space-y-2">
              {leftGroup.list.map((entry, i) => (
                <li key={i} className="font-sans font-bold text-brand-navy flex items-start gap-2">
                  <span className="text-brand-orange flex-shrink-0 text-lg leading-snug">•</span>
                  {entry.item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Right — white bg */}
      <div className="bg-white w-full md:w-[60%] flex flex-col">

        {/* Image — full bleed to right edge */}
        {heroImage?.url && (
          <div className="w-full overflow-hidden h-[225px]">
            <Image
              src={heroImage.url}
              alt={heroImage.alt ?? ''}
              width={900}
              height={225}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Lower content — aligned to page right margin */}
        <div
          className="pl-8 pt-8 pb-16 flex flex-col gap-6"
          style={{ paddingRight: 'max(2rem, calc((100vw - 72rem) / 2 + 1.5rem))' }}
        >

          <div className="flex gap-4 items-start">
            <div className="flex-1 flex flex-col items-center gap-4">
              {rightGroup?.title && (
                <p className="font-sans italic font-semibold text-brand-blue text-lg text-center leading-relaxed max-w-[80%]">
                  {rightGroup.title}
                </p>
              )}
              {rightGroup?.ctaLabel && (
                <a
                  href={rightGroup.ctaLink ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-brand-orange text-white rounded-full px-10 py-3 font-sans font-semibold uppercase tracking-wide hover:opacity-90 transition-opacity"
                >
                  {rightGroup.ctaLabel}
                </a>
              )}
              {qrImage?.url && (
                <Image
                  src={qrImage.url}
                  alt="QR code"
                  width={100}
                  height={100}
                  className="object-contain"
                />
              )}
            </div>

            {calloutImage?.url && (
              <div className="flex-shrink-0 relative overflow-hidden" style={{ width: '385px', height: '385px' }}>
                <Image
                  src={calloutImage.url}
                  alt={calloutImage.alt ?? ''}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>

    </section>
  )
}
