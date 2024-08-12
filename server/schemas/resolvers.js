const { GraphQLError } = require('graphql');
const { User, Event, SongRequest, Upvote } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    // Get the current user
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findById(context.user._id).populate('events songRequests upvotes');
      }
      throw new GraphQLError('You need to be logged in!', {
        extensions: { code: 'UNAUTHENTICATED' },
      });
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
      try {
        const event = await Event.findById(_id)
          .populate({
            path: 'user',
            select: 'username' // Explicitly select the `username` field
          })
          .populate({
            path: 'songRequests', // Populate songRequests and its fields if needed
            populate: [
              { path: 'user', select: 'username' }, // Populate user in songRequests if needed
              { path: 'event' }, // Populate event in songRequests if needed
              { path: 'upvotes' } // Populate upvotes in songRequests if needed
            ]
          });
    
        if (!event) {
          throw new GraphQLError('Event not found', {
            extensions: { code: 'NOT_FOUND' },
          });
        }
    
        return event;
      } catch (error) {
        console.error('Error fetching event:', error);
        throw new GraphQLError('Error fetching event', {
          extensions: { code: 'INTERNAL_SERVER_ERROR' },
        });
      }
    },
    songRequests: async (parent, { event }) => {
      const requests = await SongRequest.find({ event })
        .populate({
          path: 'user',
          select: 'username'
        })
        .populate({
          path: 'event'
        })
        .populate({
          path: 'upvotes'
        });
      
      console.log('Song Requests:', requests);
      return requests;
    },    
  },

  Mutation: {
    // Add a new user
    addUser: async (parent, { username, password }) => {
      const user = await User.create({ username, password });
      const token = signToken(user);
      return { token, user };
    },
    // Login a user
    login: async (parent, { username, password }) => {
      const user = await User.findOne({ username });

      if (!user) {
        throw new GraphQLError('No user found with this username', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const correctPw = await user.checkPassword(password);

      if (!correctPw) {
        throw new GraphQLError('Incorrect credentials', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const token = signToken(user);

      return { token, user };
    },
    // Add a new event
    addEvent: async (parent, { name, description, date }, context) => {
      if (context.user) {
        try {
          console.log('Context user:', context.user);

          const user = await User.findById(context.user._id);
          if (!user) {
            throw new Error('User not found');
          }
          console.log('Found user:', user);

          const event = await Event.create({
            name,
            description,
            date,
            user: user._id,
          });
          console.log('Created event:', event);

          await User.findByIdAndUpdate(user._id, { $push: { events: event._id } });

          const populatedEvent = await Event.findById(event._id).populate('user');
          console.log('Populated event:', populatedEvent);

          return populatedEvent;
        } catch (error) {
          console.error('Error in addEvent resolver:', error);
          throw new GraphQLError('Failed to add event', {
            extensions: { code: 'INTERNAL_SERVER_ERROR', error: error.message },
          });
        }
      }
      throw new GraphQLError('You need to be logged in!', {
        extensions: { code: 'UNAUTHENTICATED' },
      });
    },
    // Add a new song request
    addSongRequest: async (parent, { eventId, title, artist }, context) => {
      if (context.user) {
        try {
          // Create the song request
          const songRequest = await SongRequest.create({
            title,
            artist,
            event: eventId,
            user: context.user._id,
          });
    
          // Update event and user with new song request
          await Event.findByIdAndUpdate(eventId, { $push: { songRequests: songRequest._id } });
          await User.findByIdAndUpdate(context.user._id, { $push: { songRequests: songRequest._id } });
    
          // Fetch event and user details to ensure they are included in the response
          const event = await Event.findById(eventId).exec();
          const user = await User.findById(context.user._id).select('username').exec();
    
          if (!event || !user) {
            throw new GraphQLError('Event or User not found', {
              extensions: { code: 'INTERNAL_SERVER_ERROR' },
            });
          }
    
          // Return the song request with populated event and user fields
          return {
            ...songRequest._doc,
            event: {
              _id: event._id,
              name: event.name,
            },
            user: {
              _id: user._id,
              username: user.username,
            },
          };
        } catch (error) {
          console.error('Error in addSongRequest resolver:', error);
          throw new GraphQLError('Failed to add song request', {
            extensions: { code: 'INTERNAL_SERVER_ERROR' },
          });
        }
      }
      throw new GraphQLError('You need to be logged in!', {
        extensions: { code: 'UNAUTHENTICATED' },
      });
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
      throw new GraphQLError('You need to be logged in!', {
        extensions: { code: 'UNAUTHENTICATED' },
      });
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
      throw new GraphQLError('You need to be logged in!', {
        extensions: { code: 'UNAUTHENTICATED' },
      });
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
      throw new GraphQLError('You need to be logged in!', {
        extensions: { code: 'UNAUTHENTICATED' },
      });
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
      throw new GraphQLError('You need to be logged in!', {
        extensions: { code: 'UNAUTHENTICATED' },
      });
    },
    updateEvent: async (parent, { eventId, name, description, date }, context) => {
      if (context.user) {
        try {
          // Validate input fields
          if (!name || !description || !date) {
            throw new GraphQLError('All fields are required.', {
              extensions: { code: 'BAD_USER_INPUT' },
            });
          }
    
          // Find and update the event
          const updatedEvent = await Event.findOneAndUpdate(
            { _id: eventId, user: context.user._id },
            { name, description, date },
            { new: true } // Return the updated document
          );
    
          // If no event is found or updated, return null
          if (!updatedEvent) {
            throw new GraphQLError('Event not found or you do not have permission to update it.', {
              extensions: { code: 'FORBIDDEN' },
            });
          }
    
          return updatedEvent;
        } catch (error) {
          throw new GraphQLError(error.message, {
            extensions: { code: 'INTERNAL_SERVER_ERROR' },
          });
        }
      }
    
      throw new GraphQLError('You need to be logged in!', {
        extensions: { code: 'UNAUTHENTICATED' },
      });
    },
  },
};

module.exports = resolvers;