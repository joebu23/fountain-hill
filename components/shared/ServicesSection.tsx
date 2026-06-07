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
    // Mobile: flex-col stacks in DOM order (hero → left → right-lower)
    // Desktop lg+: CSS grid with explicit placement restores two-column layout
    <section
      id="services-section"
      className="flex flex-col lg:grid lg:grid-cols-[40%_60%] lg:grid-rows-[auto_1fr]"
    >

      {/* 1. Hero image — mobile: first; desktop: top of right column */}
      {heroImage?.url && (
        <div className="w-full overflow-hidden h-[225px] lg:col-start-2 lg:row-start-1">
          <Image
            src={heroImage.url}
            alt={heroImage.alt ?? ''}
            width={900}
            height={225}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* 2 & 3. Left column (title + list) — mobile: second; desktop: full-height left column */}
      <div
        className="bg-surface-light lg:col-start-1 lg:row-start-1 lg:row-span-2"
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
            <ul className="grid grid-cols-2 gap-2 lg:grid-cols-1">
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

      {/* 4. Right lower content — mobile: last; desktop: bottom of right column */}
      <div className="bg-white lg:col-start-2 lg:row-start-2">
        <div
          className="pl-8 pt-8 pb-16 flex flex-col gap-6"
          style={{ paddingRight: 'max(2rem, calc((100vw - 72rem) / 2 + 1.5rem))' }}
        >
          <div className="flex flex-col min-[600px]:flex-row gap-4 items-start">
            {/* Callout image — first on mobile, second on wider screens */}
            {calloutImage?.url && (
              <div className="order-1 min-[600px]:order-2 flex-shrink-0 relative overflow-hidden aspect-square w-full max-w-[385px]">
                <Image
                  src={calloutImage.url}
                  alt={calloutImage.alt ?? ''}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Title / CTA / QR — second on mobile, first on wider screens */}
            <div className="order-2 min-[600px]:order-1 flex-1 flex flex-col items-center gap-4">
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
          </div>
        </div>
      </div>

    </section>
  )
}
