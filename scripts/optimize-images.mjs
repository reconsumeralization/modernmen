import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const imagesDir = path.resolve('public/images')
const outputDir = path.resolve('public/images/optimized')
const manifestPath = path.resolve('public/images/optimized/manifest.json')

/**
 * Map original filenames to SEO-friendly slugs.
 * If a file isn't in the map, fall back to a generic name with index.
 */
const slugMap = {
  'noname.jpg': 'barbershop-modern-cut-before-after',
  'noname_1.jpg': 'skin-fade-detail-razor-finish',
  'noname_2.jpg': 'beard-trim-line-up-hot-towel',
  'noname_3.jpg': 'hot-towel-shave-classic-ritual',
  'noname_4.jpg': 'taper-fade-clean-edges',
  'noname_5.jpg': 'kids-cut-clean-style',
  'noname_6.jpg': 'buzz-cut-clipper-only',
  'noname_7.jpg': 'barber-chair-interior-cinematic',
  'noname_8.jpg': 'barbershop-tools-scissors-comb',
  'noname_9.jpg': 'before-after-slider-result',
  'noname_10.jpg': 'modernmen-regina-exterior-sign'
}

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

const toSlug = (str) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

async function processImage(file) {
  const srcPath = path.join(imagesDir, file)
  const baseSlug = slugMap[file] || toSlug(path.parse(file).name)
  const baseName = baseSlug || 'modernmen-image'

  const image = sharp(srcPath).rotate()
  const metadata = await image.metadata()

  const targets = [
    { suffix: 'lg', width: 1600 },
    { suffix: 'md', width: 1200 },
    { suffix: 'sm', width: 800 },
    { suffix: 'xs', width: 500 }
  ]

  const out = { slug: baseName, sources: [] }

  for (const t of targets) {
    const webpName = `${baseName}-${t.suffix}.webp`
    const jpgName = `${baseName}-${t.suffix}.jpg`
    const webpPath = path.join(outputDir, webpName)
    const jpgPath = path.join(outputDir, jpgName)

    await image
      .resize({ width: t.width, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(webpPath)

    await image
      .resize({ width: t.width, withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(jpgPath)

    out.sources.push({
      size: t.suffix,
      webp: `images/optimized/${webpName}`,
      jpg: `images/optimized/${jpgName}`
    })
  }

  // Return tiny blur placeholder
  const blurData = await image
    .resize({ width: 24 })
    .webp({ quality: 30 })
    .toBuffer()

  out.blurDataURL = `data:image/webp;base64,${blurData.toString('base64')}`
  out.original = `images/${file}`
  out.meta = { width: metadata.width, height: metadata.height, format: metadata.format }
  return out
}

async function main() {
  ensureDir(outputDir)
  const files = fs
    .readdirSync(imagesDir)
    .filter((f) => /noname(_\d+)?\.jpg$/i.test(f))

  const results = []
  for (const f of files) {
    try {
      const r = await processImage(f)
      results.push({ file: f, ...r })
      console.log(`Optimized: ${f} -> ${r.slug}`)
    } catch (e) {
      console.error(`Failed: ${f}`, e)
    }
  }

  fs.writeFileSync(manifestPath, JSON.stringify({ generatedAt: new Date().toISOString(), items: results }, null, 2))
  console.log(`Manifest written: ${manifestPath}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})


