import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { CampaignProgressBar } from './CampaignProgressBar'
import type { ProgressData } from '@/lib/givebutter'

interface MediaRef {
  url?: string | null
}

interface SiteSettings {
  logoDark?: { url?: string | null; alt?: string | null } | null
}

interface CampaignPage {
  heroImage?: MediaRef | null
  heroHeadline?: string | null
  heroSubheadline?: Record<string, unknown> | null
  heroCTALabel?: string | null
}

interface CampaignHeroProps {
  page: CampaignPage
  progress: ProgressData
  donateUrl: string
  siteSettings: SiteSettings
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

export function CampaignHero({ page, progress, donateUrl, siteSettings }: CampaignHeroProps) {
  const bgStyle = page.heroImage?.url
    ? { backgroundImage: `url(${page.heroImage.url})` }
    : { backgroundColor: '#4BC8E8' }

  return (
    <section className="relative bg-white overflow-hidden">

      {/* ── Hero photo band ─────────────────────────────────────── */}
      <div
        className="relative w-full bg-cover bg-center overflow-hidden"
        style={{ ...bgStyle, height: '58vh', minHeight: '420px' }}
      >
        {/* Sky-blue organic panel – right side */}
        <div
          className="absolute top-0 right-0 h-full bg-brand-sky"
          style={{
            width: '38%',
            borderTopLeftRadius: '18% 22%',
            borderBottomLeftRadius: '60% 50%',
          }}
        >
          {/* Logo + "capital campaign" label */}
          <div className="flex flex-col items-center pt-5 px-6">
            {siteSettings.logoDark?.url ? (
              <Image
                src={siteSettings.logoDark.url}
                alt={siteSettings.logoDark.alt ?? 'Fountain Hill Center'}
                width={80}
                height={80}
                className="w-16 h-16 object-contain"
                priority
              />
            ) : (
              <span className="text-white font-serif font-bold text-sm text-center leading-tight">
                Fountain Hill<br />Center
              </span>
            )}
            <span className="text-white font-sans text-xs uppercase tracking-widest text-center mt-1 leading-tight">
              capital<br />campaign
            </span>
          </div>
        </div>

        {/* White wave at bottom */}
        <div className="absolute bottom-0 left-0 right-0 leading-none pointer-events-none">
          <svg
            viewBox="0 0 1440 160"
            preserveAspectRatio="none"
            className="w-full"
            style={{ height: '140px', display: 'block' }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,160 L0,80 C180,15 360,110 540,70 C720,30 900,95 1080,72 C1200,58 1320,95 1440,95 L1440,160 Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      {/* ── Below-wave content – pulled up into the wave area ─── */}
      <div className="relative z-10 bg-white -mt-20">
        <div className="max-w-6xl mx-auto px-4 md:px-8">

          {/* "Heart of the Hill:" logotype */}
          <div className="pt-0 pb-8">
            <h2 className="font-serif leading-none">
              <span className="text-5xl md:text-6xl lg:text-7xl font-bold text-brand-navy">Heart</span>
              <span className="text-4xl md:text-5xl lg:text-6xl font-normal italic text-brand-sky"> of the </span>
              <span className="text-5xl md:text-6xl lg:text-7xl font-bold text-brand-navy">Hill:</span>
            </h2>
            <div className="mt-4">
              <span className="inline-block bg-brand-orange text-white font-sans text-sm font-semibold px-5 py-1.5 rounded-full">
                A Capital Campaign for Fountain Hill Center
              </span>
            </div>
          </div>

          {/* HEALING headline + progress bar */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 pb-16">
            {/* Left – headline */}
            <div className="flex-1">
              {page.heroHeadline && (
                <div className="flex items-start gap-4 mb-4">
                  <div className="mt-1 flex-shrink-0">
                    <ArrowRight />
                  </div>
                  <h1 className="font-sans leading-none">
                    {(() => {
                      const lower = page.heroHeadline.toLowerCase()
                      const takesIdx = lower.indexOf('takes')
                      if (takesIdx === -1) {
                        return (
                          <span className="block font-extrabold uppercase text-4xl md:text-5xl lg:text-6xl text-brand-orange">
                            {page.heroHeadline}
                          </span>
                        )
                      }
                      const before = page.heroHeadline.slice(0, takesIdx).trim()
                      const after = page.heroHeadline.slice(takesIdx + 5).trim()
                      return (
                        <>
                          {before && (
                            <span className="block font-extrabold uppercase text-4xl md:text-5xl lg:text-6xl text-brand-orange">
                              {before}
                            </span>
                          )}
                          <span className="block font-normal text-lg md:text-xl text-text-muted text-center italic">
                            takes
                          </span>
                          {after && (
                            <span className="block font-extrabold uppercase text-4xl md:text-5xl lg:text-6xl text-brand-orange">
                              {after}
                            </span>
                          )}
                        </>
                      )
                    })()}
                  </h1>
                </div>
              )}
              {page.heroSubheadline && (
                <div className="text-text-dark font-sans text-base md:text-lg leading-relaxed max-w-lg mt-4">
                  <RichText data={page.heroSubheadline as never} />
                </div>
              )}
            </div>

            {/* Right – progress */}
            <div className="w-full md:w-80 lg:w-96 flex-shrink-0">
              <CampaignProgressBar
                progress={progress}
                donateUrl={donateUrl}
                ctaLabel={page.heroCTALabel ?? 'Donate Here'}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
