exports.up = function (knex) {
  return knex.schema.createTable('users', function (table) {
    table.increments('id');
    table.string('first_name');
    table.string('last_name');
    table.string('middle_name');
    table.string('login').unique().notNullable();
    table.text('password').notNullable(); // Используйте text для хранения хэшированных паролей
    table.integer('manager_id').unsigned().references('id').inTable('users').nullable(); // Разрешите NULL, если у пользователя нет руководителя
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users');
};
