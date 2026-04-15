const mongoose = require('mongoose');
const userShema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    age: {
        type: Number
    },
    gender: {
        type: String
    }
});

module.exports = mongoose.model(
    'User', userShema
)