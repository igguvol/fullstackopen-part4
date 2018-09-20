
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const Config = require('./utils/Config')
const BlogRouter = require('./controllers/BlogRouter')

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



app.use('/api/blogs',BlogRouter)

app.listen(Config.port, () => {
  console.log(`Server running on port ${Config.port}`)
})