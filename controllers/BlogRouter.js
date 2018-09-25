const BlogRouter = require('express').Router()
const Blog = require('../models/Blog')


BlogRouter.get('/api/blogs', (request, response) => {
  console.log('BlogRouter.get');
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs.map(a => a.format))
    })
})

BlogRouter.post('/api/blogs', (request, response) => {
  console.log('BlogRouter.post');
  const blog = new Blog(request.body)
  blog
    .save()
    .then(result => {
      response.status(201).json(result.format)
    })
})


module.exports = BlogRouter;
