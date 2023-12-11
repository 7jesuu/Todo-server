exports.up = function (knex) {
  return knex.schema.createTable('task', function (table) {
    table.increments('id');
    table.string('title').notNullable();
    table.text('description');
    table.timestamp('due_date');
    table.integer('creator_id').unsigned().references('id').inTable('users');
    table.integer('assignee_id').unsigned().references('id').inTable('users');
    table.enu('priority', ['высокий', 'средний', 'низкий']).defaultTo('средний');
    table.enu('status', ['к выполнению', 'выполняется', 'выполнена', 'отменена']).defaultTo('к выполнению');
    
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('task');
};
