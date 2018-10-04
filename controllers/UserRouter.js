const UserRouter = require('express').Router()
const User = require('../models/User')

const listHelper = require('../utils/list_Helper')


UserRouter.post('/', (request, response) => {
  console.log('UserRouter.post');
  if ( !request.body.name )
    response.status(400).json({"error":"missing name"});
  if ( !request.body.username )
    response.status(400).json({"error":"missing username"});
  if ( !request.body.password )
    response.status(400).json({"error":"missing password"});
    
  const saltRounds = 10
  const user = new User({
    username: request.body.username,
    name: request.body.name,
    passwordHash = await bcrypt.hash(request.body.password, saltRounds)
  });
  user
    .save()
    .then(result => {
      response.status(201).json(result.format)
    })
    .catch( (e) => {
      response.status(400).json( {'error':e} );
    })
})

// update entry
UserRouter.post('/:id', async (request, response) => {
  console.log('UserRouter.post update');
  try 
  {
    const user = await User.findById( request.param.id )
    const saltRounds = 10
    if ( request.body.username )
      user.username = request.body.username;
    if ( request.body.name )
      user.name = request.body.name;
    if ( request.body.password )
      user.username = await bcrypt.hash(request.body.password, saltRounds)
    await user.save();
    response.status(200).json( user.format );
  }
  catch ( exception )
  {
    response.status(400).json( {'error':e} );
  }
 
})

// delete User by id
UserRouter.delete('/:id', async (request, response) => {
  console.log('UserRouter.delete ', request.params.id);
  try
  {
    await User.findByIdAndRemove( request.params.id )
  }
  catch (e)
  {
    response.status(400).json( {'error':e} );
  }
})

// get single User by id
UserRouter.get('/:id', async (request, response) => {
  console.log('UserRouter.delete ', request.params.id);
  try
  {
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
