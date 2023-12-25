import fs from 'node:fs';

import 'dotenv/config';

import { startWeb } from '#lostcity/web/app.ts';

fs.mkdirSync('data/players', { recursive: true });

startWeb();
