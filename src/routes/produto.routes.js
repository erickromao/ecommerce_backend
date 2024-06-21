const { Router } = require('express')
const routerProduto = Router()

const userToken = require('../middlewares/tokenUser')
const confirmADM = require('../middlewares/ConfirmADM')
const ProdutosController = require('../controllers/ProdutosController')

const produtosController = new ProdutosController()

routerProduto.post('/',userToken, confirmADM, produtosController.create)
routerProduto.delete('/',userToken, confirmADM, produtosController.delete)
routerProduto.post('/estoque/add', userToken, confirmADM, produtosController.addEstoque)
routerProduto.post('/estoque/rmv', userToken, confirmADM, produtosController.rmvEstoque)
routerProduto.get('/', userToken, produtosController.read)


module.exports = routerProduto