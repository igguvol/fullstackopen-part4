const http = require('http')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const Config = require('./utils/Config')
const BlogRouter = require('./controllers/BlogRouter')
const UserRouter = require('./controllers/UserRouter')
const LoginRouter = require('./controllers/Login')
const middleware = require('./utils/middleware')

app.use(cors())
app.use(bodyParser.json())
app.use( morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    JSON.stringify(req.body),
    tokens.status(req, res),
    tokens.res(req,res,'Content-Length'),
    '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
})
)

app.use(middleware.tokenExtractor);
app.use('/api/blogs',BlogRouter);
app.use('/api/users',UserRouter);
app.use('/api/login',LoginRouter);


mongoose
  .connect(Config.mongoURl)
  .then( () => {
    console.log('connected to database', Config.mongoURl)
  })
  .catch( err => {
    console.log(err)
  })


const server = http.createServer(app)

server.listen(Config.port, () => {
  console.log(`Server running on port ${Config.port}`)
})

server.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app, server, mongoose
}