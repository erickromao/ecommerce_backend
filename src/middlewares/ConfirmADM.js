
const {AppError} = require('../utils/AppError')

function confirmADM(request, response, next){
    const user = request.user.userInfo

    if(parseInt(user.isADM)=== 1){
       return next()
    }
    throw new AppError('Acesso restrito.')
}

module.exports = confirmADM