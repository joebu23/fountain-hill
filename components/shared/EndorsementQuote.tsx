import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'

interface MediaRef {
  url?: string | null
  alt?: string | null
}

interface EndorsementQuoteProps {
  quote: Record<string, unknown>
  attribution: string
  attributionTitle?: string | null
  photo?: MediaRef | null
}

export function EndorsementQuote({ quote, attribution, attributionTitle, photo }: EndorsementQuoteProps) {
  return (
    <div className="relative bg-surface-light rounded-2xl p-8 w-full">
      <span className="font-serif text-brand-orange text-6xl leading-none select-none" aria-hidden="true">
        &ldquo;
      </span>
      <div className="font-sans text-text-dark text-base md:text-lg leading-relaxed -mt-4 mb-6">
        <RichText data={quote as never} />
      </div>
      <div className="flex items-center gap-3">
        {photo?.url && (
          <Image
            src={photo.url}
            alt={photo.alt ?? attribution}
            width={48}
            height={48}
            className="rounded-full w-12 h-12 object-cover flex-shrink-0"
          />
        )}
        <div>
          <p className="font-sans font-bold text-text-dark text-sm">{attribution}</p>
          {attributionTitle && (
            <p className="font-sans text-text-muted text-xs">{attributionTitle}</p>
          )}
        </div>
      </div>
    </div>
  )
}
