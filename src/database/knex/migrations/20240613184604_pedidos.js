
exports.up = knex => knex.schema.createTable('pedidos', (table)=>{
    table.increments('id')
})

exports.down = knex => knex.schmea.dropTable('pedidos')
