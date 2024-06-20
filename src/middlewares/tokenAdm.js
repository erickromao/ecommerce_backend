const jwt = require('jsonwebtoken')
const {AppError} = require('../utils/AppError')
require('dotenv').config()

function tokenAdm(request, response, next){
    const KEY = process.env.ADM_TOKEN

    const token = request.headers.authorization && request.headers.authorization.split(' ')[1]

    if(!token){
        throw new AppError('Sem autenticação.')
    }
    jwt.verify(KEY, token, (user, err)=>{
        if(err){
            throw new AppError('Acesso negado.')
        }
        request.user = user
        next()
    })

}

module.exports = tokenAdm