const mongoose = require('mongoose')
const Config = require('../utils/Config')

class UserClass
{
  get format()
  {
    return {'username':this.username,'name':this.name,'adult':this.adult,'blogs:':this.blogs,'id':this._id}
  }
}

const UserSchema = new mongoose.Schema({
  username: String,
  name: { type: String, default: '' },
  passwordHash: String,
  adult: { type: Boolean, default: false },
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
})

UserSchema.statics.format = (user) =>
{
  return {'username':user.username,'name':user.name,'adult':user.adult,'blogs:':user.blogs,'id':user._id}
}


UserSchema.loadClass(UserClass)

const User = mongoose.model('User', UserSchema)

module.exports = User