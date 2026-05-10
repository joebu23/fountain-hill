import QRCode from 'qrcode'
import type { ProgressData } from '@/lib/givebutter'

interface CampaignProgressBarProps {
  progress: ProgressData
  donateUrl: string
  ctaLabel: string
}

function formatCurrency(amount: number) {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}

export async function CampaignProgressBar({ progress, donateUrl, ctaLabel }: CampaignProgressBarProps) {
  const qrDataUrl = await QRCode.toDataURL(donateUrl, { width: 120, margin: 1 })

  return (
    <div>
      <p className="font-sans text-xs uppercase tracking-widest text-text-muted mb-1">
        Raised to Date:
      </p>

      <p className="font-sans font-extrabold text-3xl md:text-4xl text-brand-orange leading-tight">
        {formatCurrency(progress.amountRaised)}
      </p>

      {progress.source === 'fallback' && progress.asOf && (
        <p className="font-sans text-xs text-text-muted mt-0.5">
          As of {new Date(progress.asOf).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      )}

      <p className="font-sans text-sm text-brand-navy mt-1">
        of our{' '}
        <span className="font-semibold text-brand-orange">{formatCurrency(progress.goal)}</span>{' '}
        goal.
      </p>

      {/* Progress bar */}
      <div className="mt-4 h-3 bg-surface-light rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-sky rounded-full transition-all duration-1000"
          style={{ width: `${progress.percentComplete}%` }}
        />
      </div>
      <p className="font-sans text-xs text-text-muted mt-1 text-right">
        {progress.percentComplete.toFixed(2)}%
      </p>

      {progress.donors !== undefined && (
        <p className="font-sans text-sm text-brand-navy mt-2">
          {progress.donors.toLocaleString()} donors
        </p>
      )}

      {/* Invite text */}
      <p className="font-sans text-sm font-semibold italic text-brand-orange mt-4 leading-relaxed">
        We invite you to partner with us in shaping this future.
      </p>

      {/* QR + CTA */}
      <div className="mt-5 flex items-center gap-4">
        <img
          src={qrDataUrl}
          alt="Scan to donate"
          width={80}
          height={80}
          className="rounded-lg flex-shrink-0"
        />
        <a
          href={donateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center bg-brand-orange text-white rounded-full px-6 py-3 font-sans font-semibold uppercase tracking-wide text-sm hover:bg-orange-600 transition-colors"
        >
          {ctaLabel}
        </a>
      </div>
    </div>
  )
}
