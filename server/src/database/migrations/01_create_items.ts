import Knex from "knex";

// realizar alterações no banco
export async function up(knex: Knex) {
    // criar tabela
   return knex.schema.createTable('items', table => {
        table.increments('id').primary;
        table.string('image').notNullable();
        table.string('title').notNullable();    
    });
}

// voltar atrás
export async function down(knex: Knex) {
    // deletar a tabela
    return knex.schema.dropTable('items');
}