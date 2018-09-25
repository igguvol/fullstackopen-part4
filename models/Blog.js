const mongoose = require('mongoose')
const Config = require('../utils/Config')


//mongoose.connect(Config.mongoURl, (err) => { if(err) { process.exit() } } )

class BlogClass
{
  get format()
  {
    return {'title':this.title,'author':this.author,'url':this.url,'likes':this.likes,'id':this._id}
  }
}

const BlogSchema = new mongoose.Schema({
  title: String,
  author: { type: String, default: '' },
  url: String,
  likes: { type: Number, default: 0 }
})

BlogSchema.loadClass(BlogClass)

/*BlogSchema.statics.format = function(a) =>
{
  return {'title':a.title,'author':a.author,'url':a.url,'likes':a.likes,'id':a._id}
}*/

const Blog = mongoose.model('Blog', BlogSchema)

module.exports = Blog