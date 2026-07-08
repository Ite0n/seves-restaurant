/**
 * Convert public PNG assets to WebP + AVIF.
 * Originals are backed up to public/images/_originals/ (preserving subpaths).
 */
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const imagesDir = path.join(root, "public", "images");
const backupDir = path.join(imagesDir, "_originals");

function collectPngs(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "_originals") continue;
      files.push(...collectPngs(full));
    } else if (entry.name.endsWith(".png")) {
      files.push(full);
    }
  }
  return files;
}

function formatKb(bytes) {
  return `${Math.round(bytes / 1024)}KB`;
}

async function convertOne(inputPath) {
  const rel = path.relative(imagesDir, inputPath);
  const isMenu = rel.startsWith(`menu${path.sep}`);
  const base = inputPath.slice(0, -4);
  const webpOut = `${base}.webp`;
  const avifOut = `${base}.avif`;

  const backup = path.join(backupDir, rel);
  fs.mkdirSync(path.dirname(backup), { recursive: true });
  if (!fs.existsSync(backup)) {
    fs.copyFileSync(inputPath, backup);
  }

  const meta = await sharp(inputPath).metadata();
  const width = meta.width ?? 1200;
  let targetWidth = width;

  if (isMenu) {
    targetWidth = Math.min(width, 1200);
  } else if (width > 2400) {
    targetWidth = 2400;
  }

  const resize =
    targetWidth < width
      ? { width: targetWidth, withoutEnlargement: true }
      : null;

  const webpQuality = isMenu ? 78 : 82;
  const avifQuality = isMenu ? 55 : 62;

  let webpPipeline = sharp(inputPath);
  let avifPipeline = sharp(inputPath);
  if (resize) {
    webpPipeline = webpPipeline.resize(resize);
    avifPipeline = avifPipeline.resize(resize);
  }

  await webpPipeline
    .webp({ quality: webpQuality, effort: 6 })
    .toFile(webpOut);
  await avifPipeline
    .avif({ quality: avifQuality, effort: 4 })
    .toFile(avifOut);

  const before = fs.statSync(inputPath).size;
  const webpSize = fs.statSync(webpOut).size;
  const avifSize = fs.statSync(avifOut).size;

  fs.unlinkSync(inputPath);

  console.log(
    `${rel}: ${width}px PNG ${formatKb(before)} -> WebP ${formatKb(webpSize)} / AVIF ${formatKb(avifSize)}`
  );

  return { before, webpSize, avifSize };
}

async function main() {
  const pngs = collectPngs(imagesDir);
  if (pngs.length === 0) {
    console.log("No PNG files found in public/images.");
    return;
  }

  console.log(`Converting ${pngs.length} PNG files to WebP + AVIF...\n`);

  let totalBefore = 0;
  let totalWebp = 0;
  let totalAvif = 0;

  for (const file of pngs) {
    const stats = await convertOne(file);
    totalBefore += stats.before;
    totalWebp += stats.webpSize;
    totalAvif += stats.avifSize;
  }

  console.log(
    `\nDone. PNG ${formatKb(totalBefore)} -> WebP ${formatKb(totalWebp)} (${Math.round((1 - totalWebp / totalBefore) * 100)}% smaller) / AVIF ${formatKb(totalAvif)} (${Math.round((1 - totalAvif / totalBefore) * 100)}% smaller)`
  );
  console.log(`Originals saved in public/images/_originals/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
