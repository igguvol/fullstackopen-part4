const BlogRouter = require('express').Router()
const Blog = require('../models/Blog')


BlogRouter.get('/', (request, response) => {
  console.log('BlogRouter.get');
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs.map(a => a.format))
    })
    .catch( (e) => {
      response.status(500).json( {'error':e} );
    })
})

BlogRouter.post('/', (request, response) => {
  console.log('BlogRouter.post');
  if ( !request.body.title )
    response.status(400).json({"error":"missing title"});
  if ( !request.body.url )
    response.status(400).json({"error":"missing url"});
  const blog = new Blog(request.body)
  blog
    .save()
    .then(result => {
      response.status(201).json(result.format)
    })
    .catch( (e) => {
      response.status(500).json( {'error':e} );
    })
})


module.exports = BlogRouter;
