const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const listHelper = require('../utils/list_helper')

var token, userInfo

test('dummy test', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

test('create user', async () => {
  userInfo = { 
    name:'Test User',
    username:'test'+Math.floor(Math.random()*100000).toString(), 
    password:'test'+Math.floor(Math.random()*100000).toString()
   }
  const response = await api
    .post( '/api/users' )
    .send(userInfo)
    .expect(201)
})

test('login',async() => {
  const response = await api.post( '/api/login' )
    .send(userInfo)
    .expect(200)
  login = response.body;
  token = (login && login.token)?login.token:''
  console.log(response.body)
})

test('test get blogs', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('uninitialized likes are set to 0', async () => {
  const testEntry = {'title':'test','author':'test','url':'none'};
  var response = await api.post('/api/blogs')
    .send(testEntry)
    .set('Authorization', `bearer ${token}` )
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogResponse = await api.get( `/api/blogs/${response.body.id}` )
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(blogResponse.body.likes).toBe(0);
})

test('POST to blogs with empty "likes" and delete it', async () => {
  const testEntry = {'title':'test','author':'test','url':'none'};
  const response = await api.post('/api/blogs')
    .send(testEntry)
    .set('Authorization', `bearer ${token}` )
    .expect(201)
    .expect('Content-Type', /application\/json/)

  expect(response.body.likes).toBe(0);

  const deleteResponse = async() => await api.delete('/api/blogs/' + response.body.id)
  .set('Authorization', `bearer ${token}` )
    .expect(200)
    .expect('Content-Type', /application\/json/);

})

test('POST to blogs', async () => {
  const testEntry = {'title':'test','author':'test','url':'none'};
  const blogsBefore = await listHelper.blogsInDb();
  const response = await api.post('/api/blogs')
    .send(testEntry)
    .set('Authorization', `bearer ${token}` )
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAfter = await listHelper.blogsInDb();
  expect( blogsAfter.length ).toBe( blogsBefore.length + 1 )
//  expect( blogsAfter ).arrayContaining( response.body )

})


test('create user with too short password', async () => {
  const testEntry = {'username':'y','password':'z','adult':true};
  const response = await api.post('/api/users')
    .send(testEntry)
    .expect(400)
    .expect('Content-Type', /application\/json/);
})

test('create user with no name', async () => {
  const testEntry = {'password':'xyz12345678','adult':true};
  const response = await api.post('/api/users')
    .send(testEntry)
    .expect(400)
    .expect('Content-Type', /application\/json/);
})


afterAll(() => {
  server.close()
})