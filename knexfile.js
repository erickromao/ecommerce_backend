const path = require('path')

module.exports = {

  development: {
    client: 'pg',
    connection: {
      user: 'postgres',
      host: 'localhost',
      database: 'ecommerce',
      password: '123',
      port: 5432
    },
    migrations:{
      directory: path.resolve(__dirname, 'src', 'database','knex','migrations')
    }
  }
};
