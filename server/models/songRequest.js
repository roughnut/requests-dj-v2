const mongoose = require('mongoose');

// Define the song request schema
const songRequestSchema = new mongoose.Schema({
  // Title of the song
  title: {
    type: String,
    required: true
  },
  // Artist of the song (optional)
  artist: {
    type: String
  },
  // Reference to the event for which the song is requested
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  // Reference to the user who made the request
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  // Enable timestamps for createdAt and updatedAt
  timestamps: true
});

// Create the SongRequest model from the schema
const SongRequest = mongoose.model('SongRequest', songRequestSchema);

module.exports = SongRequest;
