const BlogRouter = require('express').Router()
const Blog = require('../models/Blog')
const User = require('../models/User')

const listHelper = require('../utils/list_Helper')

BlogRouter.get('/', async (request, response) => {
  console.log('BlogRouter.get /');
  try
  {
    const blog = await Blog.find({}).populate('user', {username:1,name:1});
    if ( blog )
      return response.status(200).json(blog.map(a => a.format))
    else
      response.status(404).json( {'error':'blog not found'} );
  }
  catch (e) {
    response.status(400).json( {'error':e} );
  }
})

BlogRouter.post('/', async (request, response) => {
  console.log('BlogRouter.post ', request.token );
  try
  {
    if ( !request.token || !request.token.id )
      return response.status(401).json( {'error':'missing or invalid access token'} ); 
    const body = request.body;
    if ( !body.title )
      return response.status(400).json({"error":"missing title"});
    if ( !body.url )
      return response.status(400).json({"error":"missing url"});
    if ( !body.author )
      return response.status(400).json({"error":"missing author"});
      
    const blog = new Blog( {title:body.title, url:body.url, author:body.author, user:request.token.id} );
    const savedBlog = await blog.save();
    if ( savedBlog )
    {
      // update user, add blog to user.blogs[]
      let user = await User.findById( request.token.id );
      if ( !user )
        return response.status(500).json( {'error':'no user'} );
      user.blogs.push( savedBlog.id );
      user.save();

      return response.status(201).json( savedBlog.format );
    }
    else
      return response.status(400).json( {'error':e} );
  }
  catch (e) {
    return response.status(400).json( {'error':e} );
  }
  
})


BlogRouter.post('/:id/comments', async (request, response) => {
  console.log('BlogRouter.post comment ', request.token );
  try
  {
    if ( !request.token || !request.token.id )
      return response.status(401).json( {'error':'missing or invalid access token'} ); 
    var blog = await Blog.findById( request.params.id )
    if ( !blog )
      return response.status(400).json({"error":"invalid id"});

    if ( !blog.comments )
      blog.comments = [request.body.comment];
    else
      blog.comments = blog.comments.concat(request.body.comment);
    const savedBlog = await blog.save();

    return response.status(201).json( savedBlog.format );
  }
  catch (e) {
    return response.status(400).json( {'error':e} );
  }
  
})


// update entry
BlogRouter.put('/:id', async (request, response) => {
  console.log('BlogRouter.post update');
  try 
  {
    const blog = await Blog.findById( request.params.id )
    if ( !blog )
      return response.status(404).json( {'error':'blog not found'} );
    if ( request.body.likes )
      blog.likes = request.body.likes;
    if ( request.body.author )
      blog.author = request.body.author;
    if ( request.body.url )
      blog.url = request.body.url;
    if ( request.body.title )
      blog.title = request.body.title;
    const savedBlog = await blog.save();
    response.status(200).json( savedBlog.format );
  }
  catch ( e )
  {
    response.status(400).json( {'error':e} );
  }
})

// delete blog by id
BlogRouter.delete('/:id', async (request, response) => {
  console.log('BlogRouter.delete ', request.params.id);
  try
  {
    if ( !request.token || !request.token.id )
      return response.status(401).json( {'error':'missing or invalid access token'} ); 

    const blog = await Blog.findById( request.params.id );
    if ( blog.user && blog.user.toString() !== request.token.id.toString() )
      response.status(401).json( {'error':'unauthorized'} ); 

    await Blog.findByIdAndRemove( request.params.id )
    return response.status(200).end();
  }
  catch (e)
  {
    response.status(400).json( {'error':e} );
  }
})

// get single blog by id
BlogRouter.get('/:id', async (request, response) => {
  console.log('BlogRouter.get /id ', request.params.id);
  try
  {
    const blog = await Blog.findById( request.params.id ).populate('User', {username:1,name:1})
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
