const BlogRouter = require('express').Router()
const Blog = require('../models/Blog')

const listHelper = require('../utils/list_Helper')

BlogRouter.get('/', (request, response) => {
  console.log('BlogRouter.get');
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs.map(a => a.format))
    })
    .catch( (e) => {
      response.status(400).json( {'error':e} );
    })
})

BlogRouter.post('/', async (request, response) => {
  console.log('BlogRouter.post');
  if ( !request.body.title )
    return response.status(400).json({"error":"missing title"});
  if ( !request.body.url )
    return response.status(400).json({"error":"missing url"});
  const blog = new Blog(request.body)
  const savedBlog = blog.save();
  if ( savedBlog )
    return response.status(201).json(result.format);
  else
    return response.status(400).json( {'error':e} );
})

// update entry
BlogRouter.post('/:id', async (request, response) => {
  console.log('BlogRouter.post update');
  try 
  {
    const blog = await Blog.findById( request.params.id )
    if ( request.body.likes )
      blog.likes = request.body.likes;
    await blog.save();
    response.status(200).json( blog.format );
  }
  catch ( exception )
  {
    response.status(400).json( {'error':e} );
  }
})

// delete blog by id
BlogRouter.delete('/:id', async (request, response) => {
  console.log('BlogRouter.delete ', request.params.id);
  try
  {
    await Blog.findByIdAndRemove( request.params.id )
  }
  catch (e)
  {
    response.status(400).json( {'error':e} );
  }
})

// get single blog by id
BlogRouter.get('/:id', async (request, response) => {
  console.log('BlogRouter.delete ', request.params.id);
  try
  {
    const blog = await Blog.findById( request.params.id )
    if ( blog )
      response.json(blog.format)
    else
      response.status(404).end();
  }
  catch (e)
  {
    response.status(400).json( {'error':e} );
  }
})


module.exports = BlogRouter;
