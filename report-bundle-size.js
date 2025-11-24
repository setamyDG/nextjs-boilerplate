#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-console */

const gzipSize = require("gzip-size")
const mkdirp = require("mkdirp").sync
const fs = require("fs")
const path = require("path")

const BUILD_DIR = path.join(process.cwd(), ".next")

// 1. Sprawdź czy build istnieje
if (!fs.existsSync(path.join(BUILD_DIR, "build-manifest.json"))) {
  console.error("No Next.js build found – run `next build` first!")
  process.exit(1)
}

const buildManifest = require(path.join(BUILD_DIR, "build-manifest.json"))
const appManifest = require(path.join(BUILD_DIR, "app-build-manifest.json"))

// 2. Globalne chunk-i (rootMainFiles) – ładowane na każdej stronie
const globalChunks = buildManifest.rootMainFiles || []
const globalSizes = sumSizes(globalChunks)

// 3. Cache odczytów (żeby nie czytać dwa razy tych samych chunków)
const cache = new Map()

function getFileSize(filePath) {
  const fullPath = path.join(BUILD_DIR, filePath)
  if (cache.has(fullPath)) return cache.get(fullPath)

  const buffer = fs.readFileSync(fullPath)
  const raw = buffer.byteLength
  const gzip = gzipSize.sync(buffer)
  cache.set(fullPath, { raw, gzip })
  return { raw, gzip }
}

function sumSizes(files) {
  return files.reduce(
    (acc, file) => {
      const { raw, gzip } = getFileSize(file)
      acc.raw += raw
      acc.gzip += gzip
      return acc
    },
    { raw: 0, gzip: 0 }
  )
}

const result = { __global: globalSizes }

for (const [page, files] of Object.entries(appManifest.pages)) {
  // Odejmujemy globalne chunk-i – nie chcemy ich liczyć drugi raz
  const pageSpecificFiles = files.filter((f) => !globalChunks.includes(f))
  result[page] = sumSizes(pageSpecificFiles)
}

mkdirp(path.join(BUILD_DIR, "analyze"))
fs.writeFileSync(path.join(BUILD_DIR, "analyze/__bundle_analysis.json"), JSON.stringify(result, null, 2))

console.log("Bundle analysis (App Router only)")
console.log(`Global bundle: ${format(globalSizes.gzip)} (gzip)`)
console.log(`Pages analyzed: ${Object.keys(appManifest.pages).length}`)
console.log(
  `Total initial JS (first load): ${format(globalSizes.gzip + Object.values(result).reduce((a, b) => a + (b.gzip || 0), 0) - globalSizes.gzip)} (gzip)`
)

function format(bytes) {
  const kb = bytes / 1024
  return kb < 1024 ? `${kb.toFixed(1)} kB` : `${(kb / 1024).toFixed(2)} MB`
}
