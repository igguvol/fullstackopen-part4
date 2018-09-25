const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const listHelper = require('../utils/list_helper')

test('dummy test', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

test('test get blogs', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('total likes', async () => {
  await api.get('/api/blogs')
  .expect(200)
  .expect('Content-Type', /application\/json/)
})

test('POST to blogs', async () => {
  const testEntry = {'title':'test','author':'test','url':'none'};
  await api.post('/api/blogs')
  .send(testEntry)
  .expect(201)
  .expect('Content-Type', /application\/json/)
})

test('POST to blogs with empty "likes"', async () => {
  const testEntry = {'title':'test','author':'test','url':'none'};
  const response = await api.post('/api/blogs')
    .send(testEntry)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  expect(response.test).toBe(0);
})



afterAll(() => {
  server.close()
})