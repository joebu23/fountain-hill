interface MediaRef {
  url?: string | null
}

interface CampaignPageResources {
  resourcesHeading?: string | null
  caseForSupportPDF?: MediaRef | string | null
  caseForSupportLabel?: string | null
  historyPDF?: MediaRef | string | null
  historyPDFLabel?: string | null
}

interface SiteSettingsContact {
  contactName?: string | null
  contactEmail?: string | null
}

interface ResourceLinksProps {
  page: CampaignPageResources
  siteSettings: SiteSettingsContact
}

function ResourceButton({
  href,
  label,
  disabled,
}: {
  href?: string | null
  label: string
  disabled?: boolean
}) {
  if (disabled || !href) {
    return (
      <span className="inline-block bg-[#1E3259] text-white/50 rounded px-6 py-2.5 font-sans font-semibold uppercase tracking-wide text-sm cursor-not-allowed">
        {label}
      </span>
    )
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block bg-[#1E3259] text-white rounded px-6 py-2.5 font-sans font-semibold uppercase tracking-wide text-sm hover:bg-brand-blue transition-colors"
    >
      {label}
    </a>
  )
}

export function ResourceLinks({ page, siteSettings }: ResourceLinksProps) {
  const caseUrl =
    page.caseForSupportPDF && typeof page.caseForSupportPDF === 'object'
      ? (page.caseForSupportPDF as MediaRef).url
      : null
  const historyUrl =
    page.historyPDF && typeof page.historyPDF === 'object'
      ? (page.historyPDF as MediaRef).url
      : null

  return (
    <section className="py-12 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="font-sans text-text-dark font-semibold text-sm mb-3">
              {page.resourcesHeading ?? 'View more details in our Case for Support:'}
            </p>
            <ResourceButton
              href={caseUrl}
              label={page.caseForSupportLabel ?? 'DOWNLOAD PDF HERE'}
              disabled={!caseUrl}
            />
          </div>

          <div>
            <p className="font-sans text-text-dark font-semibold text-sm mb-3">
              View more details of our History:
            </p>
            <ResourceButton
              href={historyUrl}
              label={page.historyPDFLabel ?? 'DOWNLOAD PDF HERE'}
              disabled={!historyUrl}
            />
          </div>

          {siteSettings.contactName && siteSettings.contactEmail && (
            <div>
              <p className="font-sans text-text-dark font-semibold text-sm mb-3">
                Questions? Contact Us Here:
              </p>
              <a
                href={`mailto:${siteSettings.contactEmail}`}
                className="inline-block bg-[#1E3259] text-white rounded px-6 py-2.5 font-sans font-semibold uppercase tracking-wide text-sm hover:bg-brand-blue transition-colors"
              >
                EMAIL {siteSettings.contactName.toUpperCase()}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
