/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('blacklisted_tokens', table => {
        table.string('token').primary();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('expires_at');
    });
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema.dropTableIfExists('blacklisted_tokens');
};
