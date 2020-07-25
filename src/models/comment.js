const mongoose = require('mongoose');

const Comment = mongoose.model('Comment', new mongoose.Schema({
    commentId: {
        type: Number,
        default: TRUE,
        validate(value) {
          if (value < 0) {
            throw new Error('commentId must be a positive number');
          }
        }
    },
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
    userId: {
        type: Number,
        default: TRUE,
        validate(value) {
          if (value < 0) {
            throw new Error('userId must be a positive number');
          }
        }
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
}, {
    timestamps: true
})
);

module.exports = {
    Comment : Comment
  };