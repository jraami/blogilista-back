const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    try {
        const entries = await User
            .find({})
            .populate('entries')
        if (entries) {
            response.json(entries.map(User.format))
        } else {
            response.status(404).end()
        }
    }
    catch (exception) {
        response.status(400).send({ error: exception })
    }
})

usersRouter.get('/:id', async (request, response) => {
    try {
        const id = request.params.id
        const entry = await User
            .findById(id)
            .populate('entries')
        if (entry) {
            response.status(200).json(User.format(entry)).end()
        } else {
            response.status(404).end()
        }
    }
    catch (exception) {
        response.status(400).send({ error: exception })
    }
})

usersRouter.post('/', async (request, response) => {
    try {
        const body = request.body

        const existingUser = await User.find({ username: body.username })
        if (existingUser.length > 0) {
            return response.status(400).json({ error: 'Username is not unique.' })
        }
        if (body.password.length <= 3) {
            return response.status(400).json({ error: 'Password must be over 3 characters long.' })
        }
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.password, saltRounds)

        const user = new User({
            username: body.username,
            name: body.name,
            passwordHash
        })

        const savedUser = await user.save()

        response.json(savedUser)
    } catch (exception) {
        console.log(exception)
        response.status(500).json({ error: 'something went wrong...' })
    }
})

usersRouter.delete('/', async (request, response) => {
    try {
        await User.deleteMany({})
        response.status(204).end()
    } catch (exception) {
        response.status(400).send({ error: exception })
    }
})

module.exports = usersRouter
