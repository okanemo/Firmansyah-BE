const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    judul: {
        type: String,
        required: true,
        max: 50
    },
    pengarang: {
        type: String,
        required: true,
        max: 50,
    },
    tahun: {
        type: String,
        required: true,
    },
    penerbit: {
        type: String,
        required: true,
        max: 50
    },
    sinopsis: {
        type: String,
        required: true,
        max: 255
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Book', bookSchema);