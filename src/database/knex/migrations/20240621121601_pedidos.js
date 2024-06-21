
exports.up = knex => knex.schema.createTable('pedidos', table=>{
    table.increments('id')
    table.integer('id_user')
    table.integer('numero')
    table.boolean('status').defaultTo('Processando pedido...')
    table.integer('total')
    table.json('id_produtos')

    table.timestamp('created_at').default(knex.fn.now())
    
})
exports.down = knex => knex.schema.dropTable('pedidos')
