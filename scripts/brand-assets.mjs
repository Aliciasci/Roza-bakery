/**
 * Génère les visuels du logo à partir de l'original (src/assets/logo-roza.jpeg) :
 * - public/brand/logo-roza.png    logo détouré (fond transparent), 640 px
 * - src/app/icon.png              favicon, 96 px (transparent)
 * - src/app/apple-icon.png        icône iPhone, 180 px (fond crème — iOS n'accepte pas la transparence)
 *
 * Usage : node scripts/brand-assets.mjs   (à relancer si le logo change)
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const SRC = "src/assets/logo-roza.jpeg";
const CREAM = { r: 251, g: 247, b: 241, alpha: 1 };

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const idx = (x, y) => (y * W + x) * 4;
const bright = (i) => Math.min(data[i], data[i + 1], data[i + 2]);

// 1. Remplissage depuis les coins : le blanc extérieur devient transparent
const transparent = new Uint8Array(W * H);
const stack = [[0, 0], [W - 1, 0], [0, H - 1], [W - 1, H - 1]];
while (stack.length) {
  const [x, y] = stack.pop();
  if (x < 0 || y < 0 || x >= W || y >= H) continue;
  const k = y * W + x;
  if (transparent[k] || bright(idx(x, y)) < 236) continue;
  transparent[k] = 1;
  stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
}

// 2. Bord adouci : les pixels clairs voisins du vide deviennent semi-transparents
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const k = y * W + x;
    const i = k * 4;
    if (transparent[k]) {
      data[i + 3] = 0;
      continue;
    }
    const nearEdge =
      (x > 0 && transparent[k - 1]) || (x < W - 1 && transparent[k + 1]) || (y > 0 && transparent[k - W]) || (y < H - 1 && transparent[k + W]);
    if (nearEdge) {
      const b = bright(i);
      if (b > 200) data[i + 3] = Math.round(255 * Math.min(1, (255 - b) / 55));
    }
  }
}

const cut = sharp(data, { raw: { width: W, height: H, channels: 4 } }).png();
const trimmed = await sharp(await cut.toBuffer()).trim({ threshold: 0 }).toBuffer();

// Carré centré
const meta = await sharp(trimmed).metadata();
const side = Math.max(meta.width, meta.height);
const square = await sharp(trimmed)
  .extend({
    top: Math.floor((side - meta.height) / 2),
    bottom: Math.ceil((side - meta.height) / 2),
    left: Math.floor((side - meta.width) / 2),
    right: Math.ceil((side - meta.width) / 2),
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();

mkdirSync("public/brand", { recursive: true });
await sharp(square).resize(640, 640).png({ compressionLevel: 9 }).toFile("public/brand/logo-roza.png");
await sharp(square).resize(96, 96).png({ compressionLevel: 9 }).toFile("src/app/icon.png");
await sharp(square)
  .resize(156, 156)
  .extend({ top: 12, bottom: 12, left: 12, right: 12, background: CREAM })
  .flatten({ background: CREAM })
  .png({ compressionLevel: 9 })
  .toFile("src/app/apple-icon.png");

console.log(`logo ${meta.width}×${meta.height} → carré ${side} px ; fichiers générés.`);
