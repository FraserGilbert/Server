exports.up = async function(knex) {
    await knex.schema.createTable('world', (table) => {
        table.increments('id').primary();

        table.integer('node').notNullable();
        table.string('address').notNullable();
        table.integer('port_offset').notNullable();
        table.boolean('members').notNullable();
        table.string('secret').notNullable();
    });

    await knex.schema.createTable('account', (table) => {
        table.increments('id').primary();

        table.string('username').notNullable();
        table.string('password').notNullable();
        table.integer('staff_modlevel').notNullable();
        table.dateTime('membership').nullable();

        table.string('email').notNullable();
        table.string('recovery1').nullable();
        table.string('recovery2').nullable();
        table.string('recovery3').nullable();
        table.dateTime('recovery_set').nullable();

        table.integer('world_id').nullable();
        table.foreign('world_id').references('world.id');

        table.dateTime('last_login').nullable();
    });

    await knex.schema.createTable('account_appeal', (table) => {
        table.increments('account_id').primary();
        table.foreign('account_id').references('account.id');

        table.dateTime('timestamp').notNullable();
        table.string('thread').notNullable();
    });

    await knex.schema.createTable('account_message', (table) => {
        table.increments('account_id').primary();
        table.foreign('account_id').references('account.id');

        table.dateTime('timestamp').notNullable();
        table.integer('string').notNullable();
    });

    await knex.schema.createTable('hiscore_table', (table) => {
        table.increments('account_id').primary();
        table.foreign('account_id').references('account.id');

        table.integer('stat').notNullable();
        table.integer('exp').notNullable();
    });

    // seed table: world
    await knex('world').insert([
        {
            id: 1,
            node: 0,
            address: 'localhost',
            port_offset: 0,
            members: true,
            secret: 'local'
        },
        {
            id: 2,
            node: 10,
            address: 'world1.runewiki.org',
            port_offset: 3,
            members: false,
            secret: 'ab51b687-2e92-4b43-9cc3-4fc4ecdbe58c'
        },
        {
            id: 3,
            node: 11,
            address: 'world2.runewiki.org',
            port_offset: 0,
            members: true,
            secret: '38317ddf-5be4-4a01-abd3-d5701c3d05d1'
        }
    ]);
};

exports.down = async function(knex) {
	await knex.schema.dropTable('account');
    await knex.schema.dropTable('account_appeal');
    await knex.schema.dropTable('account_world_history');
    await knex.schema.dropTable('account_message');
    await knex.schema.dropTable('account_recovery');
    await knex.schema.dropTable('world');
};
