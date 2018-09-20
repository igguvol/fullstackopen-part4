const BlogRouter = require('express').Router()
const Blog = require('../models/Blog')


BlogRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs.map(a => a.format))
    })
})

BlogRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)
  blog
    .save()
    .then(result => {
      response.status(201).json(result.format)
    })
})


module.exports = BlogRouter;
