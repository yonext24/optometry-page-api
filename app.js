const express = require('express')
const { verifyUserAuth } = require('./firebase')
const { createUser } = require('./controllers')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors({
  origin: 'http://localhost:3000'
}))
// app.use(async (req, res, next) => {
//   await new Promise(resolve => {
//     setTimeout(() => {
//       resolve()
//     }, 5000)
//   })
//   return res.status(500).json({ error: 'test' })
// })
app.use(express.json())
app.use(morgan())
app.use(verifyUserAuth)

app.post('/', createUser)

module.exports = {
  app
}
