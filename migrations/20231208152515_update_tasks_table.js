/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('tasks', function(table) {
      table.increments('id').primary();
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
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('tasks');
  };
  