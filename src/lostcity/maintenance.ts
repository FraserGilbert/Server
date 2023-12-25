import 'dotenv/config';

import { startWeb } from '#lostcity/web/app.ts';

startWeb();

import TcpMaintenanceServer from '#lostcity/server/TcpMaintenanceServer.ts';
import WSMaintenanceServer from '#lostcity/server/WSMaintenanceServer.ts';

import Environment from '#lostcity/util/Environment.ts';

if (Environment.LOCAL_DEV) {
    console.error('GAME_PORT is not defined in .env');
    console.error('Please make sure you have a .env file in the server root directory, copy it from .env.example if you don\'t have one');
    Deno.exit(1);
}

const tcpServer = new TcpMaintenanceServer();
tcpServer.start();

const wsServer = new WSMaintenanceServer();
wsServer.start();
