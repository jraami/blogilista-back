const mockDB = require('../utils/mockdb')
const Blog = require('../models/blog')
const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)

let testDatabase = []

beforeAll(async () => {
    await Blog.deleteMany({})
    const testEntries = mockDB.testDatabase.map(entry => new Blog(entry))
    const promiseArray = testEntries.map(entry => entry.save())
    testDatabase = await Promise.all(promiseArray)
})

describe('API tests', async () => {

    test('GET returns JSON', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('POST works', async () => {
        const response = await api
            .post('/api/blogs')
            .send(mockDB.testEntry)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        expect(response.body.title === mockDB.testEntry.title)
        const isPosted = await api
            .get('/api/blogs/' + response.body._id)
        expect(isPosted.body.title === mockDB.testEntry.title)
    })
    test('PUT Add like to an entry', async () => {
        const response = await api
            .put('/api/blogs/' + testDatabase[0]._id)
            .send(testDatabase[0])
            .expect(201)
        expect(response.body.likes).toBe(testDatabase[0].likes + 1)
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
