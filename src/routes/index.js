const { Router } = require('express')
const router = Router()

const routerUser = require('./user.routes')

router.use('/user', routerUser)

module.exports = router