import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import { Users } from './payload/collections/Users'
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
  collections: [Users, Media, Testimonials, FAQItems, ProjectComponents],
  globals: [CampaignSettings, CampaignPage, SiteSettings],
  editor: lexicalEditor({}),
  db: mongooseAdapter({
    url: process.env.DATABASE_URI as string,
  }),
  secret: process.env.PAYLOAD_SECRET as string,
  sharp,
  typescript: {
    outputFile: './payload-types.ts',
  },
})
