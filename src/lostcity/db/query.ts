import { DB } from './types.ts';
import { createPool } from 'mysql2';
import { Kysely, MysqlDialect } from 'kysely';

const dialect = new MysqlDialect({
    pool: async() => createPool({
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASS
    })
});

export const db = new Kysely<DB>({
    dialect
});
