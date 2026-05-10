import Image from 'next/image'
import Link from 'next/link'

interface SiteSettings {
  logoLight?: { url?: string | null; alt?: string | null } | null
  orgName?: string | null
  contactPhone?: string | null
  emergencyServicesUrl?: string | null
  socialLinks?: {
    facebook?: string | null
    instagram?: string | null
    twitter?: string | null
  } | null
}

interface FooterProps {
  siteSettings: SiteSettings
  donateUrl: string
}

export function Footer({ siteSettings, donateUrl }: FooterProps) {
  return (
    <footer className="bg-brand-blue text-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Col 1: Logo + address */}
          <div>
            {siteSettings.logoLight?.url ? (
              <Image
                src={siteSettings.logoLight.url}
                alt={siteSettings.logoLight.alt ?? 'Fountain Hill Center'}
                width={160}
                height={48}
                className="h-10 w-auto object-contain mb-4"
              />
            ) : (
              <p className="font-serif text-white font-bold text-lg mb-4">
                {siteSettings.orgName ?? 'Fountain Hill Center'}
              </p>
            )}
            <address className="not-italic text-white/80 text-sm leading-relaxed">
              534 Fountain St NE<br />
              Grand Rapids, MI 49503
              {siteSettings.contactPhone && (
                <>
                  <br />
                  <a
                    href={`tel:${siteSettings.contactPhone}`}
                    className="hover:text-white transition-colors"
                  >
                    {siteSettings.contactPhone}
                  </a>
                </>
              )}
            </address>
          </div>

          {/* Col 2: Social + Donate */}
          <div className="flex flex-col gap-4">
            {siteSettings.socialLinks && (
              <div className="flex gap-4">
                {siteSettings.socialLinks.facebook && (
                  <a
                    href={siteSettings.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-white transition-colors text-sm font-sans"
                  >
                    Facebook
                  </a>
                )}
                {siteSettings.socialLinks.instagram && (
                  <a
                    href={siteSettings.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-white transition-colors text-sm font-sans"
                  >
                    Instagram
                  </a>
                )}
                {siteSettings.socialLinks.twitter && (
                  <a
                    href={siteSettings.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-white transition-colors text-sm font-sans"
                  >
                    Twitter
                  </a>
                )}
              </div>
            )}
            <a
              href={donateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-brand-orange text-white rounded-full px-8 py-3 font-sans font-semibold uppercase tracking-wide text-sm hover:bg-orange-600 transition-colors w-fit"
            >
              Donate Today
            </a>
          </div>

          {/* Col 3: Emergency */}
          <div>
            {siteSettings.emergencyServicesUrl && (
              <a
                href={siteSettings.emergencyServicesUrl}
                className="inline-flex items-center gap-2 text-white font-sans font-semibold hover:text-white/80 transition-colors"
              >
                <span className="text-brand-orange text-xl">⚠</span>
                Emergency?
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-white/20">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4">
          <p className="text-white/60 text-xs text-center font-sans">
            Made with 💙 and a lot of ☕️ by the awesome team at Code for Good West Michigan
          </p>
        </div>
      </div>
    </footer>
  )
}
