const { Router } = require('express')
const router = Router()

const routerUser = require('./user.routes')
const routerProduto = require('./produto.routes')
const routerCarrinho = require('./carrinho.routes')
const routerCheckout = require('./checkout.routes')
const routerPedidos = require('./pedidos.routes')

router.use('/user', routerUser)
router.use('/produto', routerProduto)
router.use('/carrinho', routerCarrinho)
router.use('/checkout', routerCheckout)
router.use('/pedidos', routerPedidos)

module.exports = router