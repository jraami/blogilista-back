const blogRouter = require('express').Router()
const Blog = require('../models/blog')

const formatPost = (blog) => {
    return {
        id: blog._id || "",
        title: blog.title || "",
        author: blog.author || "Not Known",
        url: blog.url || "",
        likes: blog.likes || 0
    }
}

blogRouter.get('/', async (request, response) => {
    try {
        const entries = await Blog.find({})
        if (entries) {
            response.json(entries.map(formatPost))
        } else {
            response.status(404).end()
        }
    }
    catch (exception) {
        response.status(400).send({ error: exception })
    }
})

blogRouter.get('/:id', async (request, response) => {
    try {
        const entry = await Blog.save()
        if (entry) {
            response.status(204).end()
            response.json(formatPost(entry))
        } else {
            response.status(404).end()
        }
    }
    catch (exception) {
        response.status(400).send({ error: exception })
    }
})

blogRouter.post('/', async (request, response) => {
    try {
        const entry = await Blog(formatPost(request.body))
        if (entry) {
            if (entry.title === "") return response.status(400).json({ error: 'Entry needs a name' })
            if (entry.url === "") return response.status(400).json({ error: 'Entry needs a URL' })
            const entrySaved = await entry.save()
            if (entrySaved) {
                response.status(201).json(entrySaved)
            }
        } else {
            response.status(400).end()
        }
    }
    catch (exception) {
        response.status(400).send({ error: exception })
    }
})

blogRouter.delete('/:id', async (request, response) => {
    try {
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } catch (exception) {
        response.status(400).send({ error: exception })
    }
})

blogRouter.delete('/', async (request, response) => {
    try {
        await Blog.deleteMany({})
        response.status(204).end()
    } catch (exception) {
        response.status(400).send({ error: exception })
    }
})

blogRouter.put('/:id', async (request, response) => {
    const id = request.params.id
    const entry = formatPost(request.body)
    try {
        const updatedEntry = await Blog
            .findByIdAndUpdate(id, { $inc: { likes: +1 } }, { new: false }, (err) => {
                if (err) return response.status(500).end()
            })
        if (updatedEntry) {
            response.status(201).json(updatedEntry)
        }
    }
    catch (exception) {
        response.status(400).send({ error: exception })
    }
})

module.exports = blogRouter