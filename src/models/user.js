const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User', new mongoose.Schema({
    type: {
        type: Number,
        default: USER,
        trim: true
    },
    userId: {
        type: Number,
        default: TRUE,
        validate(value) {
          if (value < 0) {
            throw new Error('userId must be a positive number');
          }
        }
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
}, {
    timestamps: true
})
);

module.exports = {
    User: User
  };