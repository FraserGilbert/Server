import fs from 'fs';
import Jimp from 'jimp';

import Jagfile from '#jagex2/io/Jagfile.js';
import { pixSize, unpackPix } from '#lostcity/tools/unpack/Pix.js';
import { loadPack } from '#lostcity/tools/pack/NameMap.js';

let textures = Jagfile.load('data/pack/client/official/textures');
let pack = loadPack('data/pack/texture.pack');

fs.mkdirSync('data/src/textures/meta', { recursive: true });

let index = textures.read('index.dat');
for (let i = 0; i < textures.fileCount; i++) {
    if (textures.fileName[i] === 'index.dat') {
        continue;
    }

    let data = textures.read(textures.fileName[i]);
    let size = pixSize(data, index);
    console.log(textures.fileName[i], size.width + 'x' + size.height);

    let safeName = textures.fileName[i].replace('.dat', '');
    let texture = unpackPix(data, index);

    let realName = pack[safeName];
    await texture.img.writeAsync(`data/src/textures/${realName}.png`);

    // ----

    let meta = `${texture.cropX},${texture.cropY},${texture.width},${texture.height},${texture.pixelOrder ? 'row' : 'column'}\n`;
    fs.writeFileSync(`data/src/textures/meta/${realName}.opt`, meta);

    // ----

    // let palette = new Jimp(16, 16);
    // palette.background(0x00000000);

    // for (let j = 1; j < texture.palette.length; j++) {
    //     let x = j % 16;
    //     let y = Math.floor(j / 16);
    //     let color = texture.palette[j];
    //     if (color === 1) {
    //         color = 0;
    //     }

    //     color <<= 8; // shift color over to fit alpha
    //     color |= 0x000000FF; // alpha channel
    //     color >>>= 0; // unsigned shift

    //     palette.setPixelColor(color, x, y);
    // }

    // await palette.writeAsync(`data/src/textures/meta/${realName}.pal.png`);
}
