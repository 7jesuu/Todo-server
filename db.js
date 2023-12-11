
const knex = require('knex');
const bookshelf = require('bookshelf');

const config = require('./knexfile');

const connection = knex(config);
const db = bookshelf(connection);

db.plugin('registry');

module.exports = db;
