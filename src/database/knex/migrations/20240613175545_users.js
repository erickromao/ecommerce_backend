
exports.up = knex => knex.schema.createTable('users', (table)=>{
    table.increments('id')
    table.integer('isADM').default(0)
    table.text('nome')
    table.text('email')
    table.text('password')
    table.double('telefone')

    table.timestamp('created_at').default(knex.fn.now())
    table.timestamp('updated_at').default(knex.fn.now())
    
})
exports.down = knex => knex.schema.dropTable('users')
