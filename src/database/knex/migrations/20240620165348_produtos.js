exports.up = knex => knex.schema.createTable('produtos', (table)=>{
table.increments('id')
table.text('nome')
table.double('preco')
table.integer('quantidade').defaultTo(0)
table.text('categoria')
table.boolean('status').defaultTo(true)

table.timestamp('created_at').default(knex.fn.now())
table.timestamp('updated_at').default(knex.fn.now())

})

exports.down = knex => knex.schema.dropTable('produtos')
