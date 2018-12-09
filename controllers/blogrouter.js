const blogRouter = require('express').Router()
const Blog = require('../models/blog')

const formatPost = (blog) => {
    return {
        title: blog.title || "",
        author: blog.author || "Not Known",
        url: blog.url || "",
        likes: blog.likes || 0
    }
}

blogRouter.get('/', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
        })
})

blogRouter.post('/', (request, response) => {
    const blog = new Blog(formatPost(request.body))
    if (blog.title === "") return response.status(400).json({ error: 'Entry needs a name' })
    if (blog.url === "") return response.status(400).json({ error: 'Entry needs a URL' })
    blog
        .save()
        .then(result => {
            response.status(201).json(result)
        })
})

module.exports = blogRouter