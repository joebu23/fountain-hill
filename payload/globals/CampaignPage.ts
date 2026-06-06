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

    // ── QUOTE DISPLAY ─────────────────────────────────────────────────────
    {
      name: 'quoteDisplay',
      type: 'group',
      label: 'Quote Display',
      fields: [
        { name: 'title', type: 'text', defaultValue: 'Who We Are' },
        { name: 'body', type: 'richText' },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },

    // ── ICON DISPLAY ──────────────────────────────────────────────────────
    {
      name: 'iconDisplay',
      type: 'group',
      label: 'Icon Display',
      fields: [
        { name: 'title', type: 'text' },
        {
          name: 'items',
          type: 'array',
          fields: [
            { name: 'icon', type: 'upload', relationTo: 'media' },
            { name: 'title', type: 'text', required: true },
            { name: 'body', type: 'richText' },
          ],
        },
      ],
    },

    // ── SERVICES SECTION ──────────────────────────────────────────────────
    {
      name: 'servicesSection',
      type: 'group',
      label: 'Services Section',
      fields: [
        {
          name: 'leftGroup',
          type: 'group',
          label: 'Left Group',
          fields: [
            { name: 'leftTitle', type: 'text', defaultValue: 'Who We Help With Our Available Services' },
            {
              name: 'list',
              type: 'array',
              label: 'List',
              fields: [
                { name: 'item', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          name: 'rightGroup',
          type: 'group',
          label: 'Right Group',
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media' },
            { name: 'title', type: 'text' },
            { name: 'ctaLabel', type: 'text', defaultValue: 'DONATE HERE' },
            { name: 'ctaLink', type: 'text' },
            { name: 'qrCodeImage', type: 'upload', relationTo: 'media' },
            { name: 'calloutImage', type: 'upload', relationTo: 'media' },
          ],
        },
      ],
    },

    // ── IMPACT OVERVIEW ───────────────────────────────────────────────────
    {
      name: 'impactOverview',
      type: 'group',
      label: 'Impact Overview',
      fields: [
        { name: 'titleImage', type: 'upload', relationTo: 'media' },
        { name: 'quoteIcon', type: 'upload', relationTo: 'media' },
        { name: 'quote', type: 'richText' },
        { name: 'quoteAttribution', type: 'text' },
        { name: 'title', type: 'richText' },
        { name: 'headerIcon', type: 'upload', relationTo: 'media' },
        {
          name: 'impactItems',
          type: 'array',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'body', type: 'richText' },
          ],
        },
      ],
    },

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
      admin: {
        description: 'Select FAQ items. Order is controlled by the Sort Order field on each item.',
      },
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
