const mongoose = require('mongoose');

// Define the event schema
const eventSchema = new mongoose.Schema({
  // Name of the event
  name: {
    type: String,
    required: true
  },
  // Description of the event
  description: {
    type: String,
    required: true
  },
  // Date of the event
  date: {
    type: Date,
    required: true
  },
  // Reference to the user who created the event
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  songRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SongRequest'
    }
  ]
}, {
  // Enable timestamps for createdAt and updatedAt
  timestamps: true
});

// Create the Event model from the schema
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
