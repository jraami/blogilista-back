const mockDB = require('../utils/mockdb')
const Blog = require('../models/blog')
const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)

beforeAll(async () => {
    await Blog.deleteMany({})
    mockDB.testDatabase.forEach(async (entry) => {
        let blogEntry = new Blog(entry)
        await blogEntry.save()
    })
})

describe('API tests', async () => {

    test('GET returns JSON', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('POST works', async () => {
        await api
            .post('/api/blogs')
            .send(mockDB.testEntry)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    })
})

describe('Blog entry form tests', async () => {

    test('Likes default to zero', async () => {
        const response = await api
            .post('/api/blogs')
            .send(mockDB.noLikesEntry)
            .expect(201)
        expect(response.body.likes).toEqual(0)
    })
    test('No title responded with 400', async () => {
        await api
            .post('/api/blogs')
            .send(mockDB.noTitleEntry)
            .expect(400)
    })
    test('No URL responded with 400', async () => {
        await api
            .post('/api/blogs')
            .send(mockDB.noUrlEntry)
            .expect(400)
    })
})

afterAll(() => {
    server.close()
})
