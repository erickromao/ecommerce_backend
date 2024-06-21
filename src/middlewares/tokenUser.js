const jwt = require('jsonwebtoken')
const {AppError} = require('../utils/AppError')
require('dotenv').config()

function tokenUser(request, response, next){
    const KEY = process.env.USER_TOKEN

    const token = request.headers.authorization && request.headers.authorization.split(' ')[1]

    if(!token){
        throw new AppError('Sem autenticação.')
    }
    jwt.verify(token, KEY, (err, user)=>{
        if(err){
            throw new AppError('Acesso negado.')
        }
        request.user = user
        next()
    })

}

module.exports = tokenUser