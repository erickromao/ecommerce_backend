const { Router } = require('express')
const router = Router()

const routerUser = require('./user.routes')
const routerProduto = require('./produto.routes')
const routerCarrinho = require('./carrinho.routes')

router.use('/user', routerUser)
router.use('/produto', routerProduto)
router.use('/carrinho', routerCarrinho)

module.exports = router