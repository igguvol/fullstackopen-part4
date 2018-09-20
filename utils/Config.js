
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const mongoURl = process.env.MONGODB_URI
const port = process.env.PORT

module.exports = { 
  mongoURl, 
  port 
}
