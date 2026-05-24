import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { CampaignProgressBar } from './CampaignProgressBar'
import { CampaignLogotype } from './CampaignLogotype'
import type { ProgressData } from '@/lib/givebutter'

interface MediaRef {
  url?: string | null
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

export function CampaignHero({ page, progress, donateUrl }: CampaignHeroProps) {
  const bgStyle = page.heroImage?.url
    ? { backgroundImage: `url(${page.heroImage.url})` }
    : { backgroundColor: '#4BC8E8' }

  return (
    <section className="relative bg-white overflow-hidden">

      {/* ── Hero photo band ─────────────────────────────────────── */}
      <div
        className="relative w-full bg-cover bg-center overflow-hidden h-[600px] md:h-[600px] lg:h-[650px] xl:h-[825px] 2xl:h-[975px]"
        style={bgStyle}
      >
          {/* Campaign badge – top right */}
        <div
          className="absolute top-0 bg-brand-sky flex flex-col items-start pt-9 pb-5 px-[17px]"
          style={{ width: '129px', right: '7.7%' }}
        >
          <Image
            src="/fhc-logo-white.png"
            alt="Fountain Hill Center"
            width={95}
            height={58}
            className="w-full h-auto"
          />
          <div className="mt-[65px] font-sans font-bold text-[15px] text-white text-left leading-snug">
            capital<br />campaign
          </div>
        </div>

        {/* Bottom curve overlay – pinned to very bottom of hero photo */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <Image
            src="/hero-bottom-curve.png"
            alt=""
            width={1024}
            height={370}
            className="w-full h-auto block"
            priority
          />
        </div>

      </div>

      {/* ── Below-wave content ─────────────────────────────────── */}
      <div className="relative z-10 bg-white">

        {/* Title wrapper parent */}
        <div id="title-wrapper-parent" className="relative max-w-6xl mx-auto h-[125px] px-4 md:px-8 mt-0 mb-12">
          <CampaignLogotype />
        </div>

        {/* HEALING headline + progress bar */}
        <div className="max-w-6xl mx-auto px-4 md:px-8">
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
