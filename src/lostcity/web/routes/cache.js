import fs from 'node:fs';
import { CrcBuffer } from '#lostcity/cache/CrcTable.ts';

export default function (f, opts, next) {
    if (!fs.existsSync('data/pack/client')) {
        next();
        return;
    }

    f.get('/crc:rand', async (req, res) => {
        res.header('Content-Type', 'application/octet-stream');
        return CrcBuffer.data;
    });

    f.get('/title:crc', async (req, res) => {
        return res.sendFile('data/pack/client/title', Deno.cwd());
    });

    f.get('/config:crc', async (req, res) => {
        return res.sendFile('data/pack/client/config', Deno.cwd());
    });

    f.get('/interface:crc', async (req, res) => {
        return res.sendFile('data/pack/client/interface', Deno.cwd());
    });

    f.get('/media:crc', async (req, res) => {
        return res.sendFile('data/pack/client/media', Deno.cwd());
    });

    f.get('/models:crc', async (req, res) => {
        return res.sendFile('data/pack/client/models', Deno.cwd());
    });

    f.get('/sounds:crc', async (req, res) => {
        return res.sendFile('data/pack/client/sounds', Deno.cwd());
    });

    f.get('/textures:crc', async (req, res) => {
        return res.sendFile('data/pack/client/textures', Deno.cwd());
    });

    f.get('/wordenc:crc', async (req, res) => {
        return res.sendFile('data/pack/client/wordenc', Deno.cwd());
    });

    let songs = fs.readdirSync('data/pack/client/songs');
    for (let i = 0; i < songs.length; i++) {
        let orig = songs[i].replace('.mid', '');
        f.get(`/${orig}_:crc`, async (req, res) => {
            return res.sendFile(`data/pack/client/songs/${songs[i]}`, Deno.cwd());
        });
    }

    next();
}
