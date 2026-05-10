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
