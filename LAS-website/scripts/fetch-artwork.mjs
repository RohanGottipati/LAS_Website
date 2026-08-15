/**
 * Downloads the public-domain (CC0) artwork used across the homepage from The
 * Metropolitan Museum of Art open-access collection, crops each piece to the
 * aspect ratio the layout needs and writes optimised WebP files into
 * `public/art`, plus a `credits.json` used by the site footer.
 *
 * Usage: npm run art:fetch
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const outDir = path.join(root, 'public', 'art')
const manifest = JSON.parse(
  await fs.readFile(path.join(import.meta.dirname, 'artwork.manifest.json'), 'utf8'),
)

const HEADERS = { 'User-Agent': 'LAS-Club-Website/1.0 (artwork build script)' }

async function fetchJson(url) {
  const res = await fetch(url, { headers: HEADERS })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`)
  return res.json()
}

async function fetchBuffer(url) {
  const res = await fetch(url, { headers: HEADERS })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`)
  return Buffer.from(await res.arrayBuffer())
}

await fs.mkdir(outDir, { recursive: true })

const credits = []
for (const asset of manifest.assets) {
  const object = await fetchJson(`${manifest.source}/objects/${asset.objectId}`)
  if (!object.isPublicDomain) {
    throw new Error(`Object ${asset.objectId} (${object.title}) is not public domain`)
  }
  const sources = [object.primaryImage, object.primaryImageSmall].filter(Boolean)
  if (sources.length === 0) throw new Error(`Object ${asset.objectId} has no image`)

  let buffer
  for (const source of sources) {
    try {
      buffer = await fetchBuffer(source)
      break
    } catch (error) {
      console.warn(`  retrying ${asset.name}: ${error.message}`)
    }
  }
  if (!buffer) throw new Error(`Could not download any image for ${asset.name}`)
  const file = path.join(outDir, `${asset.name}.webp`)
  await sharp(buffer)
    .resize(asset.width, asset.height, { fit: 'cover', position: asset.position ?? 'centre' })
    .webp({ quality: 82 })
    .toFile(file)

  credits.push({
    asset: asset.name,
    title: object.title,
    artist: object.artistDisplayName || 'Unknown',
    date: object.objectDate,
    museum: 'The Metropolitan Museum of Art',
    license: 'CC0 1.0 (Public Domain)',
    url: object.objectURL,
  })
  console.log(`${asset.name} <- ${object.title} (${object.artistDisplayName || 'Unknown'})`)
}

await fs.writeFile(
  path.join(outDir, 'credits.json'),
  `${JSON.stringify({ generatedBy: 'scripts/fetch-artwork.mjs', credits }, null, 2)}\n`,
)
console.log(`\n${credits.length} artworks written to public/art`)
process.exitCode = 0
