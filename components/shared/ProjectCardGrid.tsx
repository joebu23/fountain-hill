import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'

interface MediaRef {
  url?: string | null
  alt?: string | null
}

interface ProjectComponent {
  id?: string | null
  title: string
  icon?: MediaRef | null
  budgetAmount?: number | null
  description?: Record<string, unknown> | null
}

interface ProjectCardGridProps {
  heading: string
  projects: ProjectComponent[] | string[]
}

function formatCurrency(amount: number) {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}

export function ProjectCardGrid({ heading, projects }: ProjectCardGridProps) {
  const resolvedProjects = (projects as unknown[]).filter(
    (p): p is ProjectComponent => typeof p === 'object' && p !== null,
  )

  if (resolvedProjects.length === 0) return null

  const first3 = resolvedProjects.slice(0, 3)
  const last2 = resolvedProjects.slice(3, 5)

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {heading && (
          <h2 className="font-sans uppercase tracking-widest text-sm text-brand-blue font-semibold text-center mb-10">
            {heading}
          </h2>
        )}

        <div className="space-y-6">
          {first3.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {first3.map((project, i) => (
                <ProjectCard key={project.id ?? i} project={project} />
              ))}
            </div>
          )}
          {last2.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:max-w-2xl md:mx-auto">
              {last2.map((project, i) => (
                <ProjectCard key={project.id ?? i + 3} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project }: { project: ProjectComponent }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full bg-brand-orange flex items-center justify-center mb-4 flex-shrink-0">
        {project.icon?.url ? (
          <Image
            src={project.icon.url}
            alt={project.icon.alt ?? project.title}
            width={36}
            height={36}
            className="object-contain"
          />
        ) : (
          <span className="text-white text-xl font-bold">{project.title.charAt(0)}</span>
        )}
      </div>
      <h3 className="font-sans font-bold text-brand-orange text-base mb-1">{project.title}</h3>
      {project.budgetAmount && (
        <p className="font-sans font-semibold text-brand-orange text-sm mb-3">
          {formatCurrency(project.budgetAmount)}
        </p>
      )}
      {project.description && (
        <div className="font-sans text-text-muted text-sm leading-relaxed">
          <RichText data={project.description as never} />
        </div>
      )}
    </div>
  )
}
