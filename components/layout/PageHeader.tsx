import Image from 'next/image'
import Link from 'next/link'

interface SiteSettings {
  logoDark?: { url?: string | null; alt?: string | null } | null
  campaignBadge?: string | null
}

interface PageHeaderProps {
  variant: 'campaign' | 'full'
  siteSettings: SiteSettings
  donateUrl: string
}

export function PageHeader({ siteSettings, donateUrl }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {siteSettings.logoDark?.url ? (
            <Link href="/">
              <Image
                src={siteSettings.logoDark.url}
                alt={siteSettings.logoDark.alt ?? 'Fountain Hill Center'}
                width={160}
                height={48}
                className="h-10 w-auto object-contain"
                priority
              />
            </Link>
          ) : (
            <Link href="/" className="font-serif text-brand-blue font-bold text-lg">
              Fountain Hill Center
            </Link>
          )}
          {siteSettings.campaignBadge && (
            <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full bg-brand-blue text-white text-xs font-sans font-semibold uppercase tracking-widest">
              {siteSettings.campaignBadge}
            </span>
          )}
        </div>

        <a
          href={donateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-brand-orange text-white rounded-full px-6 py-2.5 font-sans font-semibold uppercase tracking-wide text-sm hover:bg-orange-600 transition-colors"
        >
          Donate Here
        </a>
      </div>
    </header>
  )
}
