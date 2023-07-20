require('dotenv/config');

module.exports = {
    development: {
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
    }
}
