const jwt = require('jsonwebtoken')


const tokenExtractor = function (req, res, next) {
  try
  {
    const authorization = req.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      const token = authorization.substring(7);
      const decodedToken = jwt.verify(token, process.env.SECRET);
      req.token = decodedToken;
    }
  }
  catch ( exception )
  {
    // do nothing
  }
  next();
}

module.exports = { tokenExtractor };