import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'

interface MediaRef {
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
}

interface FooterLink {
  title?: string | null
  ctaLabel?: string | null
  ctaUrl?: string | null
  ctaMedia?: MediaRef | number | null
}

interface CampaignFooterProps {
  footerImage?: MediaRef | number | null
  footerMiddle?: Record<string, unknown> | null
  footerLinks?: FooterLink[] | null
  footerBackgroundImage?: MediaRef | number | null
  ctaLabel?: string | null
  ctaLink?: string | null
  qrCode?: MediaRef | number | null
}

function resolveMedia(field: MediaRef | number | null | undefined): MediaRef | null {
  if (!field || typeof field === 'number') return null
  return field
}

export function CampaignFooter({
  footerImage,
  footerMiddle,
  footerLinks,
  footerBackgroundImage,
  ctaLabel,
  ctaLink,
  qrCode,
}: CampaignFooterProps) {
  const img = resolveMedia(footerImage)
  const bgImg = resolveMedia(footerBackgroundImage)
  const qr = resolveMedia(qrCode)

  return (
    <footer className="relative overflow-hidden min-h-[730px]">

      {/* Background wave image — absolute, bottom-left, behind content */}
      {bgImg?.url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={bgImg.url}
          alt=""
          aria-hidden="true"
          className="absolute bottom-0 left-0 z-[5] h-auto"
          style={{ width: '100%', minWidth: 768 }}
        />
      )}

      {/* Right column background — full height, bleeds to right viewport edge.
           left = container left-margin + 2 column-widths + 2 gaps
           container = min(100%, 72rem), gap = 2.5rem each */}
      <div
        className="absolute top-0 bottom-0 z-[3] bg-surface-light hidden md:block"
        style={{ left: 'calc(max(0px, (100% - 72rem) / 2) + (min(100%, 72rem) - 5rem) * 2 / 3 + 5rem)', right: 0 }}
      />

      {/* Main three-column content */}
      <div className="relative max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">

          {/* Left: photo — z-0, sits behind the wave; hidden on mobile */}
          <div className="relative z-0 flex-col items-start hidden md:flex">
            {img?.url && (
              <div className="relative w-full aspect-[3/4] overflow-hidden shadow-lg">
                <Image
                  src={img.url}
                  alt={img.alt ?? ''}
                  fill
                  className="object-cover object-top"
                />
              </div>
            )}
          </div>

          {/* Middle: rich text — z-10, above wave */}
          {footerMiddle && (
            <div className="relative z-10 px-4 md:px-0 font-sans text-text-dark leading-relaxed [&_h1]:font-sans [&_h1]:text-[24px] [&_h1]:text-brand-blue [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:font-sans [&_h2]:text-[24px] [&_h2]:text-brand-blue [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:font-sans [&_h3]:text-[24px] [&_h3]:text-brand-blue [&_h3]:font-bold [&_h3]:mb-2 [&_h4]:font-sans [&_h4]:text-[24px] [&_h4]:text-brand-blue [&_h4]:font-bold [&_h4]:mb-2 [&_p]:text-base [&_p]:mb-3 [&_p_strong]:font-semibold [&_p_strong]:text-brand-sky [&_p_b]:font-semibold [&_p_b]:text-brand-sky [&_a]:text-brand-blue [&_a]:underline [&_a:hover]:text-brand-orange">
              <RichText data={footerMiddle as never} />
            </div>
          )}

          {/* Right: footer links — z-10, above wave */}
          {footerLinks && footerLinks.length > 0 && (
            <div className="relative z-10 flex flex-col items-center md:items-start gap-[3rem] md:pt-[4rem] md:pl-[4rem]">
              {footerLinks.map((link, i) => {
                const media = resolveMedia(link.ctaMedia as MediaRef | number | null | undefined)
                const href = media?.url ?? link.ctaUrl ?? '#'
                const isDownload = !!media?.url

                return (
                  <div key={i} className="flex flex-col items-center gap-2">
                    {link.title && (
                      <p className="font-sans text-base font-semibold text-brand-blue text-center">
                        {link.title}
                      </p>
                    )}
                    {link.ctaLabel && (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        {...(isDownload ? { download: true } : {})}
                        className="inline-block bg-[#1a2f5a] text-white rounded-full px-8 py-2.5 font-sans font-bold text-sm uppercase tracking-wider hover:bg-brand-blue transition-colors text-center"
                      >
                        {link.ctaLabel}
                      </a>
                    )}
                  </div>
                )
              })}
            </div>
          )}

        </div>
      </div>

      {/* Bottom CTA — centered, on top of wave */}
      {(qr?.url || ctaLabel) && (
        <div className="absolute bottom-8 left-0 right-0 z-10 hidden md:flex flex-col items-center gap-4">
          {qr?.url && (
            <Image
              src={qr.url}
              alt={qr.alt ?? 'QR code'}
              width={120}
              height={120}
              className="object-contain"
            />
          )}
          {ctaLabel && ctaLink && (
            <a
              href={ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-brand-orange text-white rounded-full px-8 py-3 font-sans font-semibold uppercase tracking-wide hover:bg-orange-600 transition-colors text-center"
            >
              {ctaLabel}
            </a>
          )}
        </div>
      )}

      {/* Copyright */}
      <div className="absolute bottom-2 right-4 z-10 text-[12px] font-sans text-white/70 text-right">
        <p>© 2026 Fountain Hill Center</p>
        <p>Created by <a href="mailto:joe.royston@gmail.com" className="no-underline text-inherit hover:text-inherit">joe.royston@gmail.com</a></p>
      </div>

    </footer>
  )
}
