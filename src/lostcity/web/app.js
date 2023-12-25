import path from 'node:path';

import Fastify from 'fastify';
import FormBody from '@fastify/formbody';
import Multipart from '@fastify/multipart';
import Static from '@fastify/static';
import View from '@fastify/view';
import Cookie from '@fastify/cookie';
import Session from '@fastify/session';
import Cors from '@fastify/cors';
import ejs from 'ejs';

import Environment from '#lostcity/util/Environment.ts';

let fastify = Fastify();

fastify.register(FormBody);
fastify.register(Multipart);

fastify.register(Static, {
    root: path.join(Deno.cwd(), 'public')
});

fastify.register(View, {
    engine: {
        ejs
    },
    root: path.join(Deno.cwd(), 'view'),
    viewExt: 'ejs'
});

fastify.register(Cookie);
fastify.register(Session, {
    secret: 'qxG38pWSAW5u6XS5pJS7jrSqwxbFgQdH',
    cookie: {
        secure: false
    }
});

if (!Environment.SKIP_CORS) {
    fastify.register(Cors, {
        origin: '*',
        methods: ['GET']
    });
}

// ugh no autoloader :(
fastify.register(import('./routes/about/index.js'), { prefix: '/about' });
fastify.register(import('./routes/api/v1/world.js'), { prefix: '/api/v1/world' });
fastify.register(import('./routes/faq/index.js'), { prefix: '/faq' });
fastify.register(import('./routes/guides/index.js'), { prefix: '/guides' });
fastify.register(import('./routes/hiscores/index.js'), { prefix: '/hiscores' });
fastify.register(import('./routes/members/index.js'), { prefix: '/members' });
fastify.register(import('./routes/news/index.js'), { prefix: '/news' });
fastify.register(import('./routes/polls/index.js'), { prefix: '/polls' });
fastify.register(import('./routes/rs2/index.js'), { prefix: '/rs2' });
fastify.register(import('./routes/varrock/index.js'), { prefix: '/varrock' });

fastify.register(import('./routes/cache.js'));
fastify.register(import('./routes/website.js'));

export function startWeb() {
    fastify.listen({ port: Environment.WEB_PORT, host: '0.0.0.0' }, (err, address) => {
        if (err) {
            console.error(err);
            Deno.exit(1);
        }

        console.log(`[Web]: Listening on port ${Environment.WEB_PORT}`);
    });
}
