const mockDB = require('../utils/mockdb')
const Blog = require('../models/blog')
const User = require('../models/user')
const supertest = require('supertest')
const { usersInDB } = require('../utils/testhelper')
const { app, server } = require('../index')
const api = supertest(app)

let testDatabase = []
let testUserbase = []

beforeAll(async () => {
    await Blog.deleteMany({})
    const testEntries = mockDB.testDatabase.map(entry => new Blog(entry))
    const blogArray = testEntries.map(entry => entry.save())
    testDatabase = await Promise.all(blogArray)
})

describe('User tests', async () => {
    beforeAll(async () => {
        await User.deleteMany({})
        const testUsers = mockDB.testUserbase.map(entry => new User(entry))
        const userArray = testUsers.map(entry => entry.save())
        testUserbase = await Promise.all(userArray)
    })

    test('Create a new user', async () => {
        const newUser = {
            username: 'tbest',
            name: 'Tester Bester',
            password: 'tester'
        }
        const usersBeforeOp = await usersInDB()
        await api
            .post('/api/users')
            .send(newUser)
            .expect(200)
            .expect('Content-type', /application\/json/)
        const usersAfterOp = await usersInDB()
        expect(usersAfterOp.length).toBe(usersBeforeOp.length + 1)
        const usernames = usersAfterOp.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })
    test('Password has to be over 3 chars', async () => {
        const newUser = {
            username: 'shortpass',
            name: 'Short Pass',
            password: 'to'
        }
        const usersBeforeOp = await usersInDB()
        response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
        const usersAfterOp = await usersInDB()
        expect(usersAfterOp.length).toBe(usersBeforeOp.length)
    })
    test('Username must be unique', async () => {
        const newUser = {
            username: testUserbase[0].username,
            name: "Testi Tyyppä",
            password: "halooooooo"
        }
        const usersBeforeOp = await usersInDB()
        response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
        const usersAfterOp = await usersInDB()
        expect(usersAfterOp.length).toBe(usersBeforeOp.length)
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
