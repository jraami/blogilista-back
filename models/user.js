const mongoose = require('mongoose')

const User = mongoose.model('User', {
    username: String,
    name: String,
    adult: Boolean,
    passwordHash: String,
    entries: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
})

module.exports = User
