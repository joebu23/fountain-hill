import Image from 'next/image'
import { CampaignProgressBar } from './CampaignProgressBar'
import { CampaignLogotype } from './CampaignLogotype'
import { CampaignTitleBlock } from './CampaignTitleBlock'
import { PillarGrid } from '@/components/shared/PillarGrid'
import type { ProgressData } from '@/lib/givebutter'

interface MediaRef {
  url?: string | null
  alt?: string | null
}

interface Pillar {
  icon?: MediaRef | null
  label: string
  description: string
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
  pillars: Pillar[]
}


export function CampaignHero({ page, progress, donateUrl, pillars }: CampaignHeroProps) {
  const bgStyle = page.heroImage?.url
    ? { backgroundImage: `url(${page.heroImage.url})` }
    : { backgroundColor: '#4BC8E8' }

  return (
    <section className="relative bg-white overflow-hidden">

      {/* ── Hero photo band ─────────────────────────────────────── */}
      <div
        className="relative w-full bg-cover bg-center overflow-hidden h-[700px]"
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-bottom-curve.png"
            alt=""
            aria-hidden="true"
            className="block h-auto"
            style={{ width: '100%', minWidth: 768 }}
          />
        </div>

      </div>

      {/* ── Below-wave content ─────────────────────────────────── */}
      <div className="relative z-10 bg-white">

        {/* Title wrapper parent */}
        <div id="title-wrapper-parent" className="relative max-w-6xl mx-auto h-[125px] px-4 md:px-8 mt-0 mb-12">
          <CampaignLogotype />
        </div>

        {/* HEALING headline + pillars (left) | progress bar (right) */}
        <div className="max-w-6xl mx-auto px-4 md:px-8 min-[1441px]:-mt-[100px]">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 pb-12">
            {/* Left – headline then pillars pushed to bottom */}
            <div className="flex-1 flex flex-col">
              <CampaignTitleBlock
                headline={page.heroHeadline}
                subheadline={page.heroSubheadline}
              />
              <div className="mt-auto pt-8">
                <PillarGrid pillars={pillars} />
              </div>
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
