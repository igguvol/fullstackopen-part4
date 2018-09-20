const mongoose = require('mongoose')

require('dotenv').config()

const url = process.env.MONGODB_URI


mongoose.connect(url, (err) => { if(err) { process.exit() } } )

class BlogClass
{
  get format()
  {
    return {'title':this.title,'author':this.author,'url':this.url,'likes':this.likes,'id':this._id}
  }
}

const BlogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

BlogSchema.loadClass(BlogClass)
const Blog = mongoose.model('Blog', BlogSchema)

module.exports = Blog