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

    // ── BUDGET EXPLAINER ──────────────────────────────────────────────────
    {
      name: 'budgetExplainer',
      type: 'group',
      label: 'Budget Explainer',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'subtitle', type: 'text' },
        { name: 'subtext', type: 'richText' },
        {
          name: 'amounts',
          type: 'array',
          fields: [
            { name: 'amount', type: 'text', required: true },
            { name: 'title', type: 'text', required: true },
          ],
        },
        { name: 'statement', type: 'richText' },
        { name: 'ctaLabel', type: 'text' },
        { name: 'ctaLink', type: 'text' },
        { name: 'qrCode', type: 'upload', relationTo: 'media' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'quoteIcon', type: 'upload', relationTo: 'media' },
        { name: 'quote', type: 'richText' },
        { name: 'quoteAttribution', type: 'richText' },
      ],
    },

    // ── ICON DISPLAY 2 ────────────────────────────────────────────────────
    {
      name: 'iconDisplay2',
      type: 'group',
      label: 'Icon Display 2',
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

    // ── FAQ SECTION ───────────────────────────────────────────────────────
    {
      name: 'faqSection',
      type: 'group',
      label: 'FAQ Section',
      fields: [
        { name: 'icon', type: 'upload', relationTo: 'media' },
        { name: 'title', type: 'text' },
        { name: 'subtitle', type: 'text' },
        { name: 'titleImage', type: 'upload', relationTo: 'media' },
        {
          name: 'faqs',
          label: 'FAQs',
          type: 'array',
          fields: [
            { name: 'question', type: 'text', required: true },
            { name: 'answer', type: 'richText' },
          ],
        },
      ],
    },

    // ── CAMPAIGN FOOTER ───────────────────────────────────────────────────
    {
      name: 'campaignFooter',
      type: 'group',
      label: 'Campaign Footer',
      fields: [
        { name: 'footerImage', type: 'upload', relationTo: 'media', label: 'Footer Image (left column photo)' },
        { name: 'footerMiddle', type: 'richText', label: 'Footer Middle Content' },
        {
          name: 'footerLinks',
          type: 'array',
          label: 'Footer Links',
          fields: [
            { name: 'title', type: 'text', required: true, label: 'Label above button' },
            { name: 'ctaLabel', type: 'text', required: true, label: 'Button text' },
            { name: 'ctaUrl', type: 'text', label: 'URL (use for external links or mailto:)' },
            {
              name: 'ctaMedia',
              type: 'upload',
              relationTo: 'media',
              label: 'Media download (overrides URL if set)',
            },
          ],
        },
        { name: 'ctaLabel', type: 'text', label: 'CTA Button Label' },
        { name: 'ctaLink', type: 'text', label: 'CTA Button Link' },
        { name: 'qrCode', type: 'upload', relationTo: 'media', label: 'QR Code Image' },
        {
          name: 'footerBackgroundImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Footer Wave Background Image',
        },
      ],
    },
  ],
}
