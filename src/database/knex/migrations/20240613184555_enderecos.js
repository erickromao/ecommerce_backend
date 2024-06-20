
exports.up = knex => knex.schema.createTable('enderecos', (table)=>{
    table.increments('id')
    table.text('UF')
    table.text('bairro')
    table.text('rua')
    table.integer('numero')

    table.integer('user_id').references('id').inTable('users')

    table.timestamp('created_at').default(knex.fn.now())
    table.timestamp('updated_at').default(knex.fn.now())
})

exports.down = knex => knex.schmea.dropTable('enderecos')
