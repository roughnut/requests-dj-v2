const { GraphQLError } = require('graphql');
const { User, Event, SongRequest, Upvote } = require('../models');
const { signToken } = require('../utils/auth');

// Utility function to remove circular references
function removeCircularReferences(obj) {
  const seen = new WeakSet();
  return JSON.parse(JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  }));
}

const resolvers = {
  Query: {
    // Get the current user
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findById(context.user._id).populate(
          "events songRequests upvotes"
        );
      }
      throw new GraphQLError("You need to be logged in!", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    },
    // Get all users
    users: async () => {
      return User.find().populate("events songRequests upvotes");
    },
    // Get a user by username
    user: async (parent, { username }) => {
      return User.findOne({ username }).populate("events songRequests upvotes");
    },
    // Get all events
    events: async () => {
      return Event.find().populate("user songRequests");
    },
    // Get an event by ID
    event: async (parent, { _id }) => {
      try {
        const event = await Event.findById(_id)
          .populate({
            path: "songRequests",
            populate: { path: "event" }, // Ensure event is fully populated
          })
          .populate("user");

        if (!event) {
          throw new GraphQLError("Event not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        // Ensure event name is not null
        if (!event.name) {
          throw new GraphQLError("Event name is missing", {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }

        return event;
      } catch (error) {
        console.error("Error fetching event:", error);
        throw new GraphQLError("Error fetching event", {
          extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
      }
    },
    songRequests: async (parent, { event }) => {
      const requests = await SongRequest.find({ event })
        .populate({
          path: "event",
        })
        .populate({
          path: "upvotes",
        })
        .collation({ locale: 'en', strength: 2 })
        .sort({ upvotes: -1, title: 1 });

      console.log("Song Requests:", requests);
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
        throw new GraphQLError("No user found with this username", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      const correctPw = await user.checkPassword(password);

      if (!correctPw) {
        throw new GraphQLError("Incorrect credentials", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      const token = signToken(user);

      return { token, user };
    },
    // Add a new event
    addEvent: async (parent, { name, description, date }, context) => {
      if (context.user) {
        try {
          console.log("Context user:", context.user);

          const user = await User.findById(context.user._id);
          if (!user) {
            throw new Error("User not found");
          }
          console.log("Found user:", user);

          const event = await Event.create({
            name,
            description,
            date,
            user: user._id,
          });
          console.log("Created event:", event);

          await User.findByIdAndUpdate(user._id, {
            $push: { events: event._id },
          });

          const populatedEvent = await Event.findById(event._id).populate(
            "user"
          );
          console.log("Populated event:", populatedEvent);

          return populatedEvent;
        } catch (error) {
          console.error("Error in addEvent resolver:", error);
          throw new GraphQLError("Failed to add event", {
            extensions: { code: "INTERNAL_SERVER_ERROR", error: error.message },
          });
        }
      }
      throw new GraphQLError("You need to be logged in!", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    },
    // Add a new song request
    addSongRequest: async (parent, { eventId, title, artist }, context) => {
      try {
        const event = await Event.findById(eventId);
        if (!event) {
          throw new GraphQLError("Event not found", {
            extensions: { code: "NOT_FOUND" },
          });
        }

        const songRequest = await SongRequest.create({
          title,
          artist,
          event: eventId,
        });

        await Event.findByIdAndUpdate(eventId, {
          $push: { songRequests: songRequest._id },
        });

        // Populate the event field
        const populatedSongRequest = await SongRequest.findById(
          songRequest._id
        ).populate("event");

        return populatedSongRequest;
      } catch (error) {
        console.error("Error in addSongRequest:", error);
        throw new GraphQLError("Failed to add song request", {
          extensions: { code: "INTERNAL_SERVER_ERROR", error: error.message },
        });
      }
    },
  
    addUpvote: async (parent, { songRequestId, guestId }, context) => {
      try {
        console.log('Adding upvote for songRequestId:', songRequestId);
        console.log('Context user:', context.user);
        console.log('Guest ID:', guestId);

        let userId = context.user ? context.user._id : null;
        if (!userId && !guestId) {
          throw new GraphQLError('User ID or Guest ID is required', {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }

        const identifier = userId || guestId;
        console.log('Using identifier:', identifier);

        // Find the song request
        const songRequest = await SongRequest.findById(songRequestId);

        if (!songRequest) {
          console.error('Song request not found for ID:', songRequestId);
          throw new GraphQLError('Song request not found', {
            extensions: { code: 'NOT_FOUND' },
          });
        }

        // Check if the user has already upvoted
        if (songRequest.upvoters && songRequest.upvoters.includes(identifier)) {
          throw new GraphQLError('User has already upvoted this song request', {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }

        // Add the identifier to upvoters and increment the upvote count
        const updatedSongRequest = await SongRequest.findByIdAndUpdate(
          songRequestId,
          {
            $addToSet: { upvoters: identifier },
            $inc: { upvotes: 1 }
          },
          { new: true }
        );

        console.log('Updated song request:', {
          _id: updatedSongRequest._id,
          title: updatedSongRequest.title,
          artist: updatedSongRequest.artist,
          upvotes: updatedSongRequest.upvotes,
          upvoters: updatedSongRequest.upvoters
        });

        return updatedSongRequest;
      } catch (error) {
        console.error('Error in addUpvote resolver:', error);
        throw new GraphQLError('Failed to upvote', {
          extensions: { code: 'INTERNAL_SERVER_ERROR', error: error.message },
        });
      }
    },
    // Updated removeUpvote mutation
    removeUpvote: async (parent, { songRequestId, guestId }, context) => {
      try {
        const userId = context.user ? context.user._id : guestId;
        if (!userId) {
          throw new GraphQLError('User ID or Guest ID is required', {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }

        // Find the song request
        const songRequest = await SongRequest.findById(songRequestId);

        if (!songRequest) {
          throw new GraphQLError('Song request not found', {
            extensions: { code: 'NOT_FOUND' },
          });
        }

        // Check if the user has upvoted
        if (!songRequest.upvoters || !songRequest.upvoters.includes(userId)) {
          throw new GraphQLError('User has not upvoted this song request', {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }

        // Remove the user from upvoters and decrement the upvote count
        const updatedSongRequest = await SongRequest.findByIdAndUpdate(
          songRequestId,
          {
            $pull: { upvoters: userId },
            $inc: { upvotes: -1 }
          },
          { new: true }
        );

        return updatedSongRequest;
      } catch (error) {
        console.error('Error in removeUpvote resolver:', error);
        throw new GraphQLError('Failed to remove upvote', {
          extensions: { code: 'INTERNAL_SERVER_ERROR', error: error.message },
        });
      }
    },
    // Remove an event
    removeEvent: async (parent, { eventId }, context) => {
      if (context.user) {
        const event = await Event.findOneAndDelete({
          _id: eventId,
          user: context.user._id,
        });

        await User.findByIdAndUpdate(context.user._id, {
          $pull: { events: eventId },
        });

        return event;
      }
      throw new GraphQLError("You need to be logged in!", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    },
    // Remove a song request
    removeSongRequest: async (parent, { songRequestId }, context) => {
      if (context.user) {
        const songRequest = await SongRequest.findOneAndDelete({
          _id: songRequestId,
          user: context.user._id,
        });

        await Event.findByIdAndUpdate(songRequest.event, {
          $pull: { songRequests: songRequestId },
        });
        await User.findByIdAndUpdate(context.user._id, {
          $pull: { songRequests: songRequestId },
        });

        return songRequest;
      }
      throw new GraphQLError("You need to be logged in!", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    },
    updateEvent: async (
      parent,
      { eventId, name, description, date },
      context
    ) => {
      if (context.user) {
        try {
          // Validate input fields
          if (!name || !description || !date) {
            throw new GraphQLError("All fields are required.", {
              extensions: { code: "BAD_USER_INPUT" },
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
            throw new GraphQLError(
              "Event not found or you do not have permission to update it.",
              {
                extensions: { code: "FORBIDDEN" },
              }
            );
          }

          return updatedEvent;
        } catch (error) {
          throw new GraphQLError(error.message, {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          });
        }
      }

      throw new GraphQLError("You need to be logged in!", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    },
  },
};

module.exports = resolvers;