const { Router } = require('express')
const routerCarrinho = Router()

const userToken = require('../middlewares/tokenUser')
const CarrinhoController = require('../controllers/CarrinhoController')

const carrinhoController = new CarrinhoController()

routerCarrinho.post('/', userToken, carrinhoController.addCarrinho)
routerCarrinho.get('/', userToken, carrinhoController.readCarrinho)
routerCarrinho.delete('/', userToken, carrinhoController.removeCarrinho)


module.exports = routerCarrinho