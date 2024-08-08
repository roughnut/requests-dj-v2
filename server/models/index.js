const User = require('./user');
const Event = require('./event');
const SongRequest = require('./songRequest');
const Upvote = require('./upvote');

// In Mongoose, we don't need to explicitly define relationships.
// The relationships are defined within the schema of each model.

module.exports = { User, Event, SongRequest, Upvote };