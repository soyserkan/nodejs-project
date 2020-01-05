const { db } = require('./config');

module.exports = require('knex')({
    client: 'mysql',
    connection: {
        host: db.host,
        user: db.user,
        password: db.password,
        database: db.database,
        timezone: 'UTC',
    },
    debug: true
});