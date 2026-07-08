/**
 * Upscale gallery & experience images (2x + cinematic color enhancement).
 * Originals are backed up to public/images/_originals/
 *
 * When Higgsfield media_upload is available, prefer 4K upscale via MCP.
 */
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const imagesDir = path.join(root, "public", "images");
const backupDir = path.join(imagesDir, "_originals");

const FILES = [
  "interior-dining-banquette.png",
  "interior-feather-art.png",
  "bar-bonsai-night.png",
  "interior-pendant-room.png",
  "exterior-firewater-city.png",
  "exterior-terrace-night.png",
  "interior-banquette-windows.png",
  "interior-winecart-dusk.png",
  "interior-bonsai-window.png",
  "bar-stools-night.png",
  "interior-banquette-garden.png",
  "venue-pool-night.png",
];

async function upscaleOne(filename) {
  const input = path.join(imagesDir, filename);
  if (!fs.existsSync(input)) {
    console.warn(`Skip missing: ${filename}`);
    return;
  }

  fs.mkdirSync(backupDir, { recursive: true });
  const backup = path.join(backupDir, filename);
  if (!fs.existsSync(backup)) {
    fs.copyFileSync(input, backup);
  }

  const meta = await sharp(input).metadata();
  const w = meta.width ?? 1200;
  const h = meta.height ?? 800;
  const targetW = Math.min(Math.round(w * 2), 3840);
  const targetH = Math.round(h * (targetW / w));
  const tmp = `${input}.upscale.tmp`;

  await sharp(input)
    .resize(targetW, targetH, {
      kernel: sharp.kernel.lanczos3,
      withoutEnlargement: false,
    })
    .modulate({ saturation: 1.14, brightness: 1.04 })
    .sharpen({ sigma: 0.65, m1: 0.5, m2: 0.35 })
    .png({ compressionLevel: 6, quality: 95, effort: 10 })
    .toFile(tmp);

  fs.renameSync(tmp, input);
  const out = await sharp(input).metadata();
  const before = fs.statSync(backup).size;
  const after = fs.statSync(input).size;
  console.log(
    `${filename}: ${w}x${h} -> ${out.width}x${out.height} (${Math.round(before / 1024)}KB -> ${Math.round(after / 1024)}KB)`
  );
}

async function main() {
  console.log("Upscaling gallery & experience images...\n");
  for (const file of FILES) {
    await upscaleOne(file);
  }
  console.log("\nDone. Originals saved in public/images/_originals/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
