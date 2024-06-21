const { Router } = require('express')
const routerUser = Router()

const userToken = require('../middlewares/tokenUser')
const UsersController = require('../controllers/UsersController')

const usersController = new UsersController()

routerUser.post('/', usersController.create)
routerUser.post('/login', usersController.login)
routerUser.get('/', userToken, usersController.read)
routerUser.delete('/', userToken, usersController.delete )


module.exports = routerUser