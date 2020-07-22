const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User', {
    type: {
        type: Number,
        default: USER,
        trim: true
    },
    name: {
        type: String,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"');
            }
        }
    }
});

module.exports = {
    User: User
  };