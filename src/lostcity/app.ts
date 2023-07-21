import 'dotenv/config';
import fs from 'fs';

import { startWeb } from '#lostcity/web/app.js';
import World from '#lostcity/engine/World.js';
import TcpServer from '#lostcity/server/TcpServer.js';
import WSServer from '#lostcity/server/WSServer.js';

if (typeof process.env.GAME_PORT === 'undefined') {
    console.error('Please copy .env.example to .env');
    process.exit(1);
}

if (typeof process.env.DB_BACKEND === 'undefined') {
    console.error('Please re-copy .env.example to .env');
    process.exit(1);
}

fs.mkdirSync('data/players', { recursive: true });

if (!process.env.STANDALONE_WEB) {
    startWeb();
}

World.start();

const tcpServer = new TcpServer();
tcpServer.start();

const wsServer = new WSServer();
wsServer.start();
