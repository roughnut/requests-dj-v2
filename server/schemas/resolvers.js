const { AuthenticationError } = require('apollo-server-express');
const { User, Event, SongRequest, Upvote } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    // Get the current user
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findById(context.user._id).populate('events songRequests upvotes');
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    // Get all users
    users: async () => {
      return User.find().populate('events songRequests upvotes');
    },
    // Get a user by username
    user: async (parent, { username }) => {
      return User.findOne({ username }).populate('events songRequests upvotes');
    },
    // Get all events
    events: async () => {
      return Event.find().populate('user songRequests');
    },
    // Get an event by ID
    event: async (parent, { _id }) => {
      return Event.findById(_id).populate('user songRequests');
    },
    // Get all song requests for an event
    songRequests: async (parent, { event }) => {
      return SongRequest.find({ event }).populate('event user upvotes');
    },
    // Get a song request by ID
    songRequest: async (parent, { _id }) => {
      return SongRequest.findById(_id).populate('event user upvotes');
    },
  },

  Mutation: {
    // Add a new user
    addUser: async (parent, { username, password, is_dj }) => {
      const user = await User.create({ username, password, is_dj });
      const token = signToken(user);
      return { token, user };
    },
    // Login a user
    login: async (parent, { username, password }) => {
      const user = await User.findOne({ username });

      if (!user) {
        throw new AuthenticationError('No user found with this username');
      }

      const correctPw = await user.checkPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },
    // Add a new event
    addEvent: async (parent, { name, description, date }, context) => {
      if (context.user) {
        const event = await Event.create({
          name,
          description,
          date,
          user: context.user._id,
        });

        await User.findByIdAndUpdate(context.user._id, { $push: { events: event._id } });

        return event;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    // Add a new song request
    addSongRequest: async (parent, { eventId, title, artist }, context) => {
      if (context.user) {
        const songRequest = await SongRequest.create({
          title,
          artist,
          event: eventId,
          user: context.user._id,
        });

        await Event.findByIdAndUpdate(eventId, { $push: { songRequests: songRequest._id } });
        await User.findByIdAndUpdate(context.user._id, { $push: { songRequests: songRequest._id } });

        return songRequest;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    // Add an upvote to a song request
    addUpvote: async (parent, { songRequestId }, context) => {
      if (context.user) {
        const upvote = await Upvote.create({
          user: context.user._id,
          songRequest: songRequestId,
        });

        await SongRequest.findByIdAndUpdate(songRequestId, { $push: { upvotes: upvote._id } });
        await User.findByIdAndUpdate(context.user._id, { $push: { upvotes: upvote._id } });

        return upvote;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    // Remove an event
    removeEvent: async (parent, { eventId }, context) => {
      if (context.user) {
        const event = await Event.findOneAndDelete({
          _id: eventId,
          user: context.user._id,
        });

        await User.findByIdAndUpdate(context.user._id, { $pull: { events: eventId } });

        return event;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    // Remove a song request
    removeSongRequest: async (parent, { songRequestId }, context) => {
      if (context.user) {
        const songRequest = await SongRequest.findOneAndDelete({
          _id: songRequestId,
          user: context.user._id,
        });

        await Event.findByIdAndUpdate(songRequest.event, { $pull: { songRequests: songRequestId } });
        await User.findByIdAndUpdate(context.user._id, { $pull: { songRequests: songRequestId } });

        return songRequest;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    // Remove an upvote
    removeUpvote: async (parent, { upvoteId }, context) => {
      if (context.user) {
        const upvote = await Upvote.findOneAndDelete({
          _id: upvoteId,
          user: context.user._id,
        });

        await SongRequest.findByIdAndUpdate(upvote.songRequest, { $pull: { upvotes: upvoteId } });
        await User.findByIdAndUpdate(context.user._id, { $pull: { upvotes: upvoteId } });

        return upvote;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = resolvers;