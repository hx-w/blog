#!/usr/bin/env node
/**
 * 图片压缩脚本
 * 用法: pnpm run compress
 */

import sharp from 'sharp';
import { readdir, stat, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join, extname, relative } from 'path';

const IMAGES_DIR = 'public/images';
const SUPPORTED = ['.png', '.jpg', '.jpeg', '.webp'];

const CONFIG = {
  png: { compressionLevel: 9, palette: true },
  jpg: { quality: 85, mozjpeg: true },
  jpeg: { quality: 85, mozjpeg: true },
  webp: { quality: 85 },
};

async function getImages(dir) {
  const images = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) images.push(...await getImages(path));
    else if (SUPPORTED.includes(extname(entry.name).toLowerCase())) images.push(path);
  }
  return images;
}

async function compress(path) {
  const ext = extname(path).toLowerCase().slice(1);
  const config = CONFIG[ext];
  if (!config) return null;

  const before = (await stat(path)).size;
  if (before < 10240) return { skipped: true };

  const image = sharp(path);
  const buffer = await (ext === 'png' ? image.png(config)
    : ext === 'webp' ? image.webp(config)
    : image.jpeg(config)).toBuffer();

  if (buffer.length >= before) return { skipped: true };

  await writeFile(path, buffer);
  return { before, after: buffer.length };
}

function fmt(n) {
  const s = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(n) / Math.log(1024));
  return (n / Math.pow(1024, i)).toFixed(1) + ' ' + s[i];
}

async function main() {
  if (!existsSync(IMAGES_DIR)) {
    console.error('Error: public/images not found');
    process.exit(1);
  }

  const images = await getImages(IMAGES_DIR);
  console.log(`Found ${images.length} images\n`);

  let total = 0, count = 0, skip = 0, err = 0;

  for (const path of images) {
    const rel = relative(IMAGES_DIR, path);
    try {
      const r = await compress(path);
      if (r?.skipped) { skip++; continue; }
      if (r) {
        total += r.before - r.after;
        count++;
        console.log(`[${count}] ${rel}: ${fmt(r.before)} -> ${fmt(r.after)}`);
      }
    } catch (e) {
      err++;
      console.error(`[ERR] ${rel}: ${e.message}`);
    }
  }

  console.log(`\nDone. Compressed: ${count}, Skipped: ${skip}, Errors: ${err}, Saved: ${fmt(total)}`);
}

main().catch(e => { console.error(e.message); process.exit(1); });
