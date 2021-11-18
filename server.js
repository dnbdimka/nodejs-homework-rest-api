const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const contactsRouter = require('./routes/api/contacts')

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

app.use('/api/contacts', contactsRouter)

app.use((_, res, __) => {
  res.status(404).json({
    status: 'error',
    code: 404,
    message: 'Use api on routes: /api/contacts',
    data: 'Not found',
  })
})

app.use((err, _, res, __) => {
  console.log(err.stack)
  res.status(500).json({
    status: 'fail',
    code: 500,
    message: err.message,
    data: 'Internal Server Error',
  })
})

const PORT = process.env.PORT || 3000
const uriDb = process.env.DB_HOST

mongoose.Promise = global.Promise

const connection = mongoose.connect(uriDb, {
  // promiseLibrary: global.Promise,
  useNewUrlParser: true,
  // useCreateIndex: true,
  useUnifiedTopology: true,
  // useFindAndModify: false,
})

connection
  .then(() => {
    app.listen(PORT, function () {
      console.log('Database connection successful ')
    })
  })
  .catch((err) =>
    console.log(`Server not running. Error message: ${err.message}`)
  )

module.exports = app