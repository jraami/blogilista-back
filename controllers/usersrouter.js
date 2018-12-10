const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

const format = (user) => {
    return {
        id: user._id,
        username: user.username,
        name: user.name || "",
        adult: user.adult || true,
        entries: user.entries || ""
    }
}

usersRouter.get('/', async (request, response) => {
    try {
        const entries = await User.find({})
        if (entries) {
            response.json(entries.map(format))
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
        const entry = await User.findById(id)
        if (entry) {
            response.status(200).json(format(entry)).end()
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


module.exports = usersRouter
