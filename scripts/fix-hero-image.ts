async function fixHeroImage() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('../payload.config')
  const payload = await getPayload({ config })

  const media = await payload.find({
    collection: 'media',
    where: { filename: { like: 'width_2048' } },
    limit: 1,
  })

  if (media.docs.length === 0) {
    console.log('No matching media found. Listing all media:')
    const all = await payload.find({ collection: 'media', limit: 20 })
    all.docs.forEach((m) => console.log(' ', m.id, m.filename, m.url))
    process.exit(1)
  }

  const heroMedia = media.docs[0]
  console.log(`Found media: ${heroMedia.id} — ${heroMedia.filename} — ${heroMedia.url}`)

  await payload.updateGlobal({
    slug: 'campaign-page',
    data: { heroImage: heroMedia.id },
  })

  console.log('✓ heroImage set on campaign-page global')
  process.exit(0)
}

fixHeroImage().catch((err) => {
  console.error(err)
  process.exit(1)
})
