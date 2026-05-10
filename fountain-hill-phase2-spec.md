# Fountain Hill Center — Full Site Replacement
## Phase 2 Implementation Specification for Claude Code
### Builds on Phase 1 (Heart of the Hill campaign spec) — read that first

---

## 1. Overview

Phase 2 replaces `fountainhillcenter.org` entirely. The campaign microsite built in Phase 1 becomes one route within the full site. Nothing from Phase 1 is removed or refactored — Phase 2 is purely additive.

At cutover, the subdomain (`campaign.fountainhillcenter.org`) is retired and the full site serves from `fountainhillcenter.org` with the campaign at `/campaign` (or whatever slug is set in CMS).

---

## 2. What Carries Forward from Phase 1 (no changes)

- All Payload globals: `CampaignSettings`, `CampaignPage`, `SiteSettings`
- All Phase 1 collections: `Media`, `Testimonials`, `FAQItems`, `ProjectComponents`
- All campaign components: `CampaignHero`, `CampaignProgressBar`, `CampaignBudgetBreakdown`
- All shared components: `PillarGrid`, `MissionStatement`, `StatGrid`, `ServiceListWithCallout`, `ImpactComparison`, `Testimonial`, `EndorsementQuote`, `ProjectCardGrid`, `FAQAccordion`, `ClosingCTA`, `ResourceLinks`, `StickyDonateCTA`
- `Footer` — extended in Phase 2 (see section 8)
- `PageHeader` — extended to `variant: 'full'` (see section 8)
- Docker + Nginx setup, env vars, GitHub Actions stub

---

## 3. Tech Stack Additions

Same stack as Phase 1, plus:

| Addition | Package | Purpose |
|---|---|---|
| Email service | `resend` + `@payloadcms/email-resend` | Form notification emails, transactional email |
| Form submission handling | Native Next.js Server Actions | Contact form, message-a-therapist form |

No new infrastructure. Same MongoDB Atlas cluster, same Docker setup.

### New environment variables

```bash
# Add to .env.example

# Resend
RESEND_API_KEY=               # From: resend.com dashboard → API Keys
RESEND_FROM_EMAIL=            # Verified sender address. Example: noreply@fountainhillcenter.org
RESEND_NOTIFICATION_EMAIL=    # Staff inbox to receive form submission notifications
```

---

## 4. New Payload Collections

### Collection: `Staff`

```typescript
// payload/collections/Staff.ts
import type { CollectionConfig } from 'payload'

export const Staff: CollectionConfig = {
  slug: 'staff',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'position', 'location', 'isActive'],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true,
      admin: { description: 'URL slug. Example: "amy-van-gunst" → /therapist/amy-van-gunst' } },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    {
      name: 'location',
      type: 'select',
      options: [
        { label: 'Grand Rapids', value: 'grand-rapids' },
        { label: 'New Era (Lakeshore)', value: 'new-era' },
        { label: 'Online/Virtual', value: 'online' },
      ],
    },
    {
      name: 'position',
      type: 'select',
      options: [
        { label: 'Licensed Therapist', value: 'licensed-therapist' },
        { label: 'Intern', value: 'intern' },
        { label: 'Practice Manager', value: 'practice-manager' },
        { label: 'Advancement Coordinator', value: 'advancement-coordinator' },
        { label: 'Director of CASA', value: 'director-of-casa' },
        { label: 'Support Staff', value: 'support-staff' },
        { label: 'Retired Therapist', value: 'retired-therapist' },
      ],
    },
    {
      name: 'gender',
      type: 'select',
      options: [
        { label: 'Man', value: 'man' },
        { label: 'Woman', value: 'woman' },
        { label: 'Non-binary', value: 'non-binary' },
        { label: 'Prefer not to say', value: 'undisclosed' },
      ],
      admin: { description: 'Used for staff directory filter. Displayed only as a filter option, not on the profile.' },
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: { description: 'Services this staff member offers. Drives the staff directory filter.' },
    },
    { name: 'bio', type: 'richText' },
    {
      name: 'therapyPortalUrl',
      type: 'text',
      admin: { description: 'Full URL to this therapist\'s TherapyPortal message page, if applicable.' },
    },
    {
      name: 'credentials',
      type: 'text',
      admin: { description: 'Credential abbreviations shown under name. Example: LMSW, LPC' },
    },
    { name: 'isActive', type: 'checkbox', defaultValue: true,
      admin: { description: 'Uncheck to hide from staff directory without deleting.' } },
    { name: 'sortOrder', type: 'number', defaultValue: 0,
      admin: { description: 'Lower numbers appear first in the directory.' } },
  ],
}
```

### Collection: `Services`

```typescript
// payload/collections/Services.ts
import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'isActive'],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true,
      admin: { description: 'URL slug. Example: "individual-counseling" → /services/individual-counseling' } },
    { name: 'featuredImage', type: 'upload', relationTo: 'media' },
    { name: 'summary', type: 'textarea',
      admin: { description: 'Short description shown on the services overview cards.' } },
    { name: 'description', type: 'richText',
      admin: { description: 'Full page description.' } },
    {
      name: 'whatToExpect',
      type: 'array',
      admin: { description: 'Bulleted list of what clients can expect. Example: "Confidentiality: ..."' },
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'body', type: 'textarea' },
      ],
    },
    {
      name: 'faqItems',
      type: 'relationship',
      relationTo: 'faq-items',
      hasMany: true,
      admin: { description: 'Optional FAQ section specific to this service.' },
    },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
}
```

### Collection: `Events`

```typescript
// payload/collections/Events.ts
import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'eventType', 'startDate', 'isActive'],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'featuredImage', type: 'upload', relationTo: 'media' },
    { name: 'startDate', type: 'date', required: true },
    { name: 'endDate', type: 'date' },
    { name: 'description', type: 'richText' },
    { name: 'location', type: 'text',
      admin: { description: 'Event location or "Online"' } },
    { name: 'ticketUrl', type: 'text',
      admin: { description: 'Link to Givebutter event, Eventbrite, or other ticket page.' } },
    { name: 'ticketLabel', type: 'text', defaultValue: 'Get Tickets',
      admin: { description: 'CTA button label for the ticket link.' } },
    {
      name: 'eventType',
      type: 'select',
      required: true,
      options: [
        { label: 'Our Events', value: 'org' },
        { label: 'Community Events', value: 'community' },
      ],
    },
    { name: 'isActive', type: 'checkbox', defaultValue: true,
      admin: { description: 'Uncheck to hide without deleting.' } },
  ],
}
```

### Collection: `BlogPosts`

```typescript
// payload/collections/BlogPosts.ts
import type { CollectionConfig } from 'payload'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedAt', 'author', 'isPublished'],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'featuredImage', type: 'upload', relationTo: 'media' },
    { name: 'excerpt', type: 'textarea',
      admin: { description: 'Short summary shown on blog listing cards.' } },
    { name: 'body', type: 'richText', required: true },
    { name: 'publishedAt', type: 'date' },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'staff',
      admin: { description: 'Optional — link to a staff member as author.' },
    },
    { name: 'isPublished', type: 'checkbox', defaultValue: false,
      admin: { description: 'Check to make post publicly visible.' } },
  ],
}
```

### Collection: `Sponsors`

```typescript
// payload/collections/Sponsors.ts
import type { CollectionConfig } from 'payload'

export const Sponsors: CollectionConfig = {
  slug: 'sponsors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'tier', 'eventName', 'isActive'],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'url', type: 'text',
      admin: { description: 'Optional link when logo is clicked.' } },
    {
      name: 'tier',
      type: 'select',
      required: true,
      options: [
        { label: 'Gold', value: 'gold' },
        { label: 'Silver', value: 'silver' },
        { label: 'Bronze', value: 'bronze' },
      ],
    },
    { name: 'eventName', type: 'text',
      admin: { description: 'Event this sponsorship is associated with. Example: Laughing Matters 2026' } },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
}
```

### Collection: `Awards`

```typescript
// payload/collections/Awards.ts
import type { CollectionConfig } from 'payload'

export const Awards: CollectionConfig = {
  slug: 'awards',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true,
      admin: { description: 'Example: Porchlight Award' } },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'description', type: 'richText' },
    {
      name: 'recipients',
      type: 'array',
      fields: [
        { name: 'recipientName', type: 'text', required: true },
        { name: 'year', type: 'number' },
        { name: 'description', type: 'textarea' },
        { name: 'photo', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
```

### Collection: `FormSubmissions`

Stores all form submissions. No data ever deleted — audit trail for staff.

```typescript
// payload/collections/FormSubmissions.ts
import type { CollectionConfig } from 'payload'

export const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  admin: {
    useAsTitle: 'submittedAt',
    defaultColumns: ['formType', 'firstName', 'lastName', 'email', 'submittedAt'],
    // Read-only in admin — staff should not edit submissions
  },
  access: {
    create: () => true,       // Public can submit
    read: ({ req }) => !!req.user,  // Only authenticated admins can read
    update: () => false,      // Nobody can update a submission
    delete: () => false,      // Nobody can delete a submission
  },
  fields: [
    {
      name: 'formType',
      type: 'select',
      required: true,
      options: [
        { label: 'Services & Therapy', value: 'services' },
        { label: 'Internship', value: 'internship' },
        { label: 'Employment', value: 'employment' },
        { label: 'Message a Therapist', value: 'message-therapist' },
      ],
    },
    { name: 'firstName', type: 'text' },
    { name: 'lastName', type: 'text' },
    { name: 'email', type: 'email' },
    { name: 'phone', type: 'text' },
    { name: 'dateOfBirth', type: 'date' },
    // Services form fields
    {
      name: 'requestedServices',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Individual Counseling', value: 'individual-counseling' },
        { label: 'Couples Counseling', value: 'couples-counseling' },
        { label: 'Children & Adolescent Counseling', value: 'children-adolescent' },
        { label: 'Bodywork', value: 'bodywork' },
      ],
    },
    { name: 'hasInsurance', type: 'select',
      options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] },
    { name: 'insuranceProvider', type: 'text' },
    // Employment/internship field
    { name: 'resumeFile', type: 'upload', relationTo: 'media',
      admin: { description: 'Resume uploaded by applicant.' } },
    // Message a Therapist fields
    { name: 'targetTherapist', type: 'relationship', relationTo: 'staff' },
    // Shared
    { name: 'notes', type: 'textarea' },
    { name: 'submittedAt', type: 'date',
      defaultValue: () => new Date().toISOString(),
      admin: { readOnly: true } },
    { name: 'notificationSent', type: 'checkbox', defaultValue: false,
      admin: { readOnly: true, description: 'Set automatically after Resend notification is sent.' } },
  ],
}
```

---

## 5. New Payload Globals

### Global: `SiteSettings` — additions to Phase 1

Add these fields to the existing `SiteSettings` global:

```typescript
// Add to payload/globals/SiteSettings.ts fields array

// ── Navigation ─────────────────────────────────────────────────────────────
{
  name: 'clientPortalUrl',
  type: 'text',
  defaultValue: 'https://www.therapyportal.com/p/fountain49503/',
  admin: { description: 'TherapyPortal client login URL. Shown as secondary link in main nav.' },
},

// ── Locations ─────────────────────────────────────────────────────────────
{
  name: 'locations',
  type: 'array',
  admin: { description: 'Office locations shown on Contact page and Footer.' },
  fields: [
    { name: 'name', type: 'text', required: true,
      admin: { description: 'Example: Grand Rapids Office' } },
    { name: 'address', type: 'text' },
    { name: 'city', type: 'text' },
    { name: 'state', type: 'text', defaultValue: 'MI' },
    { name: 'zip', type: 'text' },
    { name: 'phone', type: 'text' },
    { name: 'fax', type: 'text' },
    {
      name: 'hours',
      type: 'array',
      fields: [
        { name: 'days', type: 'text', admin: { description: 'Example: Mon–Fri' } },
        { name: 'hours', type: 'text', admin: { description: 'Example: 9:00AM – 3:00PM' } },
      ],
    },
    { name: 'hoursNote', type: 'text',
      admin: { description: 'Example: Office hours indicate when administrative staff are available.' } },
    { name: 'transitInfo', type: 'textarea',
      admin: { description: 'Bus routes or other transit directions.' } },
    { name: 'parkingPdfUrl', type: 'text',
      admin: { description: 'Link to downloadable parking/directions PDF.' } },
    { name: 'googleMapsUrl', type: 'text',
      admin: { description: 'Full Google Maps directions URL.' } },
    { name: 'isAppointmentOnly', type: 'checkbox', defaultValue: false,
      admin: { description: 'Check for the Lakeshore office which is appointment-only.' } },
  ],
},

// ── Homepage content ───────────────────────────────────────────────────────
// NOTE: Homepage has its own Global (HomepagePage) — these are site-wide settings only
```

### Global: `HomepagePage`

```typescript
// payload/globals/HomepagePage.ts
import type { GlobalConfig } from 'payload'

export const HomepagePage: GlobalConfig = {
  slug: 'homepage',
  label: 'Homepage Content',
  fields: [
    // ── HERO ──────────────────────────────────────────────────────────────
    { name: 'heroHeadline', type: 'text', defaultValue: 'Find a Therapist Today' },
    { name: 'heroSubheadline', type: 'richText' },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'heroPrimaryCTALabel', type: 'text', defaultValue: 'Get Started' },
    { name: 'heroPrimaryCTAUrl', type: 'text', defaultValue: '/contact' },
    { name: 'heroSecondaryCTALabel', type: 'text', defaultValue: 'Client Portal' },
    // heroSecondaryCTAUrl comes from SiteSettings.clientPortalUrl

    // ── HOW IT WORKS ──────────────────────────────────────────────────────
    { name: 'howItWorksHeading', type: 'text', defaultValue: 'How It Works' },
    {
      name: 'howItWorksSteps',
      type: 'array',
      maxRows: 4,
      fields: [
        { name: 'stepNumber', type: 'number' },
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'icon', type: 'upload', relationTo: 'media' },
      ],
    },

    // ── MISSION ───────────────────────────────────────────────────────────
    { name: 'missionHeading', type: 'text', defaultValue: 'Our Mission' },
    { name: 'missionBody', type: 'richText' },
    { name: 'missionCTALabel', type: 'text', defaultValue: 'Support Our Mission' },
    { name: 'missionCTAUrl', type: 'text', defaultValue: '/about' },

    // ── WHY COUNSELING ────────────────────────────────────────────────────
    { name: 'whyCounselingHeading', type: 'text', defaultValue: 'Why Counseling?' },
    { name: 'whyCounselingBody', type: 'richText' },
    { name: 'whyCounselingImage', type: 'upload', relationTo: 'media' },

    // ── HISTORY TEASER ────────────────────────────────────────────────────
    { name: 'historyTeaserHeading', type: 'text', defaultValue: 'Our History' },
    { name: 'historyTeaserBody', type: 'richText' },
    { name: 'historyTeaserImage', type: 'upload', relationTo: 'media' },
    { name: 'historyTeaserCTALabel', type: 'text', defaultValue: 'Learn More' },
    { name: 'historyTeaserCTAUrl', type: 'text', defaultValue: '/about#history' },

    // ── DONATE CALLOUT ────────────────────────────────────────────────────
    { name: 'donateHeading', type: 'text', defaultValue: 'Donate Today' },
    { name: 'donateBody', type: 'richText' },
    // donateUrl comes from CampaignSettings.donateUrl

    // ── TESTIMONIAL ───────────────────────────────────────────────────────
    {
      name: 'featuredTestimonial',
      type: 'relationship',
      relationTo: 'testimonials',
    },

    // ── SPONSORS ──────────────────────────────────────────────────────────
    { name: 'sponsorsHeading', type: 'text', defaultValue: 'Thank you to our 2026 Laughing Matters Sponsors' },
    // Sponsors pulled from Sponsors collection filtered by isActive
  ],
}
```

### Global: `AboutPage`

```typescript
// payload/globals/AboutPage.ts
import type { GlobalConfig } from 'payload'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'About Page Content',
  fields: [
    { name: 'heroHeadline', type: 'text', defaultValue: 'About Fountain Hill Center' },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },

    // ── MISSION & VISION ──────────────────────────────────────────────────
    { name: 'missionHeading', type: 'text', defaultValue: 'Mission Statement' },
    { name: 'missionBody', type: 'richText' },
    { name: 'visionHeading', type: 'text', defaultValue: 'Our Vision' },
    { name: 'visionBody', type: 'richText' },

    // ── VALUES ────────────────────────────────────────────────────────────
    { name: 'valuesHeading', type: 'text', defaultValue: 'Our Values' },
    {
      name: 'values',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'richText', required: true },
        { name: 'icon', type: 'upload', relationTo: 'media' },
      ],
    },

    // ── HISTORY ───────────────────────────────────────────────────────────
    { name: 'historyHeading', type: 'text', defaultValue: 'History' },
    {
      name: 'historyTimeline',
      type: 'array',
      admin: { description: 'Timeline entries in chronological order (oldest first).' },
      fields: [
        { name: 'year', type: 'text', required: true,
          admin: { description: 'Example: 1884, or "Today"' } },
        { name: 'heading', type: 'text' },
        { name: 'body', type: 'richText', required: true },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },

    // ── HOW WE OPERATE ────────────────────────────────────────────────────
    { name: 'operationsHeading', type: 'text', defaultValue: 'How We Operate' },
    { name: 'operationsBody', type: 'richText' },

    // ── BOARD ─────────────────────────────────────────────────────────────
    { name: 'boardHeading', type: 'text', defaultValue: 'Board of Trustees' },
    { name: 'boardDescription', type: 'richText' },
    {
      name: 'boardMembers',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'role', type: 'text', required: true,
          admin: { description: 'Example: President, Vice President, Trustee' } },
        { name: 'sortOrder', type: 'number', defaultValue: 0 },
      ],
    },
    { name: 'boardApplicationUrl', type: 'text', defaultValue: '/contact',
      admin: { description: 'URL for the "Apply to Become a Board Member" button.' } },

    // ── CAREERS ───────────────────────────────────────────────────────────
    { name: 'careersHeading', type: 'text', defaultValue: 'Careers at Fountain Hill' },
    { name: 'careersBody', type: 'richText' },
    { name: 'careersCTALabel', type: 'text', defaultValue: 'Join the Team' },
    { name: 'careersCTAUrl', type: 'text', defaultValue: '/contact' },
  ],
}
```

### Global: `ContactPage`

```typescript
// payload/globals/ContactPage.ts
import type { GlobalConfig } from 'payload'

export const ContactPage: GlobalConfig = {
  slug: 'contact-page',
  label: 'Contact Page Content',
  fields: [
    { name: 'heroHeadline', type: 'text', defaultValue: 'Contact Us' },
    { name: 'formHeading', type: 'text', defaultValue: 'Contact Us' },
    { name: 'formSubheading', type: 'richText',
      admin: { description: 'Optional text shown above the form.' } },
    { name: 'successMessage', type: 'richText',
      admin: { description: 'Message shown after successful form submission.' } },
    // Location data comes from SiteSettings.locations
  ],
}
```

---

## 6. Updated `payload.config.ts`

Add all new collections and globals:

```typescript
import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { resendAdapter } from '@payloadcms/email-resend'

// Phase 1 collections
import { Media } from './payload/collections/Media'
import { Testimonials } from './payload/collections/Testimonials'
import { FAQItems } from './payload/collections/FAQItems'
import { ProjectComponents } from './payload/collections/ProjectComponents'

// Phase 2 collections
import { Staff } from './payload/collections/Staff'
import { Services } from './payload/collections/Services'
import { Events } from './payload/collections/Events'
import { BlogPosts } from './payload/collections/BlogPosts'
import { Sponsors } from './payload/collections/Sponsors'
import { Awards } from './payload/collections/Awards'
import { FormSubmissions } from './payload/collections/FormSubmissions'

// Phase 1 globals
import { CampaignSettings } from './payload/globals/CampaignSettings'
import { CampaignPage } from './payload/globals/CampaignPage'
import { SiteSettings } from './payload/globals/SiteSettings'

// Phase 2 globals
import { HomepagePage } from './payload/globals/HomepagePage'
import { AboutPage } from './payload/globals/AboutPage'
import { ContactPage } from './payload/globals/ContactPage'

export default buildConfig({
  admin: { user: 'users' },
  collections: [
    Media, Testimonials, FAQItems, ProjectComponents,
    Staff, Services, Events, BlogPosts, Sponsors, Awards, FormSubmissions,
  ],
  globals: [
    CampaignSettings, CampaignPage, SiteSettings,
    HomepagePage, AboutPage, ContactPage,
  ],
  editor: lexicalEditor({}),
  db: mongooseAdapter({
    url: process.env.DATABASE_URI as string,
  }),
  email: resendAdapter({
    defaultFromAddress: process.env.RESEND_FROM_EMAIL as string,
    defaultFromName: 'Fountain Hill Center',
    apiKey: process.env.RESEND_API_KEY as string,
  }),
  secret: process.env.PAYLOAD_SECRET as string,
  typescript: { outputFile: './payload-types.ts' },
})
```

---

## 7. Route Structure

```
app/
├── (frontend)/
│   ├── layout.tsx                          # Root layout (Phase 1, unchanged)
│   ├── page.tsx                            # Homepage — /
│   ├── about/
│   │   └── page.tsx                        # /about
│   ├── therapists/
│   │   ├── page.tsx                        # /therapists (staff directory)
│   │   └── [slug]/
│   │       └── page.tsx                    # /therapists/[slug] (staff profile)
│   ├── services/
│   │   ├── page.tsx                        # /services (overview)
│   │   └── [slug]/
│   │       └── page.tsx                    # /services/[slug] (service detail)
│   ├── contact/
│   │   └── page.tsx                        # /contact
│   ├── locations/
│   │   └── page.tsx                        # /locations
│   ├── events/
│   │   └── page.tsx                        # /events (org + community tabs)
│   ├── blog/
│   │   ├── page.tsx                        # /blog (listing)
│   │   └── [slug]/
│   │       └── page.tsx                    # /blog/[slug] (post)
│   ├── casa-of-oceana-county/
│   │   └── page.tsx                        # /casa-of-oceana-county
│   ├── awards/
│   │   └── [slug]/
│   │       └── page.tsx                    # /awards/[slug] (Porchlight, Friends & Champion)
│   ├── emergency-services/
│   │   └── page.tsx                        # /emergency-services
│   ├── message-a-therapist/
│   │   └── page.tsx                        # /message-a-therapist
│   └── [campaignSlug]/
│       └── page.tsx                        # Phase 1 campaign page (unchanged)
└── (payload)/                              # Phase 1 admin routes (unchanged)
```

**Redirect rules** — add to `next.config.ts` to preserve current site URLs:

```typescript
async redirects() {
  return [
    // Current site uses /therapist/[slug], new site uses /therapists/[slug]
    { source: '/therapist/:slug', destination: '/therapists/:slug', permanent: true },
    // Current about page has anchor-based history section
    { source: '/about-us', destination: '/about', permanent: true },
    { source: '/about-us/:path*', destination: '/about/:path*', permanent: true },
    // Services were at root level, now under /services/
    { source: '/body-work', destination: '/services/bodywork', permanent: true },
    { source: '/children-and-adolescents', destination: '/services/children-and-adolescents', permanent: true },
    { source: '/couples-counseling', destination: '/services/couples-counseling', permanent: true },
    { source: '/court-services', destination: '/services/court-services', permanent: true },
    { source: '/everyday-mindfulness', destination: '/services/everyday-mindfulness', permanent: true },
    { source: '/group-counseling', destination: '/services/group-counseling', permanent: true },
    { source: '/individual-counseling', destination: '/services/individual-counseling', permanent: true },
    { source: '/psychological-evaluations', destination: '/services/psychological-evaluations', permanent: true },
    // Award pages
    { source: '/porchlight-award', destination: '/awards/porchlight-award', permanent: true },
    { source: '/friend-and-champion-award', destination: '/awards/friends-and-champion-award', permanent: true },
    // Community events
    { source: '/community-events', destination: '/events?type=community', permanent: false },
  ]
}
```

---

## 8. Updated Layout Components

### `PageHeader` — full variant

The `variant: 'full'` nav matches the current site structure exactly.

```typescript
interface PageHeaderProps {
  variant: 'campaign' | 'full'
  siteSettings: SiteSettings
  donateUrl: string
}
```

**Full variant layout:**

```
[Logo]    About ▾  Staff ▾  Services ▾  CASA  Events ▾  Blog    [Get Started]  [Donate]
                                                                 [Client Portal — secondary, smaller]
```

Nav structure (from current site, carried forward exactly):

```
About Us ▾
  Our Mission → /about
  Contact → /contact
  Locations → /locations
  Porchlight Award → /awards/porchlight-award
  Friends and Champion Award → /awards/friends-and-champion-award

Staff ▾
  Meet Our Staff → /therapists
  Message A Therapist → /message-a-therapist

Services ▾
  Bodywork → /services/bodywork
  Children & Adolescents → /services/children-and-adolescents
  Couples Counseling → /services/couples-counseling
  Court Services → /services/court-services
  Everyday Mindfulness → /services/everyday-mindfulness
  Group Counseling → /services/group-counseling
  Individual Counseling → /services/individual-counseling
  Psychological Evaluations → /services/psychological-evaluations

CASA → /casa-of-oceana-county

Events ▾
  Our Events → /events
  Community Events → /events?type=community

Blog → /blog

[Get Started] → /contact  (primary CTA button)
[Donate] → CampaignSettings.donateUrl  (primary CTA button, brand-orange)
[Client Portal] → SiteSettings.clientPortalUrl  (secondary text link, smaller, right-aligned)
```

**Mobile nav:** hamburger menu. Same structure as desktop collapsed into an accordion. "Get Started", "Donate", and "Client Portal" shown as stacked buttons at bottom of mobile menu.

**Nav data:** hardcode the nav structure in the component — it rarely changes and a CMS-driven nav adds significant complexity for marginal gain. If nav changes are needed, they're a code change not a CMS change. This is the correct tradeoff for this org.

---

### `Footer` — Phase 2 update

Add to the existing Phase 1 footer:

- Locations section: render `siteSettings.locations` as two-column address cards above the existing footer content
- Nav links: add a condensed sitemap column (About, Staff, Services, Events, Blog, Contact)
- "Client Portal" link in footer nav

---

## 9. New Component Specifications

### `HeroSection` (general purpose)
**Reusable:** Yes — all pages

```typescript
interface HeroSectionProps {
  variant: 'full' | 'page'
  headline: string
  subheadline?: SerializedEditorState
  image?: Media
  primaryCTA?: { label: string; url: string }
  secondaryCTA?: { label: string; url: string }
}
```

- `full` variant: `min-h-[70vh]`, background image with dark overlay, Playfair Display headline, subheadline richtext, up to 2 CTA buttons. Used on homepage.
- `page` variant: `min-h-[200px]`, `bg-brand-blue`, white text, Playfair Display headline, no image required. Used on all inner pages (about, contact, services, etc.).

---

### `HowItWorksSteps`
**Reusable:** Yes

```typescript
interface HowItWorksStepsProps {
  heading: string
  steps: { stepNumber: number; title: string; description: string; icon?: Media }[]
}
```

- 3-column desktop, 1-column mobile
- Each step: large circled step number (brand-orange), icon (optional), title (bold), description
- Connecting line between steps on desktop (CSS `::after` pseudo-element)

---

### `StaffGrid`
**Reusable:** Yes — staff directory and filtered views on service pages

```typescript
interface StaffGridProps {
  staff: Staff[]
  showFilters?: boolean   // false when embedded on a service page (pre-filtered)
}
```

This is a **client component** (`'use client'`) because of filter state.

Filter state managed with `useState`. Filter options:
- Services: derived from `Services` collection
- Locations: Grand Rapids, New Era, Online
- Position: Licensed Therapist, Intern, Support Staff (grouped — hide retired from filter)
- Gender: Man, Woman, Non-binary

Filtering logic: AND across active filters. A staff member must match ALL active filters to appear.

Grid: 4-col desktop, 2-col tablet, 1-col mobile. Each card is a `<StaffCard>`.

On the `/therapists` page, staff data is fetched server-side and passed as props. The component handles client-side filtering without additional API calls.

---

### `StaffCard`
**Reusable:** Yes — child of StaffGrid, also used on service detail pages

```typescript
interface StaffCardProps {
  staff: Staff
  variant?: 'grid' | 'compact'
}
```

- `grid` variant: photo (aspect-ratio 4:5, `object-cover`), name, location badge, position, services tags
- `compact` variant: smaller card for sidebar or service page embeds
- Card links to `/therapists/[slug]`

---

### `StaffProfilePage` (page layout component)
**Reusable:** No — used only on `/therapists/[slug]`

```typescript
interface StaffProfilePageProps {
  staff: Staff
}
```

Layout:
- Left column (40%): large photo, name, credentials, position, location, services tags, "Message [Name]" CTA → `therapyPortalUrl` (if set)
- Right column (60%): bio richtext
- Below: `StaffGrid` showing 3–4 related staff (same services, different person) — optional, shown if matches exist

---

### `ServiceOverviewGrid`
**Reusable:** Yes

```typescript
interface ServiceOverviewGridProps {
  heading?: string
  services: Service[]
}
```

Cards linking to `/services/[slug]`. Each card: featured image, service title, summary text, "Learn More" link. 3-col desktop, 2-col tablet, 1-col mobile.

---

### `ServiceDetailLayout` (page layout component)
**Reusable:** No — used only on `/services/[slug]`

```typescript
interface ServiceDetailLayoutProps {
  service: Service
  donateUrl: string
}
```

Layout:
- `HeroSection(page)` with service title
- Description richtext
- "What to Expect" section: if `whatToExpect` array has entries, render as styled list with heading + body per item
- `FAQAccordion` if `faqItems` are present
- "Find a Therapist" CTA → `/therapists?service=[slug]`
- `StaffGrid` filtered to this service, `showFilters={false}`

---

### `ContactForm`
**Reusable:** No — used only on `/contact`

This is a **client component** (`'use client'`).

Fields and conditional logic:

```
Always shown:
  First Name (required)
  Last Name (required)
  Email (required)
  Phone
  Date of Birth (required)
  Purpose selector: Services & Therapy | Internship | Employment

When Purpose = "Services & Therapy":
  Checkboxes: Individual Counseling, Couples Counseling, Children & Adolescent, Bodywork
  Radio: Do you have insurance? Yes / No
  Conditional on Yes: Insurance Provider (text)
  Textarea: Additional information

When Purpose = "Internship":
  Textarea: Additional information / background

When Purpose = "Employment":
  File upload: Resume/CV (PDF, DOC, DOCX — max 25MB)
  Textarea: Additional information

Always shown:
  hCaptcha (see note below)
  Submit button
```

**CAPTCHA:** Use hCaptcha (`@hcaptcha/react-hcaptcha`), not reCAPTCHA. hCaptcha is privacy-respecting and has a free tier. Requires `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` and `HCAPTCHA_SECRET_KEY` env vars.

**Submission flow (Server Action):**
1. Validate all fields server-side
2. Verify hCaptcha token against hCaptcha API
3. If resume file present: upload to Payload Media via local API
4. Create `FormSubmissions` document via Payload local API
5. Send notification email via Resend to `RESEND_NOTIFICATION_EMAIL`
6. Return success or error to client

**Email notification template (Resend):**
Plain but readable. Subject: `New [formType] inquiry — [firstName] [lastName]`. Body: all submitted fields in a clean table. Do not include resume as attachment — include a link to the Payload admin URL for the submission.

**New env vars needed:**
```bash
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=    # From hcaptcha.com dashboard
HCAPTCHA_SECRET_KEY=              # From hcaptcha.com dashboard
```

---

### `MessageATherapistForm`
**Reusable:** No — used only on `/message-a-therapist`

This is a **client component** (`'use client'`).

Simpler than ContactForm. Fields:
```
First Name (required)
Last Name (required)
Email (required)
Phone
Therapist selector: dropdown of active licensed therapists from Staff collection
  (fetched server-side and passed as props)
Message / notes (textarea, required)
hCaptcha
Submit button
```

Same server action pattern as ContactForm: validate → verify captcha → save to `FormSubmissions` (formType: 'message-therapist') → send Resend notification.

---

### `LocationsBlock`
**Reusable:** Yes — Contact page, Locations page, and Footer

```typescript
interface LocationsBlockProps {
  locations: Location[]   // from SiteSettings.locations
  variant?: 'full' | 'compact'
}
```

- `full` variant: heading, side-by-side cards, each with full address, phone, fax, hours table, hours note, transit info, parking PDF link, Google Maps button
- `compact` variant: name, address, phone only — used in Footer

---

### `EventGrid`
**Reusable:** Yes

```typescript
interface EventGridProps {
  events: Event[]
  defaultType?: 'org' | 'community' | 'all'
}
```

Client component. Tab filter: "Our Events" / "Community Events" / "All". Each event renders as an `EventCard`.

---

### `EventCard`
**Reusable:** Yes

```typescript
interface EventCardProps {
  event: Event
}
```

Card: featured image, event name, formatted date range, location, description excerpt, ticket CTA → `ticketUrl`. If `startDate` is in the past, render a "Past Event" badge instead of the ticket CTA.

---

### `BlogGrid`
**Reusable:** Yes

```typescript
interface BlogGridProps {
  posts: BlogPost[]
  totalPages: number
  currentPage: number
}
```

3-col desktop, 2-col tablet, 1-col mobile. Pagination at bottom. Each post is a `BlogPostCard`. Pagination via URL query param (`?page=2`) — server-side, no client state needed.

---

### `BlogPostCard`
**Reusable:** Yes

```typescript
interface BlogPostCardProps {
  post: BlogPost
}
```

Card: featured image (`aspect-video`), title, excerpt, published date, optional author name, "Read More" link → `/blog/[slug]`.

---

### `BlogPostLayout` (page layout component)
**Reusable:** No — used only on `/blog/[slug]`

```typescript
interface BlogPostLayoutProps {
  post: BlogPost
  relatedPosts: BlogPost[]
}
```

Layout: featured image (full-width), title (Playfair Display), date + author, richtext body, "Related Posts" row at bottom (3 cards from same service area or recent posts).

---

### `SponsorGrid`
**Reusable:** Yes

```typescript
interface SponsorGridProps {
  heading: string
  sponsors: Sponsor[]
}
```

Groups sponsors by tier. Gold tier first, then Silver, then Bronze. Within each tier: heading + horizontal logo grid. Logos link to `sponsor.url` if present. Filters to `isActive: true` only.

---

### `AwardSection`
**Reusable:** Yes — used on `/awards/[slug]`

```typescript
interface AwardSectionProps {
  award: Award
}
```

Award name as page heading, `description` richtext, then recipients listed in reverse-chronological order. Each recipient: year badge, name, optional photo, optional description.

---

### `HistoryTimeline`
**Reusable:** Yes

```typescript
interface HistoryTimelineProps {
  heading: string
  entries: { year: string; heading?: string; body: SerializedEditorState; image?: Media }[]
}
```

Vertical timeline. Left column: year label (brand-orange, bold). Right column: optional heading, richtext body, optional image. Connecting vertical line in brand-blue. On mobile: stacks to single column.

---

### `ValuesGrid`
**Reusable:** Yes — generalizes `PillarGrid` (same component, icon optional)

This replaces `PillarGrid` entirely. `PillarGrid` should be renamed `ValuesGrid` or the campaign spec should use `ValuesGrid`.

```typescript
interface ValuesGridProps {
  heading?: string
  items: { icon?: Media; label: string; description: string }[]
  columns?: 3 | 4   // default 3
}
```

With icons → renders like the campaign pillars. Without icons → renders like the About values grid.

---

### `BoardMemberList`
**Reusable:** Yes

```typescript
interface BoardMemberListProps {
  heading: string
  description?: SerializedEditorState
  members: { name: string; role: string }[]
  applicationUrl?: string
  applicationLabel?: string
}
```

Simple list. Name bold, role as secondary text. Optional "Apply to Become a Board Member" CTA at bottom.

---

### `RichtextPage` (generic page layout)
**Reusable:** Yes — CASA, Emergency Services, and any future simple content pages

```typescript
interface RichtextPageProps {
  headline: string
  body: SerializedEditorState
  image?: Media
}
```

`HeroSection(page)` + richtext content in a constrained `max-w-3xl` column. Used for pages like `/casa-of-oceana-county` and `/emergency-services` that are primarily editorial content.

---

## 10. Page Globals vs. Dynamic Collections — Decision

Some pages (About, Homepage, Contact) have unique one-off content → **Globals** (one record, always exists).

Some pages are generated from a collection (service pages, blog posts, staff profiles, award pages) → **Collections** with slugs + dynamic routes.

Pages with neither significant dynamic content nor unique CMS needs (Emergency Services, CASA) → **`RichtextPage`** component driven by a small Global or inline richtext field added to `SiteSettings`.

| Page | Data source |
|---|---|
| Homepage | `HomepagePage` Global |
| About | `AboutPage` Global |
| Contact | `ContactPage` Global |
| Locations | `SiteSettings.locations` |
| Staff directory | `Staff` collection |
| Staff profile | `Staff` collection |
| Services overview | `Services` collection |
| Service detail | `Services` collection |
| Events | `Events` collection |
| Blog listing | `BlogPosts` collection |
| Blog post | `BlogPosts` collection |
| Awards | `Awards` collection |
| CASA | Richtext field in `SiteSettings` or small Global |
| Emergency Services | Richtext field in `SiteSettings` |
| Campaign | `CampaignPage` Global (Phase 1) |

---

## 11. ISR Strategy by Page Type

| Page type | `revalidate` | Reason |
|---|---|---|
| Homepage | 300 (5 min) | Changes infrequently but sponsor/event data should stay fresh |
| About | 3600 (1 hr) | Very infrequent changes |
| Staff directory | 300 (5 min) | New staff added occasionally |
| Staff profile | 3600 (1 hr) | Rarely changes |
| Service pages | 3600 (1 hr) | Very stable |
| Events | 60 (1 min) | Date-sensitive, needs to stay current |
| Blog | 300 (5 min) | New posts published regularly |
| Blog post | 3600 (1 hr) | Published content rarely changes |
| Contact | 3600 (1 hr) | Very stable |
| Campaign | 300 (5 min) | Progress bar data (Phase 1, unchanged) |

---

## 12. Additional Environment Variables for Phase 2

```bash
# Add to .env.example

# Resend (email)
RESEND_API_KEY=
RESEND_FROM_EMAIL=              # Must be a verified domain in Resend dashboard
RESEND_NOTIFICATION_EMAIL=      # Staff email to receive form submission notifications

# hCaptcha (contact form spam protection)
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=
HCAPTCHA_SECRET_KEY=
```

---

## 13. Seeding Initial Data

Before launch, seed these records so the site isn't empty:

**Staff collection:** All 23 current staff members from `fountainhillcenter.org/therapists/`
**Services collection:** All 8 current services (bodywork, children & adolescents, couples counseling, court services, everyday mindfulness, group counseling, individual counseling, psychological evaluations)
**Sponsors collection:** Current Laughing Matters 2026 sponsors (Gold: Seneca, OVC, Orville & Susan Cloutier Crain Fund, Shelby State Bank, Trinity Health, UAW 1243; Silver: Aurora, Hart Rotary, Shelby UCC, Snider Farms)
**Awards collection:** Porchlight Award, Friends and Champion Award (recipient history TBD from client)
**SiteSettings:** Both office locations, phone numbers, hours, social links
**HomepagePage, AboutPage, ContactPage Globals:** Content migrated from current site

---

## 14. Content Gaps for Phase 2

| Item | Status | Notes |
|---|---|---|
| Staff bios | **Missing from current site** | Current site has no bio text on therapist profiles — needs to be written or provided by each therapist |
| Staff TherapyPortal individual URLs | **Unknown** | Current "Message A Therapist" page is a single form, not per-therapist links. Confirm with org whether individual portal links exist |
| Award recipient history | **Not captured** | Porchlight and Friends & Champion award past recipients — needs list from org |
| CASA page content | **Not fetched** | Rate-limited during audit — content needs to be migrated from current site |
| Blog post history | **Not migrated** | Current WordPress blog posts need to be migrated or left behind (confirm with org whether SEO value of old posts justifies migration effort) |
| Services page images | **None on current site** | Each service page currently has no featured image — org needs to provide or stock photography used |
| Community Events history | **Not fetched** | Rate-limited — page needs content audit |

---

## 15. Implementation Order for Claude Code

Build in this sequence to avoid circular dependency issues:

1. Update `payload.config.ts` with all new collections and globals
2. Run `payload generate:types` to regenerate `payload-types.ts`
3. Add Phase 2 env vars to `.env.example`
4. Build layout components: `PageHeader(full)`, `Footer(updated)`
5. Build shared components in dependency order:
   - `HeroSection` (no deps)
   - `ValuesGrid` (replaces `PillarGrid`)
   - `LocationsBlock` (no deps)
   - `SponsorGrid` (no deps)
   - `HistoryTimeline` (no deps)
   - `BoardMemberList` (no deps)
   - `HowItWorksSteps` (no deps)
   - `StaffCard` (no deps)
   - `StaffGrid` (deps: StaffCard)
   - `EventCard` (no deps)
   - `EventGrid` (deps: EventCard)
   - `BlogPostCard` (no deps)
   - `BlogGrid` (deps: BlogPostCard)
   - `AwardSection` (no deps)
   - `ServiceOverviewGrid` (no deps)
   - `RichtextPage` (no deps)
6. Build form components: `ContactForm`, `MessageATherapistForm`
7. Build page layout components: `StaffProfilePage`, `ServiceDetailLayout`, `BlogPostLayout`
8. Build all pages in route order
9. Add redirects to `next.config.ts`
10. Seed initial data
