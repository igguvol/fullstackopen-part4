
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

console.log('NODE_ENV',process.env.NODE_ENV);

const mongoURl = process.env.MONGODB_URI
const port = process.env.PORT

module.exports = { 
  mongoURl, 
  port 
}
