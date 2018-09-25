const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.map( a => a.likes ).reduce( (a,b) => a+b );
}


module.exports = {
  dummy, totalLikes

}