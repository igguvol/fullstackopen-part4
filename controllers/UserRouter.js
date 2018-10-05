const UserRouter = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const middleware = require('../utils/middleware')

const listHelper = require('../utils/list_Helper')

// adds user 
UserRouter.post('/', async (request, response) => {
  console.log('UserRouter.post: ', request.body);
  if ( !request.body.name )
    return response.status(400).json({"error":"missing name"}).end();
  if ( !request.body.username )
    return response.status(400).json({"error":"missing username"});
  if ( !request.body.password )
    return response.status(400).json({"error":"missing password"});
    
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(request.body.password, saltRounds);
  const user = new User({
    username: request.body.username,
    name: request.body.name,
    passwordHash: passwordHash
  });
  const storedUser = await user.save()

  //TODO: 201? 400?
  if ( !storedUser )
    return response.status(400).json();
  else
    return response.status(201).json(storedUser.format)

})

// update entry - todo: remove or restrict to token owner/admin
UserRouter.post('/:id', async (request, response) => {
  console.log('UserRouter.post update. ', request.params.id);
  try 
  {
    if ( !request.token )
      return response.status(404).json( {'error':'missing or invalid access token'} ); 
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
    if ( !request.token )
      return response.status(404).json( {'error':'missing or invalid access token'} ); 
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
    if ( !request.token )
      return response.status(404).json( {'error':'missing or invalid access token'} ); 
    const user = await User.findById( request.params.id )
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
