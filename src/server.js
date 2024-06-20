const express = require('express')
const router = require('./routes')
require('dotenv').config()

const {ErrorClientAndServer} = require('./utils/AppError')
const createDB = require('./database')


const app = express()
const PORT = process.env.PORT || 3000

createDB()

app.use(express.json())
app.use(router)

app.use(ErrorClientAndServer)

app.listen(PORT, console.log(`ServerON ${PORT}`))