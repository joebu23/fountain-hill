import Image from 'next/image'
import QRCode from 'qrcode'
import { RichText } from '@payloadcms/richtext-lexical/react'

interface MediaRef {
  url?: string | null
  alt?: string | null
}

interface CampaignPageServices {
  servicesHeading?: string | null
  servicesList?: { serviceName: string }[] | null
  servicesMissionStatement?: Record<string, unknown> | null
  servicesImage?: MediaRef | null
  servicesCTALabel?: string | null
}

interface ServiceListWithCalloutProps {
  page: CampaignPageServices
  donateUrl: string
}

export async function ServiceListWithCallout({ page, donateUrl }: ServiceListWithCalloutProps) {
  const qrDataUrl = await QRCode.toDataURL(donateUrl, { width: 120, margin: 1 })

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left — services list */}
          <div>
            {page.servicesHeading && (
              <h2 className="font-sans font-bold text-2xl md:text-3xl text-text-dark mb-6">
                {page.servicesHeading}
              </h2>
            )}

            {page.servicesList && page.servicesList.length > 0 && (
              <ul className="space-y-2">
                {page.servicesList.map((s, i) => (
                  <li key={i} className="font-sans text-text-dark flex items-start gap-2">
                    <span className="text-brand-orange mt-0.5 flex-shrink-0 text-lg leading-none">•</span>
                    {s.serviceName}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Right — mission statement + CTA */}
          <div className="flex flex-col gap-6">
            {page.servicesImage?.url ? (
              <Image
                src={page.servicesImage.url}
                alt={page.servicesImage.alt ?? 'Fountain Hill Center services'}
                width={600}
                height={400}
                className="w-full rounded-2xl object-cover mb-4"
              />
            ) : null}

            {page.servicesMissionStatement && (
              <div className="font-sans text-brand-blue text-lg md:text-xl leading-relaxed italic font-medium text-center">
                <RichText data={page.servicesMissionStatement as never} />
              </div>
            )}

            <div className="flex flex-col items-center gap-4 mt-2">
              {page.servicesCTALabel && (
                <a
                  href={donateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-brand-orange text-white rounded-full px-10 py-3 font-sans font-semibold uppercase tracking-wide hover:bg-orange-600 transition-colors"
                >
                  {page.servicesCTALabel}
                </a>
              )}
              <img
                src={qrDataUrl}
                alt="QR code to donate"
                className="w-24 h-24"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
