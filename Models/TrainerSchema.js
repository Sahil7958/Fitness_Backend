const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

const trainerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    contactNo: {
        type: Number,
        required: true,
    },
    imageURL: {
        type: String,
        required: true,
    },
}, { timestamps: true})

const Trainer = mongoose.model('Trainer', trainerSchema);

module.exports = Trainer;