const { Router } = require('express')
const routerPedidos = Router()

const userToken = require('../middlewares/tokenUser')
const PedidosController = require('../controllers/PedidosController')

const pedidosController = new PedidosController()

routerPedidos.get('/', userToken, pedidosController.read)


module.exports = routerPedidos