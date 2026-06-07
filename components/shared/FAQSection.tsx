'use client'
import { useState } from 'react'
import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'

interface MediaRef {
  url?: string | null
  alt?: string | null
}

interface FAQItem {
  question: string
  answer?: Record<string, unknown> | null
}

interface FAQSectionProps {
  icon?: MediaRef | null
  title?: string | null
  subtitle?: string | null
  titleImage?: MediaRef | null
  faqs?: FAQItem[] | null
}

export function FAQSection({ icon, title, subtitle, titleImage, faqs }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (!faqs || faqs.length === 0) return null

  return (
    <section className="bg-white py-4 overflow-hidden">

      {/* Header: left text block aligned with page container, image extends to right viewport edge */}
      <div className="relative flex flex-col md:flex-row items-stretch mb-12">
        {/* Left block — padded to match container left edge, fixed width so image can bleed right */}
        <div className="flex-shrink-0 md:w-[42%] flex flex-col justify-center py-[6.5rem] px-4 md:pl-[max(2rem,calc((100vw-72rem)/2+2rem))] md:pr-10">
          <div className="flex items-center gap-3 mb-3">
            {icon?.url && (
              <Image src={icon.url} alt={icon.alt ?? ''} width={56} height={56} className="object-contain flex-shrink-0" />
            )}
            {title && (
              <h2 className="font-sans font-extrabold text-brand-orange text-[56px] leading-none">
                {title}
              </h2>
            )}
          </div>
          {subtitle && (
            <p className="font-sans font-bold text-brand-blue text-2xl leading-snug">
              {subtitle}
            </p>
          )}
        </div>

        {/* Image — fills remaining width, bleeds to right viewport edge */}
        {titleImage?.url && (
          <div className="flex-1 relative">
            <Image
              src={titleImage.url}
              alt={titleImage.alt ?? ''}
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>

      {/* FAQ list */}
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="divide-y divide-gray-200">
          {faqs.map((item, i) => (
            <div key={i}>
              <button
                className="w-full flex items-center gap-4 py-4 text-left"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center">
                  <span className="text-white font-bold text-lg leading-none">
                    {openIndex === i ? '−' : '+'}
                  </span>
                </span>
                <span className="font-sans font-semibold text-brand-blue text-lg">
                  {item.question}
                </span>
              </button>
              {openIndex === i && item.answer && (
                <div className="pl-12 pb-4 font-sans text-text-dark text-base leading-relaxed">
                  <RichText data={item.answer as never} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}
