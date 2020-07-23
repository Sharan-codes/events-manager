const mongoose = require('mongoose');

const Comment = mongoose.model('Comment', {
    eventId: {
        type: Number,
        default: EVENT_ACTIVE,
        validate(value) {
          if (value < 0) {
            throw new Error('eventId must be a positive number');
            }
          }
    },
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