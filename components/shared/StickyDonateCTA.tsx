'use client'

import { useEffect, useState } from 'react'

interface StickyDonateCTAProps {
  donateUrl: string
}

export function StickyDonateCTA({ donateUrl }: StickyDonateCTAProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('sticky-cta-dismissed') === 'true') {
      setIsDismissed(true)
      return
    }

    const handleScroll = () => {
      setIsVisible(window.scrollY > 400)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (isDismissed || !isVisible) return null

  return (
    <>
      {/* Mobile: full-width bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center bg-brand-orange">
        <a
          href={donateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center text-white font-sans font-semibold uppercase tracking-wide py-4 text-sm"
        >
          Donate Here
        </a>
        <button
          onClick={() => {
            sessionStorage.setItem('sticky-cta-dismissed', 'true')
            setIsDismissed(true)
          }}
          className="px-4 py-4 text-white/80 hover:text-white text-xl leading-none"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>

      {/* Desktop: pill button */}
      <div className="hidden md:flex fixed right-4 bottom-8 z-50 items-center gap-2">
        <a
          href={donateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-brand-orange text-white rounded-full px-6 py-3 font-sans font-semibold uppercase tracking-wide text-sm hover:bg-orange-600 transition-colors shadow-lg"
        >
          Donate Here
        </a>
        <button
          onClick={() => {
            sessionStorage.setItem('sticky-cta-dismissed', 'true')
            setIsDismissed(true)
          }}
          className="bg-white rounded-full w-8 h-8 flex items-center justify-center text-text-muted hover:text-text-dark shadow-lg text-lg leading-none"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </>
  )
}
