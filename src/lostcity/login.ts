import 'dotenv/config';
import fs from 'node:fs';

import { LoginServer } from '#lostcity/server/LoginServer.ts';

if (!fs.existsSync('.env')) {
    console.error('Missing .env file');
    console.error('Please make sure you have a .env file in the main directory, copy and rename .env.example if you don\'t have one');
    Deno.exit(1);
}

if (!fs.existsSync('data/config/login.json')) {
    console.error('Missing login.json configuration');
    Deno.exit(1);
}

fs.mkdirSync('data/players', { recursive: true });

if (fs.existsSync('dump')) {
    fs.rmSync('dump', { recursive: true, force: true });
    fs.mkdirSync('dump', { recursive: true });
}

const login = new LoginServer();
login.start();
