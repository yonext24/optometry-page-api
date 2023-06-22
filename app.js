const express = require('express')
const { verifyUserAuth } = require('./firebase')
const { createUser } = require('./controllers')
const morgan = require('morgan')


const app = express()

app.use(express.json())
app.use(morgan())
app.use(verifyUserAuth)

app.post('/', createUser)

module.exports = {
  app
}