import Knex from "knex";

// realizar alterações no banco
export async function up(knex: Knex) {
    // criar tabela
   return knex.schema.createTable('point_items', table => {
        table.increments('id').primary;
        
        table.integer('point_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('points');
            
        table.integer('item_id')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('items');    
    });
}

// voltar atrás
export async function down(knex: Knex) {
    // deletar a tabela
    return knex.schema.dropTable('point_items');
}