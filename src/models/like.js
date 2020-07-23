const mongoose = require('mongoose');

const Like = mongoose.model('Like', {
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
    liked: {
		type: Number,
		default: FALSE,
		validate(value) {
			if (value!==0 && value!==1) {
				throw new Error('liked must be 0 or 1');
			}
        }
    }
});

module.exports = {
    Like: Like
};