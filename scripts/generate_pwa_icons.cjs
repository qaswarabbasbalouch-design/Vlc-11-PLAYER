const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

function createCrcTable() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }
  return table;
}

const crcTable = createCrcTable();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function writeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = chunk.subarray(4, 8 + len);
  chunk.writeUInt32BE(crc32(typeAndData), 8 + len);
  return chunk;
}

function generatePng(width, height, isMaskable = false) {
  const scanlines = [];
  const cx = width / 2;
  const cy = height / 2;
  const r = (width / 2) * (isMaskable ? 0.95 : 0.85);

  // Play triangle vertices
  const p1x = cx - width * 0.12;
  const p1y = cy - height * 0.22;
  const p2x = cx + width * 0.22;
  const p2y = cy;
  const p3x = cx - width * 0.12;
  const p3y = cy + height * 0.22;

  function sign(p1_x, p1_y, p2_x, p2_y, p3_x, p3_y) {
    return (p1_x - p3_x) * (p2_y - p3_y) - (p2_x - p3_x) * (p1_y - p3_y);
  }

  function inTriangle(px, py) {
    const d1 = sign(px, py, p1x, p1y, p2x, p2y);
    const d2 = sign(px, py, p2x, p2y, p3x, p3y);
    const d3 = sign(px, py, p3x, p3y, p1x, p1y);
    const has_neg = (d1 < 0) || (d2 < 0) || (d3 < 0);
    const has_pos = (d1 > 0) || (d2 > 0) || (d3 > 0);
    return !(has_neg && has_pos);
  }

  for (let y = 0; y < height; y++) {
    const row = Buffer.alloc(1 + width * 4);
    row[0] = 0; // Filter None

    for (let x = 0; x < width; x++) {
      const idx = 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Check corner rounding
      const cornerR = width * 0.22;
      let inBox = false;
      const bx = Math.abs(dx);
      const by = Math.abs(dy);
      const half = width * (isMaskable ? 0.49 : 0.44);

      if (bx < half && by < half) {
        if (bx < half - cornerR || by < half - cornerR) {
          inBox = true;
        } else {
          const cdx = bx - (half - cornerR);
          const cdy = by - (half - cornerR);
          if (cdx * cdx + cdy * cdy <= cornerR * cornerR) {
            inBox = true;
          }
        }
      }

      if (inTriangle(x, y) && inBox) {
        // Pure White Play Button
        row[idx] = 255;
        row[idx + 1] = 255;
        row[idx + 2] = 255;
        row[idx + 3] = 255;
      } else if (inBox) {
        // Blue Gradient
        const t = y / height;
        row[idx] = Math.round(59 + (29 - 59) * t);    // R: #3b82f6 -> #1d4ed8
        row[idx + 1] = Math.round(130 + (78 - 130) * t); // G
        row[idx + 2] = Math.round(246 + (216 - 246) * t); // B
        row[idx + 3] = 255;
      } else {
        // Transparent
        row[idx] = 0;
        row[idx + 1] = 0;
        row[idx + 2] = 0;
        row[idx + 3] = isMaskable ? 255 : 0;
      }
    }
    scanlines.push(row);
  }

  const rawData = Buffer.concat(scanlines);
  const compressed = zlib.deflateSync(rawData);

  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const chunks = [
    sig,
    writeChunk('IHDR', ihdr),
    writeChunk('IDAT', compressed),
    writeChunk('IEND', Buffer.alloc(0))
  ];

  return Buffer.concat(chunks);
}

const pubDir = path.resolve(__dirname, '../public');
if (!fs.existsSync(pubDir)) fs.mkdirSync(pubDir, { recursive: true });

fs.writeFileSync(path.join(pubDir, 'pwa-192x192.png'), generatePng(192, 192));
fs.writeFileSync(path.join(pubDir, 'pwa-512x512.png'), generatePng(512, 512));
fs.writeFileSync(path.join(pubDir, 'pwa-maskable-512x512.png'), generatePng(512, 512, true));
fs.writeFileSync(path.join(pubDir, 'apple-touch-icon.png'), generatePng(180, 180));
fs.writeFileSync(path.join(pubDir, 'favicon.ico'), generatePng(64, 64));

console.log('Successfully generated all PWA PNG icons!');
