import 'dotenv/config';
import path from 'path';

import Fastify from 'fastify';
import FormBody from '@fastify/formbody';
import Multipart from '@fastify/multipart';
import Autoload from '@fastify/autoload';
import Static from '@fastify/static';
import View from '@fastify/view';
import Cookie from '@fastify/cookie';
import Session from '@fastify/session';
import Cors from '@fastify/cors';
import ejs from 'ejs';

import Knex from 'knex';
import { Model } from 'objection';

const fastify = Fastify();

fastify.register(FormBody);
fastify.register(Multipart);

fastify.register(Autoload, {
    dir: path.join(process.cwd(), 'src', 'lostcity', 'web', 'routes')
});

fastify.register(Static, {
    root: path.join(process.cwd(), 'public')
});

fastify.register(View, {
    engine: {
        ejs
    },
    root: path.join(process.cwd(), 'view'),
    viewExt: 'ejs'
});

fastify.register(Cookie);
fastify.register(Session, {
    secret: 'qxG38pWSAW5u6XS5pJS7jrSqwxbFgQdH',
    cookie: {
        secure: false
    }
});

fastify.register(Cors, {
    origin: '*',
    methods: ['GET']
});

Model.knex(Knex({
	// debug: true,
	client: process.env.DB_BACKEND,
	useNullAsDefault: process.env.DB_BACKEND === 'sqlite' ? true : undefined,
	connection: {
		// sqlite only
		filename: process.env.DB_FILE,

		// mysql only
		host: process.env.DB_HOST,
		port: 3306,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_NAME
	},
	pool: {
		min: 1, max: 4
	}
}));

export function startWeb() {
    fastify.listen({
        port: Number(process.env.WEB_PORT) ?? 0,
        host: '0.0.0.0'
    }, (err: Error | null, address: string) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        console.log(`[Web]: Listening on port ${Number(process.env.WEB_PORT)}`);
    });
}

if (process.env.STANDALONE_WEB) {
    if (typeof process.env.WEB_PORT === 'undefined') {
        console.error('Please copy .env.example to .env');
        process.exit(1);
    }

    startWeb();
}
