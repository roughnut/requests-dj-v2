const mongoose = require('mongoose');

// Define the upvote schema
const upvoteSchema = new mongoose.Schema({
  // Reference to the user who made the upvote
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Reference to the song request that was upvoted
  songRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SongRequest',
    required: true
  }
}, {
  // Enable timestamps for createdAt and updatedAt
  timestamps: true
});

// Create a compound index to ensure uniqueness of user and songRequest combination
upvoteSchema.index({ user: 1, songRequest: 1 }, { unique: true });

// Create the Upvote model from the schema
const Upvote = mongoose.model('Upvote', upvoteSchema);

module.exports = Upvote;