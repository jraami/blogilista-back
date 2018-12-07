const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
const blogRouter = require('./controllers/blogrouter')
const Blog = require('./models/blog')

if (!process.env.NODE_ENV) {
    require('dotenv').config()
}
const url = process.env.MONGODB_URI

app.use(cors())
app.use(bodyParser.json())
morgan.token('bodycontent', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :bodycontent :status :res[content-length] - :response-time ms'))
app.use('/api/blogs', blogRouter)
app.use(middleware.error)

mongoose
    .connect(url)
    .then(() => console.log('Connected to server.'))
    .catch(err => console.log(err))


const PORT = 3003
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
