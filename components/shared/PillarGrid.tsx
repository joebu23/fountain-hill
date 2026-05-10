import Image from 'next/image'

interface MediaRef {
  url?: string | null
  alt?: string | null
}

interface Pillar {
  icon?: MediaRef | null
  label: string
  description: string
}

interface PillarGridProps {
  pillars: Pillar[]
}

export function PillarGrid({ pillars }: PillarGridProps) {
  if (!pillars || pillars.length === 0) return null

  return (
    <section className="py-16 md:py-20 bg-white border-y border-gray-100">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          {pillars.map((pillar, i) => (
            <div key={i} className="flex flex-col items-center text-center py-8 md:py-4 px-6">
              <div className="w-20 h-20 rounded-full bg-[#1E3259] flex items-center justify-center mb-5 flex-shrink-0">
                {pillar.icon?.url ? (
                  <Image
                    src={pillar.icon.url}
                    alt={pillar.icon.alt ?? pillar.label}
                    width={44}
                    height={44}
                    className="object-contain invert"
                  />
                ) : (
                  <span className="text-white text-2xl font-bold">{pillar.label.charAt(0)}</span>
                )}
              </div>
              <h3 className="font-sans font-bold text-brand-orange text-xl mb-3">{pillar.label}</h3>
              <p className="font-sans text-text-dark text-sm leading-relaxed">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
