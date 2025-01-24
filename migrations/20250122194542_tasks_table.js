/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('tasks', table => {
        table.increments('id').primary();
        table.string('title', 255).notNullable();
        table.text('description');
        table.string('status', 50).defaultTo('pending');
        table.string('priority', 50).defaultTo('medium');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.integer('assigned_user_id').unsigned().nullable();
        table.foreign('assigned_user_id').references('users.id')
        .onUpdate('CASCADE').onDelete('CASCADE');

    }).then(function() {
        return knex.raw('ALTER TABLE tasks MODIFY updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP');
      });
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTableIfExists('tasks');
};

