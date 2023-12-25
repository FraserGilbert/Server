import fs from 'node:fs';
import Packet from '#jagex2/io/Packet.ts';

import { unpackPix } from '#lostcity/util/PixUnpack.ts';

const dat = Packet.load('dump/logo.dat');
const idx = Packet.load('dump/index.dat');

const pix = unpackPix(dat, idx);
await pix.img.writeAsync('dump/logo.png');

const meta = `${pix.cropX},${pix.cropY},${pix.width},${pix.height},${pix.pixelOrder ? 'row' : 'column'}\n`;
fs.writeFileSync('dump/logo.opt', meta);
