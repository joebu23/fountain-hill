'use client'

import { useState } from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'

interface FAQItem {
  id?: string | null
  question: string
  answer?: Record<string, unknown> | null
}

interface FAQAccordionProps {
  heading: string
  subheading?: string
  items: FAQItem[] | string[]
}

function FAQRow({ item }: { item: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 text-left gap-4"
        aria-expanded={isOpen}
      >
        <span className="font-sans font-bold text-brand-blue text-sm md:text-base leading-snug">
          {item.question}
        </span>
        <span
          className="text-brand-orange text-2xl font-bold flex-shrink-0 transition-transform duration-300"
          aria-hidden="true"
        >
          {isOpen ? '−' : '+'}
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px]' : 'max-h-0'}`}
      >
        {item.answer && (
          <div className="font-sans text-text-dark text-sm leading-relaxed pb-5 [&_p]:mb-3">
            <RichText data={item.answer as never} />
          </div>
        )}
      </div>
    </div>
  )
}

export function FAQAccordion({ heading, subheading, items }: FAQAccordionProps) {
  const resolvedItems = (items as unknown[]).filter(
    (item): item is FAQItem => typeof item === 'object' && item !== null,
  )

  if (resolvedItems.length === 0) return null

  return (
    <section className="py-16 md:py-24 bg-surface-light">
      <div className="max-w-3xl mx-auto px-4 md:px-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="block w-6 h-6 rounded-full bg-brand-orange flex-shrink-0" aria-hidden="true" />
          <h2 className="font-sans font-extrabold text-4xl md:text-5xl text-text-dark">
            {heading}
          </h2>
        </div>
        {subheading && (
          <p className="font-sans text-text-muted text-base mb-10">{subheading}</p>
        )}

        <div>
          {resolvedItems.map((item, i) => (
            <FAQRow key={item.id ?? i} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
