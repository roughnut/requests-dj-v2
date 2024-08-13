const { gql } = require('graphql-tag');

const typeDefs = gql`
  type User {
    _id: ID!                 # Unique identifier for the user
    username: String!        # Username of the user
    events: [Event]          # List of events associated with the user
    songRequests: [SongRequest] # List of song requests made by the user
    upvotes: [Upvote]        # List of upvotes made by the user
  }

  type Event {
    _id: ID!                 # Unique identifier for the event
    name: String!            # Name of the event
    description: String!     # Description of the event
    date: String!            # Date of the event
    user: User!              # User (DJ) who created the event
    songRequests: [SongRequest] # List of song requests for this event
  }

  type SongRequest {
    _id: ID!                 # Unique identifier for the song request
    title: String!           # Title of the requested song
    artist: String           # Artist of the requested song (optional)
    event: Event!            # Event for which the song is requested
    user: User              # User who made the song request
    upvotes: Int        # Number of upvotes for this song request
  }

  type Upvote {
    _id: ID!                 # Unique identifier for the upvote
    user: User!              # User who made the upvote
    songRequest: SongRequest! # Song request that was upvoted
  }

  # Auth type for authentication responses
  type Auth {
    token: ID!               # JWT token for authentication
    user: User               # User who was authenticated
  }

  # Query type defines all the available queries
  type Query {
    me: User                 # Get the currently authenticated user
    users: [User]            # Get all users
    user(username: String!): User # Get a user by username
    events: [Event]          # Get all events
    event(_id: ID!): Event   # Get an event by ID
    songRequests(event: ID!): [SongRequest] # Get all song requests for an event
    songRequest(_id: ID!): SongRequest # Get a song request by ID
  }

  # Mutation type defines all the available mutations
  type Mutation {
    addUser(username: String!, password: String!): Auth 
    login(username: String!, password: String!): Auth #
    addEvent(name: String!, description: String!, date: String!): Event 
    addSongRequest(eventId: ID!, title: String!, artist: String): SongRequest
    addUpvote(songRequestId: ID!, guestId: String): SongRequest 
    removeEvent(eventId: ID!): Event # Remove an event
    removeSongRequest(songRequestId: ID!): SongRequest 
    removeUpvote(songRequestId: ID!, guestId: String): SongRequest 
    updateEvent(eventId: ID!, name: String!, description: String!, date: String!): Event 
  }
`;

module.exports = typeDefs;