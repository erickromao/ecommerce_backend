require('express-async-errors')

class AppError{
    message
    statusCode

    constructor(message, statusCode = 400){
        this.message = message
        this.statusCode = statusCode
    }
}

function ErrorClientAndServer(err, request, response, next){
    if(err instanceof AppError){
       return response.status(err.statusCode).json({
            message:err.message
        })
    }
    console.error(err)
    return response.status(500).send('Server Error')
}   

module.exports = {AppError, ErrorClientAndServer}