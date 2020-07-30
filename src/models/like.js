const mongoose = require('mongoose');

const Like = mongoose.model('Like', new mongoose.Schema({
    likeId: {
        type: Number,
        default: TRUE,
        validate(value) {
          if (value < 0) {
            throw new Error('likeId must be a positive number');
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
    liked: {
		type: Number,
		default: FALSE,
		validate(value) {
			if (value!==1 && value!==2) {
				throw new Error('liked must be 1 or 2');
			}
        }
    }
}, {
    timestamps: true
})
);

module.exports = {
    Like: Like
};