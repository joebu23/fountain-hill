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
