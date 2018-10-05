const Blog = require('../models/Blog.js')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.map( a => a.likes ).reduce( (a,b) => a+b );
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map( (a) => a.format )
}

module.exports = {
  dummy, totalLikes, blogsInDb

}