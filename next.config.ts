import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const siteHostname = process.env.NEXT_PUBLIC_SITE_URL?.replace(/^https?:\/\//, '') ?? ''

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: siteHostname
      ? [{ protocol: 'https', hostname: siteHostname }]
      : [],
  },
}

export default withPayload(nextConfig)
