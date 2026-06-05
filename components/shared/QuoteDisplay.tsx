import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'

interface MediaRef {
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
}

interface QuoteDisplayProps {
  title?: string | null
  body?: Record<string, unknown> | null
  image?: MediaRef | number | null
}

export function QuoteDisplay({ title, body, image }: QuoteDisplayProps) {
  if (!title && !body) return null

  const img = typeof image === 'object' && image !== null ? (image as MediaRef) : null

  return (
    <section id="quote-component" className="py-16 md:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {title && (
          <h2 className="font-sans font-bold text-2xl text-brand-blue mb-8 text-center">
            {title}
          </h2>
        )}
        {body && (
          <div className="flex gap-8 items-start">
            {img?.url && (
              <div className="flex-shrink-0">
                <Image
                  src={img.url}
                  alt={img.alt ?? ''}
                  width={150}
                  height={120}
                  className="object-contain"
                />
              </div>
            )}
            <div className="flex-1 font-sans text-base text-text-dark leading-relaxed text-center [&_p]:mb-4 [&_p]:text-center [&_strong]:text-brand-blue [&_strong]:font-bold">
              <RichText data={body as never} />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
