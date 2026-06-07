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
    <div id="campaign-goal-icons" className="grid grid-cols-2 lg:grid-cols-[1fr_2px_1fr_2px_1fr]">
      {pillars.flatMap((pillar, i) => [
        <div key={i} className="flex flex-col items-center text-center py-6 px-4">
          {pillar.icon?.url ? (
            <Image
              src={pillar.icon.url}
              alt={pillar.icon.alt ?? pillar.label}
              width={100}
              height={100}
              className="object-contain mb-4 flex-shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-brand-navy flex items-center justify-center mb-4 flex-shrink-0">
              <span className="text-white text-2xl font-bold">{pillar.label.charAt(0)}</span>
            </div>
          )}
          <div className="w-full">
            <h3 className="font-sans font-bold text-brand-navy text-3xl mb-3">{pillar.label}</h3>
            <p className="font-sans font-normal text-brand-navy text-base leading-relaxed">{pillar.description}</p>
          </div>
        </div>,
        ...(i < pillars.length - 1
          ? [
              <div key={`div-${i}`} className="hidden lg:flex flex-col pt-[140px] pb-6">
                <div className="flex-1 w-[2px] mx-auto bg-brand-navy" />
              </div>,
            ]
          : []),
      ])}
    </div>
  )
}
