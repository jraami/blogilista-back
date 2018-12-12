const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    adult: Boolean,
    passwordHash: String,
    entries: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
})

userSchema.statics.format = (user) => {
    return {
        id: user._id,
        username: user.username,
        name: user.name || "",
        adult: user.adult || true,
        entries: user.entries || []
    }
}

const User = mongoose.model('User', userSchema)

module.exports = User
