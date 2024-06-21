const { Router } = require('express')
const routerCheckout = Router()

const userToken = require('../middlewares/tokenUser')
const CheckoutController = require('../controllers/CheckoutController')

const checkoutController = new CheckoutController()

routerCheckout.post('/boleto', userToken, checkoutController.boleto)


module.exports = routerCheckout