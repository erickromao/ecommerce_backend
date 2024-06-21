
exports.up = knex => knex.schema.createTable("carrinhos", (table)=>{
    table.increments('id')
    table.integer('id_user')
    table.integer('id_produto')
})

exports.down = knex => knex.schema.dropTable("carrinhos")
