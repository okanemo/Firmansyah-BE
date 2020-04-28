const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        max: 20
    },
    email: {
        type: String,
        required: true,
        max: 100,
    },
    password: {
        type: String,
        required: true,
        max: 20
    },
    role: {
        type: String,
        required: true,
        max: 20
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);