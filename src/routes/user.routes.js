const { Router } = require('express')
const routerUser = Router()

const userToken = require('../middlewares/tokenUser')
const UsersController = require('../controllers/UsersController')

const usersController = new UsersController()

routerUser.post('/register', usersController.create)

module.exports = routerUser