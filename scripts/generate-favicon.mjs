import fs from 'node:fs';
import path from 'node:path';

// Generate a 32x32 32-bit BMP ICO format
const width = 32;
const height = 32;
const bpp = 32;

// ICO Header (6 bytes)
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: 1 = ICO
header.writeUInt16LE(1, 4); // count: 1 image

// BITMAPINFOHEADER for ICO (40 bytes)
const biHeader = Buffer.alloc(40);
biHeader.writeUInt32LE(40, 0); // biSize
biHeader.writeInt32LE(width, 4); // biWidth
biHeader.writeInt32LE(height * 2, 8); // biHeight (doubled for XOR + AND mask in ICO)
biHeader.writeUInt16LE(1, 12); // biPlanes
biHeader.writeUInt16LE(bpp, 14); // biBitCount (32 bpp ARGB)
biHeader.writeUInt32LE(0, 16); // biCompression (BI_RGB)

const xorSize = width * height * 4;
const andRowBytes = Math.ceil(width / 32) * 4;
const andSize = andRowBytes * height;
const imageSize = 40 + xorSize + andSize;

biHeader.writeUInt32LE(imageSize, 20); // biSizeImage

// Directory Entry (16 bytes)
const entry = Buffer.alloc(16);
entry.writeUInt8(width, 0); // width
entry.writeUInt8(height, 1); // height
entry.writeUInt8(0, 2); // color count
entry.writeUInt8(0, 3); // reserved
entry.writeUInt16LE(1, 4); // planes
entry.writeUInt16LE(bpp, 6); // bit count
entry.writeUInt32LE(imageSize, 8); // image size
entry.writeUInt32LE(22, 12); // offset (6 + 16 = 22)

// XOR Image Data (bottom-up BGRA)
const xorData = Buffer.alloc(xorSize);
// Colors in BGRA:
// Background: Forest Green #24483A -> B: 0x3A, G: 0x48, R: 0x24, A: 0xFF
// Text/Border: Light Sage #A1B49C -> B: 0x9C, G: 0xB4, R: 0xA1, A: 0xFF
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = (y * width + x) * 4;
    // Rounded corner check
    const isCorner =
      (x < 3 && y < 3) ||
      (x > 28 && y < 3) ||
      (x < 3 && y > 28) ||
      (x > 28 && y > 28);
    
    if (isCorner) {
      xorData[idx] = 0; // B
      xorData[idx + 1] = 0; // G
      xorData[idx + 2] = 0; // R
      xorData[idx + 3] = 0; // Transparent
    } else {
      // Draw border or background
      const isBorder = x === 0 || x === 31 || y === 0 || y === 31;
      if (isBorder) {
        xorData[idx] = 0x9C;
        xorData[idx + 1] = 0xB4;
        xorData[idx + 2] = 0xA1;
        xorData[idx + 3] = 0xFF;
      } else {
        xorData[idx] = 0x3A; // B
        xorData[idx + 1] = 0x48; // G
        xorData[idx + 2] = 0x24; // R
        xorData[idx + 3] = 0xFF; // A
      }
    }
  }
}

// AND mask (all 0 for opaque pixels)
const andData = Buffer.alloc(andSize, 0);

const icoBuffer = Buffer.concat([header, entry, biHeader, xorData, andData]);
fs.writeFileSync(path.resolve('public/favicon.ico'), icoBuffer);
console.log('Successfully created public/favicon.ico (' + icoBuffer.length + ' bytes)');
