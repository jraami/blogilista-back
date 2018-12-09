const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
const blogRouter = require('./controllers/blogrouter')
const config = require('./utils/config')

mongoose
    .connect(config.mongoUrl)
    .then(() => console.log('Connected to database.'))
    .catch(err => console.log(err))

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))
if (process.env.NODE_ENV === 'test') {
    morgan.token('bodycontent', function (req, res) { return JSON.stringify(req.body) })
    app.use(morgan(':method :url :bodycontent :status :res[content-length] - :response-time ms'))
}
app.use('/api/blogs', blogRouter)
app.use(middleware.error)

const server = http.createServer(app)

server.listen(config.port, () => {
    console.log('Server running on port ', config.port)
})
server.on('close', () => {
    mongoose.connection.close()
})

module.exports = {
    app, server
}