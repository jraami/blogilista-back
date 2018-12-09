const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)

const testEntry = {
    title: 'A harmless test entry',
    author: 'Asshole B. Munch',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
}
const noLikesEntry = {
    title: 'A harmless test entry',
    author: 'Asshole B. Munch',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html'
}
const noTitleEntry = {
    author: 'Asshole B. Munch',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html'
}
const noUrlEntry = {
    title: 'A harmless test entry',
    author: 'Asshole B. Munch'
}

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
            .send(testEntry)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    })
})

describe('Blog entry form tests', async () => {

    test('Likes default to zero', async () => {
        const response = await api
            .post('/api/blogs')
            .send(noLikesEntry)
            .expect(201)
        console.log(response)
        console.log("")
        expect(response.body.likes).toEqual(0)
    })
    test('No title responded with 400', async () => {
        await api
            .post('/api/blogs')
            .send(noTitleEntry)
            .expect(400)
    })
    test('No URL responded with 400', async () => {
        await api
            .post('/api/blogs')
            .send(noUrlEntry)
            .expect(400)
    })
})

afterAll(() => {
    server.close()
})
