const mongoose = require('mongoose')
const Config = require('../utils/Config')

class UserClass
{
  get format()
  {
    return {'username':this.username,'name':this.name,'adult':this.adult,'id':this._id}
  }
}

const UserSchema = new mongoose.Schema({
  username: String,
  name: { type: String, default: '' },
  passwordHash: String,
  adult: Boolean,
  notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
})

UserSchema.loadClass(UserClass)

/*UserSchema.statics.format = function(a) =>
{
  return {'username':this.username,'name':this.name,'adult':this.adult,'id':this._id}
}*/

const User = mongoose.model('User', UserSchema)

module.exports = User