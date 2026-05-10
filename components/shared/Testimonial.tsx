import { RichText } from '@payloadcms/richtext-lexical/react'

interface TestimonialProps {
  quote: Record<string, unknown>
  attribution: string
  attributionTitle?: string | null
  variant?: 'default' | 'large'
}

export function Testimonial({ quote, attribution, attributionTitle, variant = 'default' }: TestimonialProps) {
  return (
    <div className="relative">
      <span
        className={`font-serif text-brand-orange leading-none select-none ${variant === 'large' ? 'text-8xl' : 'text-6xl'}`}
        aria-hidden="true"
      >
        &ldquo;
      </span>
      <div className={`font-sans text-text-dark leading-relaxed -mt-4 ${variant === 'large' ? 'text-xl md:text-2xl' : 'text-base md:text-lg'}`}>
        <RichText data={quote as never} />
      </div>
      <p className="font-sans text-text-muted text-sm mt-4">
        &mdash; {attribution}
        {attributionTitle && (
          <>
            <br />
            <span className="text-xs">{attributionTitle}</span>
          </>
        )}
      </p>
    </div>
  )
}
