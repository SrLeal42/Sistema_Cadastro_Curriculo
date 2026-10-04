import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("Candidates", (table) => {
    table.uuid("Id").primary().defaultTo(knex.raw("NEWID()"));
    table.string("FullName", 255).notNullable();
    table.string("Email", 255).notNullable().unique();
    table.string("Phone", 50).nullable();
    table.string("DesiredRole", 100).nullable();
    table.text("Summary").nullable();
    table.timestamp("CreatedAt").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("Candidates");
}
