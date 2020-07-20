const mongoose = require('mongoose');

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
});

module.exports = {
    Comment : Comment
  };