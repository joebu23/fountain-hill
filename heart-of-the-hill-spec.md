# Heart of the Hill — Capital Campaign Site
## Implementation Specification for Claude Code
### Version 2 — Hardened, no assumptions

---

## 1. Project Overview

A standalone capital campaign microsite for **Fountain Hill Center**, a Grand Rapids MI nonprofit mental health collective. The site lives at a subdomain (e.g. `campaign.fountainhillcenter.org`) with the campaign page at a CMS-controlled slug (default: `/campaign`). Built with Next.js 14 App Router, Payload CMS v3, and MongoDB Atlas.

This is Phase 1. The component architecture is intentionally designed to expand into the full `fountainhillcenter.org` replacement in Phase 2.

### Goals
- Match the "Heart of the Hill" Canva mockup pixel-accurately
- All content editable via Payload CMS admin — no hardcoded copy anywhere
- Live Givebutter fundraising progress with CMS-controlled fallback
- Component architecture designed for full site reuse
- Docker + Nginx deployment on Joe's self-hosted server
- GitHub Actions CI/CD stub wired but not activated

### Note on Payload CMS
Payload was acquired by Figma in June 2025. The MIT license is unchanged, self-hosting works exactly as before, and the team is actively shipping new features. Payload Cloud (managed hosting) paused new signups — irrelevant here since we are self-hosting on Docker. No change to the build plan is needed. This note exists so the team isn't surprised if they read about it.

---

## 2. Tech Stack

| Layer | Technology | Package |
|---|---|---|
| Framework | Next.js 14 (App Router) | `next` |
| CMS | Payload CMS v3 | `payload` |
| Payload/Next integration | Payload Next.js plugin | `@payloadcms/next` |
| Database adapter | MongoDB via Mongoose | `@payloadcms/db-mongodb` |
| Rich text editor | Payload Lexical | `@payloadcms/richtext-lexical` |
| Styling | Tailwind CSS v3 | `tailwindcss` |
| Fonts | Google Fonts via next/font | `next/font/google` |
| QR codes | Server-side generation | `qrcode` |
| Deployment | Docker + Nginx | — |
| CI/CD | GitHub Actions (stub only) | — |
| Fundraising API | Givebutter API v1 | fetch (no SDK) |
| Database host | MongoDB Atlas | external service |

---

## 3. Design System

### 3.1 Colors

Define these as custom Tailwind colors in `tailwind.config.ts`:

```typescript
// tailwind.config.ts
extend: {
  colors: {
    'brand-blue':    '#2B6CB0',  // Primary — headers, section BGs, nav, large text
    'brand-orange':  '#E8723A',  // Accent — CTAs, stat callouts, icons, progress bar
    'surface-light': '#EBF4FB',  // Alternating section backgrounds
    'text-dark':     '#1A202C',  // Body text
    'text-muted':    '#718096',  // Secondary text, captions
  }
}
```

### 3.2 Typography

Load both fonts via `next/font/google` in the root layout and expose them as CSS variables:

```typescript
// app/(frontend)/layout.tsx
import { Playfair_Display, Inter } from 'next/font/google'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})
```

Wire into Tailwind:

```typescript
// tailwind.config.ts
extend: {
  fontFamily: {
    serif: ['var(--font-playfair)', 'Georgia', 'serif'],
    sans:  ['var(--font-inter)', 'system-ui', 'sans-serif'],
  }
}
```

Apply both variables to the `<html>` tag: `<html className={`${playfair.variable} ${inter.variable}`}>`.

| Role | Font | Tailwind class |
|---|---|---|
| Display / Hero headlines | Playfair Display | `font-serif` |
| All other text | Inter | `font-sans` (default) |
| Stat numbers | Inter ExtraBold | `font-sans font-extrabold` |
| Section eyebrows | Inter, all-caps, tracked | `font-sans uppercase tracking-widest text-sm` |

### 3.3 Spacing

Primary section padding: `py-16 md:py-24`
Container: `max-w-6xl mx-auto px-4 md:px-8`

### 3.4 Button Styles

```
Primary CTA (orange):
  bg-brand-orange text-white rounded-full px-8 py-3 font-semibold uppercase tracking-wide
  hover:bg-orange-600 transition-colors

Secondary CTA (blue outline):
  border-2 border-brand-blue text-brand-blue rounded-full px-8 py-3 font-semibold uppercase tracking-wide
  hover:bg-brand-blue hover:text-white transition-colors

Ghost / text link:
  text-brand-orange underline-offset-4 hover:underline font-medium
```

---

## 4. Repository Structure

```
/
├── app/
│   ├── (frontend)/
│   │   ├── layout.tsx              # Root layout: fonts, globals.css, HTML shell
│   │   └── [campaignSlug]/
│   │       └── page.tsx            # Campaign page — dynamic route
│   └── (payload)/
│       ├── admin/
│       │   └── [[...segments]]/
│       │       └── page.tsx        # Payload admin UI catch-all
│       └── api/
│           └── [...slug]/
│               └── route.ts        # Payload REST + GraphQL API catch-all
│
├── components/
│   ├── layout/
│   │   ├── PageHeader.tsx          # Accepts variant prop: 'campaign' | 'full'
│   │   └── Footer.tsx
│   ├── campaign/                   # Campaign-specific, not reused elsewhere
│   │   ├── CampaignHero.tsx
│   │   ├── CampaignProgressBar.tsx
│   │   └── CampaignBudgetBreakdown.tsx
│   └── shared/                     # Reusable across all future pages
│       ├── PillarGrid.tsx
│       ├── MissionStatement.tsx
│       ├── StatGrid.tsx
│       ├── ServiceListWithCallout.tsx
│       ├── ImpactComparison.tsx
│       ├── Testimonial.tsx
│       ├── EndorsementQuote.tsx
│       ├── ProjectCardGrid.tsx
│       ├── FAQAccordion.tsx
│       ├── ClosingCTA.tsx
│       ├── ResourceLinks.tsx
│       └── StickyDonateCTA.tsx
│
├── payload/
│   ├── collections/
│   │   ├── Media.ts
│   │   ├── Testimonials.ts
│   │   ├── FAQItems.ts
│   │   └── ProjectComponents.ts
│   └── globals/
│       ├── CampaignSettings.ts
│       ├── CampaignPage.ts
│       └── SiteSettings.ts
│
├── lib/
│   ├── givebutter.ts               # Givebutter API client + fallback logic
│   └── payload.ts                  # Payload local API helpers
│
├── public/
│   └── placeholders/
│       └── .gitkeep
│
├── docker/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── nginx.conf
│
├── .github/
│   └── workflows/
│       └── deploy.yml              # CI/CD stub — not active
│
├── payload.config.ts               # Root-level Payload config (required by Payload v3)
├── payload-types.ts                # Auto-generated by Payload — do not edit manually
├── .env.example
├── .env                            # Never committed — add to .gitignore
├── next.config.ts
└── tailwind.config.ts
```

---

## 5. Payload Configuration

### 5.1 `payload.config.ts` (root level)

```typescript
import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { Media } from './payload/collections/Media'
import { Testimonials } from './payload/collections/Testimonials'
import { FAQItems } from './payload/collections/FAQItems'
import { ProjectComponents } from './payload/collections/ProjectComponents'
import { CampaignSettings } from './payload/globals/CampaignSettings'
import { CampaignPage } from './payload/globals/CampaignPage'
import { SiteSettings } from './payload/globals/SiteSettings'

export default buildConfig({
  admin: {
    user: 'users',
  },
  collections: [Media, Testimonials, FAQItems, ProjectComponents],
  globals: [CampaignSettings, CampaignPage, SiteSettings],
  editor: lexicalEditor({}),
  db: mongooseAdapter({
    url: process.env.DATABASE_URI as string,
  }),
  secret: process.env.PAYLOAD_SECRET as string,
  typescript: {
    outputFile: './payload-types.ts',
  },
})
```

### 5.2 `next.config.ts`

`withPayload` is required. Without it the build fails.

```typescript
import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_SITE_URL?.replace('https://', '') ?? '',
      },
    ],
  },
}

export default withPayload(nextConfig)
```

---

## 6. Data Models

### Global: `CampaignSettings`

```typescript
// payload/globals/CampaignSettings.ts
import type { GlobalConfig } from 'payload'

export const CampaignSettings: GlobalConfig = {
  slug: 'campaign-settings',
  label: 'Campaign Settings',
  fields: [
    {
      name: 'campaignSlug',
      type: 'text',
      required: true,
      defaultValue: 'campaign',
      admin: {
        description: 'URL path for the campaign page. Example: "campaign" renders at /campaign. Change with caution — this changes the live URL.',
      },
    },
    {
      name: 'campaignGoal',
      type: 'number',
      required: true,
      defaultValue: 1000000,
      admin: { description: 'Total campaign goal in dollars. Used for progress bar math.' },
    },
    {
      name: 'givebutterCampaignId',
      type: 'text',
      required: true,
      admin: { description: 'Givebutter campaign ID or slug. Found in the Givebutter dashboard URL.' },
    },
    {
      name: 'donateUrl',
      type: 'text',
      required: true,
      admin: { description: 'Full Givebutter donate URL. Example: https://givebutter.com/XXXXXX' },
    },
    {
      name: 'fallbackAmountRaised',
      type: 'number',
      required: true,
      defaultValue: 0,
      admin: { description: 'Amount raised to display if the Givebutter API is unavailable. Update this manually as a backup.' },
    },
    {
      name: 'fallbackLastUpdated',
      type: 'date',
      admin: { description: 'Date the fallback amount was last manually updated. Shown to visitors when fallback data is active.' },
    },
    {
      name: 'isLive',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'When unchecked, the campaign page shows a Coming Soon message. Check this when ready to launch.' },
    },
  ],
}
```

### Global: `SiteSettings`

```typescript
// payload/globals/SiteSettings.ts
import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  fields: [
    {
      name: 'orgName',
      type: 'text',
      required: true,
      defaultValue: 'Fountain Hill Center',
    },
    {
      name: 'contactName',
      type: 'text',
      admin: { description: 'Name shown on the campaign contact button. Example: Sara Binkley' },
    },
    {
      name: 'contactEmail',
      type: 'email',
      admin: { description: 'Email address for the campaign contact link.' },
    },
    {
      name: 'contactPhone',
      type: 'text',
    },
    {
      name: 'logoLight',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'White/reversed logo for use on dark backgrounds (header, footer).' },
    },
    {
      name: 'logoDark',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Full-color logo for use on white/light backgrounds.' },
    },
    {
      name: 'emergencyServicesUrl',
      type: 'text',
      defaultValue: 'https://fountainhillcenter.org/emergency-services/',
      admin: { description: 'URL for the Emergency? link in the footer.' },
    },
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        { name: 'facebook', type: 'text' },
        { name: 'instagram', type: 'text' },
        { name: 'twitter', type: 'text' },
      ],
    },
  ],
}
```

### Global: `CampaignPage`

```typescript
// payload/globals/CampaignPage.ts
import type { GlobalConfig } from 'payload'

export const CampaignPage: GlobalConfig = {
  slug: 'campaign-page',
  label: 'Campaign Page Content',
  fields: [

    // ── HERO ──────────────────────────────────────────────────────────────
    { name: 'heroHeadline', type: 'text', defaultValue: 'HEALING takes COURAGE' },
    { name: 'heroSubheadline', type: 'richText' },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'heroCTALabel', type: 'text', defaultValue: 'DONATE HERE' },

    // ── PILLARS ───────────────────────────────────────────────────────────
    {
      name: 'pillars',
      type: 'array',
      maxRows: 3,
      fields: [
        { name: 'icon', type: 'upload', relationTo: 'media' },
        { name: 'label', type: 'text', required: true },
        { name: 'description', type: 'text', required: true },
      ],
    },

    // ── WHO WE ARE ────────────────────────────────────────────────────────
    { name: 'whoWeAreHeading', type: 'text', defaultValue: 'Who We Are' },
    { name: 'whoWeAreBody', type: 'richText' },

    // ── COMMUNITY STATS ───────────────────────────────────────────────────
    { name: 'communityStatsHeading', type: 'text', defaultValue: 'The Need In Our Community' },
    {
      name: 'communityStats',
      type: 'array',
      maxRows: 6,
      fields: [
        { name: 'statValue', type: 'text', admin: { description: 'Example: Nearly 1 in 4 adults' } },
        { name: 'statLabel', type: 'text', admin: { description: 'Example: have been diagnosed with depression.' } },
      ],
    },

    // ── SERVICES ──────────────────────────────────────────────────────────
    { name: 'servicesHeading', type: 'text', defaultValue: 'Who We Help With Our Available Services' },
    {
      name: 'servicesList',
      type: 'array',
      fields: [{ name: 'serviceName', type: 'text', required: true }],
    },
    { name: 'servicesMissionStatement', type: 'richText' },
    { name: 'servicesImage', type: 'upload', relationTo: 'media' },
    { name: 'servicesCTALabel', type: 'text', defaultValue: 'DONATE HERE' },

    // ── IMPACT ────────────────────────────────────────────────────────────
    { name: 'impactHeading', type: 'text', defaultValue: 'Impact at a Glance' },
    {
      name: 'impactMetrics',
      type: 'array',
      maxRows: 4,
      fields: [
        { name: 'currentLabel', type: 'text', admin: { description: 'Example: Currently: 21,000 Sessions' } },
        { name: 'currentDescription', type: 'textarea' },
        { name: 'projectedLabel', type: 'text', admin: { description: 'Example: Your Impact: 3,500 Sessions' } },
        { name: 'projectedDescription', type: 'textarea' },
      ],
    },
    {
      name: 'impactTestimonial',
      type: 'relationship',
      relationTo: 'testimonials',
      admin: { description: 'Pull quote shown in the Impact section.' },
    },

    // ── BUDGET BREAKDOWN ──────────────────────────────────────────────────
    { name: 'budgetHeading', type: 'text', defaultValue: '$1M Campaign Goal' },
    {
      name: 'budgetItems',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'amount', type: 'number', required: true },
      ],
    },
    { name: 'budgetBodyText', type: 'richText' },
    {
      name: 'budgetEndorsement',
      type: 'relationship',
      relationTo: 'testimonials',
      admin: { description: 'Endorsement quote shown alongside the budget. Intended for the Mayor Bliss quote.' },
    },

    // ── PROJECT COMPONENTS ────────────────────────────────────────────────
    { name: 'projectsHeading', type: 'text', defaultValue: 'Project Components' },
    {
      name: 'projects',
      type: 'relationship',
      relationTo: 'project-components',
      hasMany: true,
      admin: { description: 'Select and order the project cards shown on this page.' },
    },

    // ── FAQ ───────────────────────────────────────────────────────────────
    { name: 'faqHeading', type: 'text', defaultValue: 'FAQ' },
    { name: 'faqSubheading', type: 'text', defaultValue: 'Heart of the Hill Capital Campaign' },
    {
      name: 'faqItems',
      type: 'relationship',
      relationTo: 'faq-items',
      hasMany: true,
      admin: { description: 'Select FAQ items. Order is controlled by the Sort Order field on each item.' },
    },

    // ── CLOSING CTA ───────────────────────────────────────────────────────
    { name: 'closingHeading', type: 'text', defaultValue: 'A Personal Invitation' },
    { name: 'closingBody', type: 'richText' },
    { name: 'closingCTALabel', type: 'text', defaultValue: 'DONATE HERE' },

    // ── RESOURCE LINKS ────────────────────────────────────────────────────
    { name: 'resourcesHeading', type: 'text', defaultValue: 'View more details in our Case for Support:' },
    { name: 'caseForSupportPDF', type: 'upload', relationTo: 'media' },
    { name: 'caseForSupportLabel', type: 'text', defaultValue: 'DOWNLOAD PDF HERE' },
    { name: 'historyPDF', type: 'upload', relationTo: 'media' },
    { name: 'historyPDFLabel', type: 'text', defaultValue: 'DOWNLOAD PDF HERE' },
  ],
}
```

### Collection: `Testimonials`

```typescript
// payload/collections/Testimonials.ts
import type { CollectionConfig } from 'payload'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: { useAsTitle: 'attribution' },
  fields: [
    { name: 'quote', type: 'richText', required: true },
    {
      name: 'attribution',
      type: 'text',
      required: true,
      admin: { description: 'Example: Anonymous Client' },
    },
    {
      name: 'attributionTitle',
      type: 'text',
      admin: { description: 'Example: Former Grand Rapids Mayor' },
    },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    { name: 'featured', type: 'checkbox', defaultValue: false },
  ],
}
```

### Collection: `FAQItems`

```typescript
// payload/collections/FAQItems.ts
import type { CollectionConfig } from 'payload'

export const FAQItems: CollectionConfig = {
  slug: 'faq-items',
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'sortOrder'],
  },
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'richText', required: true },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Lower numbers appear first in the FAQ list.' },
    },
  ],
}
```

### Collection: `ProjectComponents`

```typescript
// payload/collections/ProjectComponents.ts
import type { CollectionConfig } from 'payload'

export const ProjectComponents: CollectionConfig = {
  slug: 'project-components',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'budgetAmount', 'sortOrder'],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'icon', type: 'upload', relationTo: 'media' },
    {
      name: 'budgetAmount',
      type: 'number',
      admin: { description: 'Dollar amount allocated to this project component.' },
    },
    { name: 'description', type: 'richText', required: true },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Lower numbers appear first.' },
    },
  ],
}
```

### Collection: `Media`

```typescript
// payload/collections/Media.ts
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'media',
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 800, height: 600, position: 'centre' },
      { name: 'hero', width: 1920, height: 1080, position: 'centre' },
      { name: 'og', width: 1200, height: 630, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail',
  },
  fields: [
    { name: 'alt', type: 'text', required: true },
  ],
}
```

---

## 7. Routing

The campaign slug lives in `CampaignSettings.campaignSlug`. The dynamic route `[campaignSlug]` handles it at runtime.

**Do NOT use `generateStaticParams` for the slug.** If the slug changes in the CMS, a statically generated route would return 404 on the new URL until the next full redeploy. Use `revalidate = 300` with dynamic rendering instead.

```typescript
// app/(frontend)/[campaignSlug]/page.tsx
import { getPayload } from 'payload'
import config from '@/payload.config'
import { notFound } from 'next/navigation'
import { ComingSoon } from '@/components/campaign/ComingSoon'
import { getProgressWithFallback } from '@/lib/givebutter'
// ... other imports

export const revalidate = 300  // 5-minute ISR

export default async function CampaignPage({
  params,
}: {
  params: { campaignSlug: string }
}) {
  const payload = await getPayload({ config })

  const campaignSettings = await payload.findGlobal({ slug: 'campaign-settings' })

  if (params.campaignSlug !== campaignSettings.campaignSlug) {
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
    campaignSettings.givebutterCampaignId,
    {
      amount: campaignSettings.fallbackAmountRaised,
      goal: campaignSettings.campaignGoal,
      lastUpdated: campaignSettings.fallbackLastUpdated,
    }
  )

  return (
    <>
      <PageHeader variant="campaign" siteSettings={siteSettings} donateUrl={campaignSettings.donateUrl} />
      <main>
        <CampaignHero page={campaignPage} progress={progress} donateUrl={campaignSettings.donateUrl} />
        <PillarGrid pillars={campaignPage.pillars} />
        <MissionStatement heading={campaignPage.whoWeAreHeading} body={campaignPage.whoWeAreBody} />
        <StatGrid heading={campaignPage.communityStatsHeading} stats={campaignPage.communityStats} />
        <ServiceListWithCallout page={campaignPage} donateUrl={campaignSettings.donateUrl} />
        <ImpactComparison page={campaignPage} />
        <CampaignBudgetBreakdown page={campaignPage} goalAmount={campaignSettings.campaignGoal} donateUrl={campaignSettings.donateUrl} />
        <ProjectCardGrid heading={campaignPage.projectsHeading} projects={campaignPage.projects} />
        <FAQAccordion heading={campaignPage.faqHeading} subheading={campaignPage.faqSubheading} items={campaignPage.faqItems} />
        <ClosingCTA page={campaignPage} donateUrl={campaignSettings.donateUrl} />
        <ResourceLinks page={campaignPage} siteSettings={siteSettings} />
        <StickyDonateCTA donateUrl={campaignSettings.donateUrl} />
      </main>
      <Footer siteSettings={siteSettings} donateUrl={campaignSettings.donateUrl} />
    </>
  )
}
```

---

## 8. Givebutter Integration

### Confirmed API Details

- Base URL: `https://api.givebutter.com/v1`
- Auth: `Authorization: Bearer {GIVEBUTTER_API_KEY}`
- API key location: Givebutter Dashboard → Settings → Integrations → API Keys
- Single campaign endpoint: `GET /campaigns/{id}`

### Confirmed Response Field Names

The campaign object (confirmed from Givebutter webhook docs and API reference):

```json
{
  "id": 39,
  "code": "ABCDEF",
  "title": "Heart of the Hill",
  "goal": 1000000,
  "raised": 125000,
  "donors": 47,
  "status": "active",
  "url": "https://givebutter.com/ABCDEF",
  "created_at": "2024-02-01T12:09:29+00:00",
  "updated_at": "2024-02-01T12:09:34+00:00"
}
```

**The amount raised field is `raised`. The goal field is `goal`. Not `raised_amount`, not `goal_amount`.**

### `lib/givebutter.ts`

```typescript
const GIVEBUTTER_BASE = 'https://api.givebutter.com/v1'

interface GivebutterCampaign {
  id: number
  raised: number
  goal: number
  donors: number
  status: string
}

export interface ProgressData {
  amountRaised: number
  goal: number
  percentComplete: number
  donors?: number
  source: 'live' | 'fallback'
  asOf?: string | null
}

interface FallbackData {
  amount: number
  goal: number
  lastUpdated?: string | null
}

async function getCampaignProgress(campaignId: string): Promise<GivebutterCampaign | null> {
  const res = await fetch(`${GIVEBUTTER_BASE}/campaigns/${campaignId}`, {
    headers: {
      Authorization: `Bearer ${process.env.GIVEBUTTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 300 },
  })

  if (!res.ok) return null

  const json = await res.json()
  // Handle both direct response and data-enveloped response
  return (json.data ?? json) as GivebutterCampaign
}

export async function getProgressWithFallback(
  campaignId: string,
  fallback: FallbackData
): Promise<ProgressData> {
  try {
    const campaign = await getCampaignProgress(campaignId)
    if (campaign) {
      return {
        amountRaised: campaign.raised,
        goal: campaign.goal,
        percentComplete: Math.min((campaign.raised / campaign.goal) * 100, 100),
        donors: campaign.donors,
        source: 'live',
        asOf: null,
      }
    }
  } catch (err) {
    console.error('[Givebutter] API error, using CMS fallback:', err)
  }

  return {
    amountRaised: fallback.amount,
    goal: fallback.goal,
    percentComplete: Math.min((fallback.amount / fallback.goal) * 100, 100),
    source: 'fallback',
    asOf: fallback.lastUpdated ?? null,
  }
}
```

---

## 9. Component Specifications

### `PageHeader`
**Reusable:** Yes — `variant: 'full'` added in Phase 2

```typescript
interface PageHeaderProps {
  variant: 'campaign' | 'full'
  siteSettings: SiteSettings
  donateUrl: string
}
```

- Sticky, `bg-white shadow-sm z-50`
- Left: `logoDark` from siteSettings (Next.js `<Image>`)
- Right: "DONATE HERE" primary CTA → `donateUrl`
- `campaign` variant: no nav links, no hamburger
- Mobile: identical — logo + donate button only

---

### `CampaignHero`
**Reusable:** No

```typescript
interface CampaignHeroProps {
  page: CampaignPage
  progress: ProgressData
  donateUrl: string
}
```

- Full-width, `min-h-[70vh]`, `heroImage` as CSS background (`bg-cover bg-center`)
- Overlay: `bg-gradient-to-r from-black/60 to-black/20`
- Left 60%: "Heart of the Hill" logotype (Playfair Display italic), `heroHeadline`, `heroSubheadline` richtext renderer, `heroCTALabel` primary CTA → `donateUrl`
- Right 40%: `<CampaignProgressBar>`
- Mobile: single column, progress bar below headline

---

### `CampaignProgressBar`
**Reusable:** No

```typescript
interface CampaignProgressBarProps {
  progress: ProgressData
  donateUrl: string
  ctaLabel: string
}
```

- Amount: formatted as `$XXX,XXX` using `toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })`
- Subtext: `of $1,000,000 goal`
- Progress bar: brand-orange fill, `style={{ width: '${progress.percentComplete}%' }}`, CSS `transition-all duration-1000`
- Percentage: `${progress.percentComplete.toFixed(2)}%`
- CTA button → `donateUrl`
- QR code: `await QRCode.toDataURL(donateUrl)` — generate server-side, render as `<img src={dataUrl} alt="Scan to donate" width={120} height={120} />`
- If `progress.source === 'fallback'` AND `progress.asOf` is set: render `<p className="text-xs text-muted">As of {formattedDate}</p>` below the amount

---

### `PillarGrid`
**Reusable:** Yes

```typescript
interface PillarGridProps {
  heading?: string
  pillars: { icon: Media; label: string; description: string }[]
}
```

- Decorative curved SVG wave divider at top of section (brand-blue concave shape)
- 3-column desktop, 1-column mobile
- Each pillar: 64×64px circle (`bg-brand-orange`), icon inside, bold `label` (brand-blue), `description` text

---

### `MissionStatement`
**Reusable:** Yes

```typescript
interface MissionStatementProps {
  heading: string
  body: SerializedEditorState
}
```

- `bg-surface-light`, centered, `max-w-3xl mx-auto`
- Heading: Playfair Display
- Body: Lexical richtext renderer

---

### `StatGrid`
**Reusable:** Yes

```typescript
interface StatGridProps {
  heading: string
  stats: { statValue: string; statLabel: string }[]
}
```

- `bg-surface-light`
- Heading above grid
- Cards: white bg, `statValue` in large brand-orange `font-extrabold`, `statLabel` below in `text-dark`
- 3-col desktop, 1-col mobile

---

### `ServiceListWithCallout`
**Reusable:** Yes

```typescript
interface ServiceListWithCalloutProps {
  heading: string
  services: string[]
  missionStatement: SerializedEditorState
  ctaLabel: string
  ctaUrl: string
  image: Media
}
```

- 2-column: left = heading, `<ul>` of services, richtext mission statement, CTA; right = image with `rounded-2xl overflow-hidden`
- Mobile: stacked

---

### `ImpactComparison`
**Reusable:** Yes

```typescript
interface ImpactComparisonProps {
  heading: string
  metrics: {
    currentLabel: string
    currentDescription: string
    projectedLabel: string
    projectedDescription: string
  }[]
  testimonial?: Testimonial
}
```

- `bg-surface-light`
- Heading
- Grid: "Currently" cards (white bg, brand-blue label text), "Your Impact" cards (`bg-brand-orange`, white text)
- `<Testimonial>` rendered below grid if `testimonial` is provided

---

### `Testimonial`
**Reusable:** Yes

```typescript
interface TestimonialProps {
  quote: SerializedEditorState
  attribution: string
  attributionTitle?: string
  variant?: 'default' | 'large'
}
```

- Decorative open-quote mark (brand-orange, `text-6xl font-serif`)
- Quote text (richtext)
- `— {attribution}` below; `attributionTitle` on second line if present
- `large` variant: bigger quote font for hero pull-quote use

---

### `EndorsementQuote`
**Reusable:** Yes

```typescript
interface EndorsementQuoteProps {
  quote: SerializedEditorState
  attribution: string
  attributionTitle: string
  photo?: Media
}
```

- Same layout as `Testimonial` but attribution is bold name + title on separate line
- Optional circular headshot (48px) beside attribution

---

### `CampaignBudgetBreakdown`
**Reusable:** No

```typescript
interface CampaignBudgetBreakdownProps {
  heading: string
  goalAmount: number
  budgetItems: { label: string; amount: number }[]
  bodyText: SerializedEditorState
  endorsement: Testimonial
  donateUrl: string
}
```

- 2-column layout
- Left: `$1M CAMPAIGN GOAL` (large brand-orange, font-extrabold), vertical budget item list (label + formatted amount + thin brand-orange left-border bar), `bodyText` richtext, "Join Us. Make Your Impact Today." + primary CTA
- Right: `<EndorsementQuote>` (Mayor Bliss)
- Mobile: stacked

---

### `ProjectCardGrid`
**Reusable:** Yes

```typescript
interface ProjectCardGridProps {
  heading: string
  projects: ProjectComponent[]
}
```

- Heading
- 5 cards: 3+2 layout on desktop (`grid-cols-3` then `grid-cols-2`), 2-col tablet, 1-col mobile
- Each card: circular icon (`bg-brand-orange`), `title` (bold), `budgetAmount` formatted as currency if present, `description` richtext
- White card bg, `rounded-2xl shadow-sm`

---

### `FAQAccordion`
**Reusable:** Yes

```typescript
interface FAQAccordionProps {
  heading: string
  subheading?: string
  items: FAQItem[]
}
```

- Heading + optional subheading
- Each row: question (`text-brand-blue font-bold`) + `+` icon. On click: `useState` toggles `isOpen`. Open state renders answer richtext + changes icon to `−`
- Smooth expand: `max-h-0 overflow-hidden` → `max-h-[500px]` with `transition-all duration-300`
- No external accordion library — implement with React `useState`

---

### `ClosingCTA`
**Reusable:** Yes

```typescript
interface ClosingCTAProps {
  heading: string
  body: SerializedEditorState
  ctaLabel: string
  donateUrl: string
}
```

- `bg-brand-blue`, full-width, centered
- Heading: Playfair Display, white
- Body: richtext, white
- CTA: secondary (outlined) style, white border/text → `donateUrl`

---

### `ResourceLinks`
**Reusable:** Yes

```typescript
interface ResourceLinksProps {
  resourcesHeading: string
  caseForSupportPDF?: Media
  caseForSupportLabel: string
  historyPDF?: Media
  historyPDFLabel: string
  contactName: string
  contactEmail: string
}
```

- Heading
- Up to 3 ghost link buttons in a row: Case for Support PDF (opens new tab), History PDF (opens new tab), `EMAIL {contactName}` (mailto link)
- If a PDF field is null/empty in the CMS, that button is hidden — not broken
- `contactName` and `contactEmail` come from `SiteSettings` global

---

### `StickyDonateCTA`
**Reusable:** Yes

This component is a **client component** — must have `'use client'` at top.

```typescript
interface StickyDonateCTAProps {
  donateUrl: string
}
```

- `useEffect` adds a `scroll` listener on mount
- Visible when `window.scrollY > 400`
- Dismiss: click × sets `sessionStorage.setItem('sticky-cta-dismissed', 'true')`; on mount, check this key and if set, never show
- Mobile: `fixed bottom-0 left-0 right-0 z-50`, full-width bar
- Desktop: `fixed right-4 bottom-8 z-50`, pill-shaped button
- `bg-brand-orange text-white`

---

### `Footer`
**Reusable:** Yes

```typescript
interface FooterProps {
  siteSettings: SiteSettings
  donateUrl: string
}
```

- `bg-brand-blue text-white`
- 3-column:
  - Col 1: `logoLight`, org name, `534 Fountain St NE, Grand Rapids, MI 49503`, `contactPhone`
  - Col 2: social links from `siteSettings.socialLinks`, "Donate Today" primary CTA → `donateUrl`
  - Col 3: "Emergency?" link → `siteSettings.emergencyServicesUrl`
- Bottom strip: `Made with 💙 and a lot of ☕️ by the awesome team at Code for Good West Michigan` (hardcoded, matches current site)
- Mobile: single column

---

## 10. Page Assembly

Full rendering order. Every data source is explicit.

```
PageHeader (variant="campaign")
  ↳ siteSettings.logoDark
  ↳ campaignSettings.donateUrl

CampaignHero
  ↳ campaignPage.heroImage
  ↳ campaignPage.heroHeadline
  ↳ campaignPage.heroSubheadline (richtext)
  ↳ campaignPage.heroCTALabel
  ↳ campaignSettings.donateUrl
  └── CampaignProgressBar
      ↳ progress (live Givebutter OR fallback from CampaignSettings)
      ↳ campaignSettings.donateUrl

PillarGrid
  ↳ campaignPage.pillars (array: icon, label, description)

MissionStatement
  ↳ campaignPage.whoWeAreHeading
  ↳ campaignPage.whoWeAreBody (richtext)

StatGrid
  ↳ campaignPage.communityStatsHeading
  ↳ campaignPage.communityStats (array: statValue, statLabel)

ServiceListWithCallout
  ↳ campaignPage.servicesHeading
  ↳ campaignPage.servicesList (array: serviceName)
  ↳ campaignPage.servicesMissionStatement (richtext)
  ↳ campaignPage.servicesImage
  ↳ campaignPage.servicesCTALabel
  ↳ campaignSettings.donateUrl

ImpactComparison
  ↳ campaignPage.impactHeading
  ↳ campaignPage.impactMetrics (array)
  └── Testimonial
      ↳ campaignPage.impactTestimonial → Testimonials collection

CampaignBudgetBreakdown
  ↳ campaignPage.budgetHeading
  ↳ campaignPage.budgetItems (array: label, amount)
  ↳ campaignPage.budgetBodyText (richtext)
  ↳ campaignSettings.campaignGoal
  ↳ campaignSettings.donateUrl
  └── EndorsementQuote
      ↳ campaignPage.budgetEndorsement → Testimonials collection

ProjectCardGrid
  ↳ campaignPage.projectsHeading
  ↳ campaignPage.projects → ProjectComponents collection (hasMany)

FAQAccordion
  ↳ campaignPage.faqHeading
  ↳ campaignPage.faqSubheading
  ↳ campaignPage.faqItems → FAQItems collection (hasMany, sorted by sortOrder)

ClosingCTA
  ↳ campaignPage.closingHeading
  ↳ campaignPage.closingBody (richtext)
  ↳ campaignPage.closingCTALabel
  ↳ campaignSettings.donateUrl

ResourceLinks
  ↳ campaignPage.resourcesHeading
  ↳ campaignPage.caseForSupportPDF → Media
  ↳ campaignPage.caseForSupportLabel
  ↳ campaignPage.historyPDF → Media
  ↳ campaignPage.historyPDFLabel
  ↳ siteSettings.contactName
  ↳ siteSettings.contactEmail

StickyDonateCTA (client component)
  ↳ campaignSettings.donateUrl

Footer
  ↳ siteSettings.logoLight
  ↳ siteSettings.orgName
  ↳ siteSettings.contactPhone
  ↳ siteSettings.socialLinks
  ↳ siteSettings.emergencyServicesUrl
  ↳ campaignSettings.donateUrl
```

---

## 11. Docker Setup

### `docker/docker-compose.yml`

```yaml
version: '3.9'

services:
  app:
    build:
      context: ..
      dockerfile: docker/Dockerfile
    env_file:
      - ../.env
    expose:
      - "3000"
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certs:/etc/nginx/certs:ro
    depends_on:
      - app
    restart: unless-stopped
```

The app uses `expose` not `ports` — only accessible through Nginx, not directly from host network. No local MongoDB container — using Atlas.

### `docker/Dockerfile`

```dockerfile
FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
RUN npm ci

FROM deps AS builder
COPY . .
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Standalone output
COPY --from=builder /app/.next/standalone ./

# Static assets — must be copied separately, NOT included in standalone
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
```

### `docker/nginx.conf`

```nginx
events { worker_connections 1024; }

http {
  upstream app {
    server app:3000;
  }

  server {
    listen 80;
    server_name campaign.fountainhillcenter.org;
    return 301 https://$host$request_uri;
  }

  server {
    listen 443 ssl;
    server_name campaign.fountainhillcenter.org;

    ssl_certificate     /etc/nginx/certs/fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/privkey.pem;

    location / {
      proxy_pass http://app;
      proxy_set_header Host              $host;
      proxy_set_header X-Real-IP         $remote_addr;
      proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
    }
  }
}
```

SSL certs are managed by Certbot on the host server. Mount from `/etc/letsencrypt/live/campaign.fountainhillcenter.org/` into `docker/certs/`.

---

## 12. Environment Variables

```bash
# .env.example

# ── Payload ────────────────────────────────────────────────────────────────
# REQUIRED. Minimum 32 characters. Shorter values cause a startup error.
# Generate with: openssl rand -base64 32
PAYLOAD_SECRET=

# ── MongoDB Atlas ──────────────────────────────────────────────────────────
# Full Atlas connection string including database name
# Format: mongodb+srv://<user>:<password>@<cluster>.mongodb.net/fountain-hill
DATABASE_URI=

# ── Givebutter ─────────────────────────────────────────────────────────────
# API key from: Givebutter Dashboard → Settings → Integrations → API Keys
GIVEBUTTER_API_KEY=

# Campaign ID or slug from the Givebutter dashboard
GIVEBUTTER_CAMPAIGN_ID=

# ── App ────────────────────────────────────────────────────────────────────
# Full URL including protocol — no trailing slash
# Example: https://campaign.fountainhillcenter.org
NEXT_PUBLIC_SITE_URL=
```

---

## 13. GitHub Actions CI/CD Stub

```yaml
# .github/workflows/deploy.yml
# STUB ONLY — not active.
# To activate: add SERVER_HOST, SERVER_USER, SSH_PRIVATE_KEY as GitHub repo secrets.

name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build Docker image
        run: |
          # TODO: configure container registry (GitHub Container Registry recommended)
          # docker build -f docker/Dockerfile -t ghcr.io/ORG/fountain-hill:latest --build-arg NEXT_PUBLIC_SITE_URL=${{ secrets.NEXT_PUBLIC_SITE_URL }} .
          # docker push ghcr.io/ORG/fountain-hill:latest
          echo "STUB: configure registry before activating"

      - name: Deploy via SSH
        run: |
          # TODO: SSH to server, pull new image, run docker-compose up -d
          # Uses secrets: SSH_PRIVATE_KEY, SERVER_HOST, SERVER_USER
          echo "STUB: configure SSH secrets before activating"
```

---

## 14. Content Gaps — Must Resolve Before Launch

The build can proceed with stubs. The page cannot go live without these items.

| # | Item | Status | Who | Action needed |
|---|------|--------|-----|---------------|
| 1 | Givebutter API key | **Pending** | Joe | Givebutter Dashboard → Settings → Integrations → API Keys |
| 2 | Givebutter campaign ID for Heart of the Hill | **Pending** | Joe | Confirm: is this the existing `0AAvc3` campaign or a new dedicated one? |
| 3 | Sara Binkley email address | **Pending** | Client | Enters into `SiteSettings.contactEmail` in Payload admin |
| 4 | "Capital Campaign Costs" card description | **Missing** | Client | Mockup explicitly flagged as needing copy. The $80k line item needs text explaining what it covers (consulting, printing, donor outreach, campaign management, etc.) |
| 5 | FAQ answers | **Missing** | Client | 9 questions exist in mockup. Answers must be written and entered into Payload FAQItems collection |
| 6 | Case for Support PDF | **Missing** | Client | Upload to Payload Media, then select in `CampaignPage.caseForSupportPDF` |
| 7 | History PDF | **Missing** | Client | Upload to Payload Media, then select in `CampaignPage.historyPDF` |
| 8 | Bundy House exterior photo | **Placeholder** | Client | High-res photo of 534 Fountain St NE for hero background |
| 9 | Community/people photography | **Placeholder** | Client | Used in Services and Impact sections |
| 10 | MongoDB Atlas connection string | **Pending** | Joe | Create cluster, whitelist server IP, provide `DATABASE_URI` |
| 11 | SSL certificate | **Pending** | Joe | Certbot on host server for `campaign.fountainhillcenter.org` |

---

## 15. Phase 2 Notes (Full Site Replacement)

Nothing from Phase 1 needs to be torn out. These are pure additions.

- `PageHeader`: add `variant: 'full'` with full nav structure matching current `fountainhillcenter.org`
- New Payload collections: `Staff`, `Services`, `Events`, `BlogPosts`, `Awards`, `Sponsors`
- New pages via App Router: `/`, `/about`, `/services/[slug]`, `/staff`, `/contact`, `/blog`, `/events`
- All Phase 1 shared components are drop-in ready for new page types
- `SiteSettings` global already carries org-wide data — expand fields as needed
- Sponsor tiers (Gold/Silver/Bronze) → `Sponsors` collection + new `SponsorGrid` shared component

---

## 16. Implementation Directives for Claude Code

These are explicit requirements, not suggestions.

1. **`withPayload` in `next.config.ts` is required.** Payload v3 patches Next.js internals via this wrapper. Omitting it causes cryptic build-time failures.

2. **`@payloadcms/db-mongodb` is the correct adapter.** Do not use `@payloadcms/db-postgres`.

3. **`@payloadcms/richtext-lexical` is the correct editor package.** Pass `lexicalEditor({})` to `buildConfig({ editor: ... })`.

4. **Payload admin uses a catch-all route pattern**, not a route group. Create exactly these two files, copied from the Payload blank template:
   - `app/(payload)/admin/[[...segments]]/page.tsx`
   - `app/(payload)/api/[...slug]/route.ts`

5. **`output: 'standalone'` in `next.config.ts` is required for Docker.** Without it, the Dockerfile standalone copy produces an empty build artifact.

6. **Givebutter field names:** `raised` and `goal`. Not `raised_amount`, not `goal_amount`. Handle both `response.data` envelope and direct `response` shapes.

7. **`PAYLOAD_SECRET` minimum length is 32 characters.** Shorter values cause a Payload startup error. Document this clearly in `.env.example`.

8. **Font CSS variables go on `<html>`, not `<body>`.** Apply `${playfair.variable} ${inter.variable}` as classNames on the `<html>` element in the root layout.

9. **`StickyDonateCTA` must be a client component.** Add `'use client'` at the top. It uses `useEffect`, `useState`, and `sessionStorage`. Do not render as a server component.

10. **All Payload data access uses the local API** (`getPayload({ config })`), never HTTP fetch to `/api/...`. The local API is the correct pattern for server components.

11. **Placeholder images** during development: `https://placehold.co/{W}x{H}/EBF4FB/2B6CB0?text={Label}` — uses brand palette colors, labels identify each placeholder in reviews.

12. **`CampaignSettings.isLive` defaults to `false`.** The campaign page renders a minimal `<ComingSoon>` component when this is false. Implement ComingSoon as a centered full-page component with the FHC logo and a brief message — no content from CampaignPage is needed.

13. **No hardcoded copy anywhere.** Every string visible to a site visitor must come from a Payload CMS field. If a field value is null or empty, render nothing — do not fall back to a hardcoded string.

14. **Rich text rendering:** Use the Lexical React renderer from `@payloadcms/richtext-lexical/react` to render `SerializedEditorState` in React server components. Do not attempt to render raw Lexical JSON manually.

15. **FAQItems sort order:** When fetching `faqItems` via the Payload local API, pass `sort: 'sortOrder'` to the query so items render in the correct order without client-side sorting.
