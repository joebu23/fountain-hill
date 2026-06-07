import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'

interface MediaRef {
  url?: string | null
  alt?: string | null
}

interface IconItem {
  icon?: MediaRef | number | null
  title: string
  body?: Record<string, unknown> | null
}

interface IconDisplayProps {
  title?: string | null
  items?: IconItem[] | null
}

export function IconDisplay({ title, items }: IconDisplayProps) {
  if (!items || items.length === 0) return null

  return (
    <section className="py-4 md:py-8 bg-white">
      <div className="max-w-6xl mx-auto">
        {title && (
          <h2 className="font-sans font-bold text-2xl text-brand-blue mb-1 text-center">
            {title}
          </h2>
        )}
        <div className="grid grid-cols-2 lg:flex lg:flex-row lg:items-stretch">
          {items.flatMap((item, i) => {
            const icon =
              typeof item.icon === 'object' && item.icon !== null
                ? (item.icon as MediaRef)
                : null

            return [
              <div key={i} className="flex-1 flex flex-col items-center text-center py-6 px-4">
                {icon?.url ? (
                  <Image
                    src={icon.url}
                    alt={icon.alt ?? item.title}
                    width={135}
                    height={135}
                    className="object-contain mb-4"
                  />
                ) : (
                  <div className="w-[135px] h-[135px] rounded-full bg-brand-navy flex items-center justify-center mb-4 flex-shrink-0">
                    <span className="text-white text-2xl font-bold">
                      {item.title.charAt(0)}
                    </span>
                  </div>
                )}
                <h3 className="font-sans font-bold text-brand-blue text-[28px] leading-tight mb-4 max-w-[250px]">
                  {item.title}
                </h3>
                {item.body && (
                  <div className="font-sans text-[20px] text-brand-navy leading-relaxed max-w-[250px] [&_p]:mb-2 [&_p]:text-center text-center">
                    <RichText data={item.body as never} />
                  </div>
                )}
              </div>,
              ...(i < items.length - 1
                ? [
                    <div
                      key={`divider-${i}`}
                      className="hidden lg:block w-[2px] bg-brand-navy opacity-30 self-stretch mt-[151px] mb-6"
                    />,
                  ]
                : []),
            ]
          })}
        </div>
      </div>
    </section>
  )
}
