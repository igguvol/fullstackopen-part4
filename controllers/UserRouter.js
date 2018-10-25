const UserRouter = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const middleware = require('../utils/middleware')

const listHelper = require('../utils/list_Helper')

// adds user 
UserRouter.post('/', async (request, response) => {
  console.log('UserRouter.post: ', request.body);
  if ( !request.body.name )
  {
    console.log("no name")
    return response.status(400).json({"error":"missing name"}).end();
  }
  if ( !request.body.username )
  {
    console.log("no username")
    return response.status(400).json({"error":"missing username"});
  }
  if ( !request.body.password )
  {
    console.log("no password")
    return response.status(400).json({"error":"missing password"});
  }
  if ( request.body.password.length < 3  )
  {
    console.log("too short password")
    return response.status(400).json({"error":"too short password"}).end();
  }
  const existingUser = await User.findOne({ username: request.body.username })
  if ( existingUser )
    return response.status(400).json({"error":"username already in use"});

    
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(request.body.password, saltRounds);
  const user = new User({
    username: request.body.username,
    name: request.body.name,
    adult: request.body.adult?request.body.adult:false,
    passwordHash: passwordHash
  });
  const storedUser = await user.save()

  if ( !storedUser )
    return response.status(500).json();
  else
    return response.status(201).json(storedUser.format)

})

// update entry - todo: remove or restrict to token owner/admin
UserRouter.post('/:id', async (request, response) => {
  console.log('UserRouter.post update. ', request.params.id);
  try 
  {
    if ( !request.token || !request.token.id )
      return response.status(401).json( {'error':'missing or invalid access token'} ); 
    const user = await User.findById( request.params.id )
    if ( !user )
      return response.status(404).json( {'error':'user not found'} );
    const saltRounds = 10
    if ( request.body.username )
      user.username = request.body.username;
    if ( request.body.name )
      user.name = request.body.name;
    if ( request.body.password )
      user.password = await bcrypt.hash(request.body.password, saltRounds)
    const storedUser = await user.save();
    response.status(200).json( storedUser.format );
  }
  catch ( exception )
  {
    response.status(400).json( {'error':exception} );
  }
 
})

// delete User by id
UserRouter.delete('/:id', async (request, response) => {
  console.log('UserRouter.delete ', request.params.id);
  try
  {
    if ( !request.token || !request.token.id )
      return response.status(401).json( {'error':'missing or invalid access token'} ); 
    await User.findByIdAndRemove( request.params.id )
  }
  catch (e)
  {
    response.status(400).json( {'error':e} );
  }
})

// get single User by id
UserRouter.get('/:id', async (request, response) => {
  console.log('UserRouter.get ', request.params.id);
  try
  {
    if ( !request.token || !request.token.id )
      return response.status(401).json( {'error':'missing or invalid access token'} ); 
    const user = await User.findById( request.params.id ).populate('blogs', {likes:1,author:1,title:1,url:1})
    if ( user )
      response.json(user.format)
    else
      response.status(404).end();
  }
  catch (e)
  {
    response.status(400).json( {'error':e} );
  }
})


module.exports = UserRouter;
