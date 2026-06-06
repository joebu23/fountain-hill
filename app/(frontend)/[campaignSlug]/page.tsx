import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { ComingSoon } from '@/components/campaign/ComingSoon'
import { Footer } from '@/components/layout/Footer'
import { CampaignHero } from '@/components/campaign/CampaignHero'
import { QuoteDisplay } from '@/components/shared/QuoteDisplay'
import { IconDisplay } from '@/components/shared/IconDisplay'
import { ServicesSection } from '@/components/shared/ServicesSection'
import { ImpactOverview } from '@/components/shared/ImpactOverview'
import { ImpactComparison } from '@/components/shared/ImpactComparison'
import { CampaignBudgetBreakdown } from '@/components/campaign/CampaignBudgetBreakdown'
import { ProjectCardGrid } from '@/components/shared/ProjectCardGrid'
import { FAQAccordion } from '@/components/shared/FAQAccordion'
import { ClosingCTA } from '@/components/shared/ClosingCTA'
import { ResourceLinks } from '@/components/shared/ResourceLinks'
import { StickyDonateCTA } from '@/components/shared/StickyDonateCTA'
import { getProgressWithFallback } from '@/lib/givebutter'

export const revalidate = 300

type Params = { campaignSlug: string }

export default async function CampaignPage({ params }: { params: Promise<Params> }) {
  const { campaignSlug } = await params
  const payload = await getPayload({ config })

  const campaignSettings = await payload.findGlobal({ slug: 'campaign-settings' })

  if (campaignSlug !== campaignSettings.campaignSlug) {
    notFound()
  }

  if (!campaignSettings.isLive) {
    return <ComingSoon />
  }

  const [campaignPage, siteSettings] = await Promise.all([
    payload.findGlobal({ slug: 'campaign-page' }),
    payload.findGlobal({ slug: 'site-settings' }),
  ])

  const progress = await getProgressWithFallback(
    campaignSettings.givebutterCampaignId ?? '',
    {
      amount: campaignSettings.fallbackAmountRaised ?? 0,
      goal: campaignSettings.campaignGoal ?? 1000000,
      lastUpdated: campaignSettings.fallbackLastUpdated
        ? String(campaignSettings.fallbackLastUpdated)
        : null,
    },
  )

  const donateUrl = campaignSettings.donateUrl ?? '#'

  return (
    <>
      <main>
        <CampaignHero page={campaignPage} progress={progress} donateUrl={donateUrl} pillars={campaignPage.pillars ?? []} />
        <QuoteDisplay
          title={campaignPage.quoteDisplay?.title}
          body={campaignPage.quoteDisplay?.body}
          image={campaignPage.quoteDisplay?.image}
        />
        <IconDisplay
          title={campaignPage.iconDisplay?.title}
          items={campaignPage.iconDisplay?.items}
        />
<ServicesSection
          leftGroup={campaignPage.servicesSection?.leftGroup}
          rightGroup={campaignPage.servicesSection?.rightGroup}
        />
        <ImpactOverview
          titleImage={campaignPage.impactOverview?.titleImage}
          quoteIcon={campaignPage.impactOverview?.quoteIcon}
          quote={campaignPage.impactOverview?.quote}
          quoteAttribution={campaignPage.impactOverview?.quoteAttribution}
          title={campaignPage.impactOverview?.title}
          headerIcon={campaignPage.impactOverview?.headerIcon}
          impactItems={campaignPage.impactOverview?.impactItems}
        />
        <ImpactComparison page={campaignPage} />
        <CampaignBudgetBreakdown
          page={campaignPage}
          goalAmount={campaignSettings.campaignGoal ?? 1000000}
          donateUrl={donateUrl}
        />
        <ProjectCardGrid
          heading={campaignPage.projectsHeading ?? ''}
          projects={campaignPage.projects ?? []}
        />
        <FAQAccordion
          heading={campaignPage.faqHeading ?? ''}
          subheading={campaignPage.faqSubheading ?? undefined}
          items={campaignPage.faqItems ?? []}
        />
        <ClosingCTA page={campaignPage} donateUrl={donateUrl} />
        <ResourceLinks page={campaignPage} siteSettings={siteSettings} />
        <StickyDonateCTA donateUrl={donateUrl} />
      </main>
      <Footer siteSettings={siteSettings} donateUrl={donateUrl} />
    </>
  )
}
