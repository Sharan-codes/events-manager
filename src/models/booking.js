require('../constants');
const mongoose = require('mongoose');

const Booking = mongoose.model('Booking', new mongoose.Schema({
    bookingId: {
        type: Number,
        default: TRUE,
        validate(value) {
          if (value < 0) {
            throw new Error('bookingId must be a positive number');
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
    ticketsBooked: {
        type: Number,
        default: TRUE,
    }
}, {
    timestamps: true
})
);

module.exports = Booking;