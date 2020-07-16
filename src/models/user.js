const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User', {
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
})

const Like = mongoose.model('Like', {
    eventName: {
        type: String,
        required: true,
        trim: true
    },
    userName: {
        type: String,
        trim: true
    },
    liked: {
		type: Number,
		default: FALSE,
		validate(value) {
			if (value!==0 && value!==1) {
				throw new Error('liked must be 0 or 1');
			}
        }
    }
})

const Comment = mongoose.model('Comment', {
    eventName: {
        type: String,
        required: true,
        trim: true
    },
    userName: {
        type: String,
        trim: true
    },
    comment: {
        type: String,
        required: true,
        trim: true
    }
})

module.exports = {
    User: User,
    Like: Like,
    Comment : Comment
  };