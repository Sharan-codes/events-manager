require('../constants');
const mongoose = require('mongoose');
const validator = require('validator');

const Event = mongoose.model('Event', new mongoose.Schema({
    eventId: {
      type: Number,
      default: TRUE,
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
    description: {
        type: String,
        required: true,
        trim: true
    },
    bookStartTime: {
        type: Date,
        required: true,
        trim: true
    },
    bookEndTime: {
        type: Date,
        required: true,
        trim: true
    },
    ticketPrice: {
      type: Number,
      required: true,
      validate(value) {
        if (value < 0) {
          throw new Error('Price must be a positive number');
        }
      }
    },
    totalTickets: {
      type: Number,
      default: TRUE,
      validate(value) {
        if (value < 0) {
          throw new Error('totalTickets must be a positive number');
          }
        }
    },
    availableTickets: {
      type: Number,
      default: TRUE,
      validate(value) {
        if (value < 0) {
          throw new Error('availableTicket must be a positive number');
          }
        }
    },
    status: {
      type: Number,
      default: EVENT_ACTIVE,
      validate(value) {
        if (value!==1 && value!==2) {
          throw new Error('status must be 1 or 2');
        }
      }
    }
},{
  timestamps: true
})
);

module.exports = Event;