import 'dotenv/config';
import fs from 'node:fs';

import World from '#lostcity/engine/World.ts';

import TcpServer from '#lostcity/server/TcpServer.ts';
import WSServer from '#lostcity/server/WSServer.ts';

import Environment from '#lostcity/util/Environment.ts';

import { startWeb } from '#lostcity/web/app.js';

if (!fs.existsSync('.env')) {
    console.error('Missing .env file');
    console.error('Please make sure you have a .env file in the main directory, copy and rename .env.example if you don\'t have one');
    Deno.exit(1);
}

fs.mkdirSync('data/players', { recursive: true });

if (fs.existsSync('dump')) {
    fs.rmSync('dump', { recursive: true, force: true });
    fs.mkdirSync('dump', { recursive: true });
}

await World.start();

startWeb();

const tcpServer = new TcpServer();
tcpServer.start();

const wsServer = new WSServer();
wsServer.start();

let exiting = false;
Deno.addSignalListener('SIGINT', function() {
    if (exiting) {
        return;
    }

    exiting = true;
    if (Environment.LOCAL_DEV) {
        World.shutdownTick = World.currentTick;
    } else {
        World.shutdownTick = World.currentTick + (Environment.SHUTDOWN_TIMER as number);
    }
});
