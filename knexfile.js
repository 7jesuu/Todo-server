module.exports = {
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'postgres',
    password: '123456',
    database: 'todo',
    charset: 'utf8',
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './migrations',
  },
};