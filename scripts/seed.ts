/**
 * Seed script — populates all CMS globals and collections from the Canva spec.
 * Run: npx tsx --env-file=.env scripts/seed.ts
 */

function richText(text: string) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: [
        {
          type: 'paragraph',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              mode: 'normal',
              text,
              type: 'text',
              format: 0,
              detail: 0,
              style: '',
              version: 1,
            },
          ],
        },
      ],
    },
  }
}

function richTextMultiple(paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        children: [
          {
            mode: 'normal',
            text,
            type: 'text',
            format: 0,
            detail: 0,
            style: '',
            version: 1,
          },
        ],
      })),
    },
  }
}

async function seed() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('../payload.config')
  const payload = await getPayload({ config })

  console.log('Seeding FAQ items...')
  const faqs = [
    {
      question: 'Will the giving be set up for two- or three-year commitments?',
      answer: richText(
        'Yes. We welcome multi-year pledge commitments and can work with donors to structure giving over two or three years to make it more manageable. Please contact our development team to discuss options.',
      ),
      sortOrder: 1,
    },
    {
      question: "What is the 'structure of ownership' of the corporation?",
      answer: richText(
        'Fountain Hill Center is structured as a nonprofit corporation. The board of directors provides governance oversight, and operations are led by our executive team. More details about our governance structure are available in our Case for Support document.',
      ),
      sortOrder: 2,
    },
    {
      question:
        'Why are campaign expenses estimated at $80,000 for a $1 million campaign? What does that cover?',
      answer: richText(
        'Campaign costs of $80,000 (8%) cover professional fundraising counsel, printed materials, digital outreach, donor stewardship events, and administrative support necessary to run a successful campaign. This is within the industry standard range of 5–10% for campaigns of this size and complexity. Every dollar raised beyond campaign costs goes directly to the projects described in this plan.',
      ),
      sortOrder: 3,
    },
  ]

  const createdFaqs: string[] = []
  for (const faq of faqs) {
    const existing = await payload.find({
      collection: 'faq-items',
      where: { question: { equals: faq.question } },
      limit: 1,
    })
    let id: string
    if (existing.docs.length > 0) {
      await payload.update({ collection: 'faq-items', id: existing.docs[0].id, data: faq })
      id = String(existing.docs[0].id)
      console.log(`  Updated FAQ: ${faq.question.slice(0, 60)}`)
    } else {
      const doc = await payload.create({ collection: 'faq-items', data: faq })
      id = String(doc.id)
      console.log(`  Created FAQ: ${faq.question.slice(0, 60)}`)
    }
    createdFaqs.push(id)
  }

  console.log('Seeding project components...')
  const projects = [
    {
      title: 'Client Assistance & Outreach',
      budgetAmount: 250000,
      description: richText(
        'Expanded therapeutic, assessment, and responsive community programs will reduce waitlists and meet growing demand. A dedicated fund will help bridge financial gaps, ensuring care remains accessible to all.',
      ),
      sortOrder: 1,
    },
    {
      title: 'Carriage House Expansion',
      budgetAmount: 200000,
      description: richText(
        'Expanded ADA Accessible space and resources will make care more accessible—physically, financially, emotionally, and culturally—so everyone seeking support can feel safe and welcomed.',
      ),
      sortOrder: 2,
    },
    {
      title: 'Bundy House Renovations',
      budgetAmount: 450000,
      description: richText(
        'Renovations and maintenance will safeguard the Heritage Hill home, a space that embodies comfort, continuity, and community for generations.',
      ),
      sortOrder: 3,
    },
    {
      title: 'Meditation Garden Addition',
      budgetAmount: 20000,
      description: richText(
        'By adding a quiet outdoor space designed for reflection and grounding, we offer our clients and community an additional place to support their mental health.',
      ),
      sortOrder: 4,
    },
    {
      title: 'Capital Campaign Costs',
      budgetAmount: 80000,
      description: richText(
        'Campaign costs include professional fundraising counsel, printed materials, digital outreach, donor stewardship events, and administrative support.',
      ),
      sortOrder: 5,
    },
  ]

  const createdProjects: string[] = []
  for (const project of projects) {
    const existing = await payload.find({
      collection: 'project-components',
      where: { title: { equals: project.title } },
      limit: 1,
    })
    let id: string
    if (existing.docs.length > 0) {
      await payload.update({ collection: 'project-components', id: existing.docs[0].id, data: project })
      id = String(existing.docs[0].id)
      console.log(`  Updated project: ${project.title}`)
    } else {
      const doc = await payload.create({ collection: 'project-components', data: project })
      id = String(doc.id)
      console.log(`  Created project: ${project.title}`)
    }
    createdProjects.push(id)
  }

  console.log('Seeding testimonials...')
  const testimonials = [
    {
      attribution: 'Anonymous Client',
      quote: richTextMultiple([
        'Our family has benefited from Fountain Hill Center for almost 15 years. We have worked with three or four different therapists over the years as our needs have changed including family counseling, individual counseling, and couples therapy.',
        'We have found that each of the therapists is incredibly capable and caring, and we are very thankful for the positive impact that FHC has had on our family. We look forward to many more years together with FHC therapists, and it is exciting to see how the organization continues to grow and make investments that will be critical over the next few years.',
      ]),
      featured: false,
    },
    {
      attribution: 'Rosalynn Bliss',
      attributionTitle: 'Former Grand Rapids Mayor',
      quote: richText(
        'With the new, expanded services, even more people in the community will have access to help and support. The need is great and Fountain Hill is rising to the challenge.',
      ),
      featured: true,
    },
  ]

  const createdTestimonials: string[] = []
  for (const t of testimonials) {
    const existing = await payload.find({
      collection: 'testimonials',
      where: { attribution: { equals: t.attribution } },
      limit: 1,
    })
    let id: string
    if (existing.docs.length > 0) {
      await payload.update({ collection: 'testimonials', id: existing.docs[0].id, data: t })
      id = String(existing.docs[0].id)
      console.log(`  Updated testimonial: ${t.attribution}`)
    } else {
      const doc = await payload.create({ collection: 'testimonials', data: t })
      id = String(doc.id)
      console.log(`  Created testimonial: ${t.attribution}`)
    }
    createdTestimonials.push(id)
  }

  const [clientTestimonialId, mayorTestimonialId] = createdTestimonials

  // campaign-settings already set; only update if givebutterCampaignId is not required
  console.log('Skipping campaign-settings (managed via admin).')

  console.log('Seeding campaign-page global...')
  await payload.updateGlobal({
    slug: 'campaign-page',
    data: {
      heroHeadline: 'HEALING takes COURAGE',
      heroSubheadline: richText(
        'At Fountain Hill Center, your support transforms that courage into hope—expanding care, preserving a place of belonging, and uplifting lives across West Michigan.',
      ),
      heroCTALabel: 'DONATE HERE',

      pillars: [
        { label: 'Healing', description: 'Compassionate care that meets people where they are.' },
        { label: 'Preservation', description: 'Honoring our historic home for future generations.' },
        { label: 'Growth', description: 'Expanding services to meet rising mental health needs.' },
      ],

      whoWeAreHeading: 'Who We Are',
      whoWeAreBody: richTextMultiple([
        'Fountain Hill Center is a nonprofit collective of therapists supporting personal and relational well-being through counseling, education, and community-based care.',
        'We operate with a collaborative model that emphasizes listening to the community, responding to genuine needs, and fostering both individual and community transformation.',
      ]),

      communityStatsHeading: 'The Need In Our Community',
      communityStats: [
        {
          statValue: 'Nearly 1 in 4 adults',
          statLabel: 'have been diagnosed with depression or anxiety in their lifetime.',
        },
        {
          statValue: '60%+ of adults',
          statLabel: 'with mental illness receive no treatment — often due to cost or access barriers.',
        },
        {
          statValue: '15 years',
          statLabel: 'Fountain Hill Center has served West Michigan families with compassionate, accessible care.',
        },
      ],

      servicesHeading: 'Who We Help With Our Available Services',
      servicesList: [
        { serviceName: 'Children' },
        { serviceName: 'Co-Parenting Support' },
        { serviceName: 'Couples Counseling' },
        { serviceName: 'Court Related Services' },
        { serviceName: 'Dialectical Behavior Therapy (DBT)' },
        { serviceName: 'Family Counseling' },
        { serviceName: 'Forensic Testing' },
        { serviceName: 'Group Counseling' },
        { serviceName: 'Individual Counseling' },
        { serviceName: "Men's Work" },
        { serviceName: 'Mindfulness Groups' },
        { serviceName: 'Psychological Testing & Evaluations' },
      ],
      servicesMissionStatement: richText(
        'We strive to ensure that healing is available to anyone, regardless of background or income, while fostering a sense of safety, trust, and belonging that reflects the best of our community.',
      ),
      servicesCTALabel: 'DONATE HERE',

      impactHeading: 'Impact at a Glance',
      impactMetrics: [
        {
          currentLabel: 'Currently: 21,000 Sessions',
          currentDescription:
            'Through counseling, assessments, consultations, and community-based programming were held in the most recent fiscal year.',
          projectedLabel: 'Your Impact: 3,500 Sessions',
          projectedDescription:
            'Through the expansion of clinical space, increased therapist capacity, and enhanced accessibility made possible by our capital campaign; our annual sessions are projected to increase by 17%.',
        },
        {
          currentLabel: 'Currently: 30 New Clients',
          currentDescription:
            'On average, 30 new clients per month begin services each month, reflecting both the urgency of need and the trust placed in our care.',
          projectedLabel: 'Your Impact: 100 New Clients',
          projectedDescription:
            'Through our expanded access to care, an increase of 28% will be served each year.',
        },
      ],
      impactTestimonial: clientTestimonialId,

      budgetHeading: '$1M Campaign Goal',
      budgetItems: [
        { label: 'Client Assistance & Outreach', amount: 250000 },
        { label: 'Carriage House Expansion (GR)', amount: 200000 },
        { label: 'Renovations to Historic Bundy House (GR)', amount: 450000 },
        { label: 'Addition of a Meditation Garden (GR)', amount: 20000 },
        { label: 'Campaign Costs', amount: 80000 },
      ],
      budgetBodyText: richText(
        'This campaign honors the past while building a future where care is accessible, timely, and deeply human.',
      ),
      budgetEndorsement: mayorTestimonialId,

      projectsHeading: 'Project Components',
      projects: createdProjects,

      faqHeading: 'FAQ',
      faqSubheading: 'Heart of the Hill Capital Campaign',
      faqItems: createdFaqs,

      closingHeading: 'A Personal Invitation',
      closingBody: richTextMultiple([
        'Every generation is shaped by the spaces it preserves and the values it chooses to uphold. By investing in Fountain Hill Center, you help ensure that compassionate, high-quality mental health care remains accessible — not just today, but for decades to come.',
        'Your generosity will leave a legacy of healing, one that continues to change lives, strengthen families, and nurture the well-being of our community.',
        'We invite you to partner with us in shaping this future.',
      ]),
      closingCTALabel: 'DONATE HERE',

      resourcesHeading: 'View more details in our Case for Support:',
      caseForSupportLabel: 'DOWNLOAD PDF HERE',
      historyPDFLabel: 'DOWNLOAD PDF HERE',
    },
  })

  console.log('Seeding site-settings global...')
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      orgName: 'Fountain Hill Center',
      campaignBadge: 'capital campaign',
      contactName: 'Sara Binkley',
      contactEmail: 'sara@fountainhillcenter.org',
      contactPhone: '(616) 458-6174',
      emergencyServicesUrl: 'https://fountainhillcenter.org/emergency-services/',
    },
  })

  console.log('\n✓ Seed complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
