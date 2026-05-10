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
      name: 'campaignBadge',
      type: 'text',
      admin: {
        description:
          'Optional label shown as a pill badge in the campaign header (e.g. "Capital Campaign"). Leave blank to show only the logo.',
      },
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
