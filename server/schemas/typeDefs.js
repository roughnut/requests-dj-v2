const { gql } = require('graphql-tag');

const typeDefs = gql`
  # User type represents a user in the system
  type User {
    _id: ID!                 # Unique identifier for the user
    username: String!        # Username of the user
    is_dj: Boolean!          # Boolean indicating if the user is a DJ
    events: [Event]          # List of events associated with the user
    songRequests: [SongRequest] # List of song requests made by the user
    upvotes: [Upvote]        # List of upvotes made by the user
  }

  # Event type represents a music event
  type Event {
    _id: ID!                 # Unique identifier for the event
    name: String!            # Name of the event
    description: String!     # Description of the event
    date: String!            # Date of the event
    user: User!              # User (DJ) who created the event
    songRequests: [SongRequest] # List of song requests for this event
  }

  # SongRequest type represents a song request made by a user for an event
  type SongRequest {
    _id: ID!                 # Unique identifier for the song request
    title: String!           # Title of the requested song
    artist: String           # Artist of the requested song (optional)
    event: Event!            # Event for which the song is requested
    user: User!              # User who made the song request
    upvotes: [Upvote]        # List of upvotes for this song request
  }

  # Upvote type represents an upvote made by a user for a song request
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
    addUser(username: String!, password: String!, is_dj: Boolean!): Auth # Add a new user
    login(username: String!, password: String!): Auth # Login a user
    addEvent(name: String!, description: String!, date: String!): Event # Add a new event
    addSongRequest(eventId: ID!, title: String!, artist: String): SongRequest # Add a new song request
    addUpvote(songRequestId: ID!): Upvote # Add an upvote to a song request
    removeEvent(eventId: ID!): Event # Remove an event
    removeSongRequest(songRequestId: ID!): SongRequest # Remove a song request
    removeUpvote(upvoteId: ID!): Upvote # Remove an upvote
  }
`;

module.exports = typeDefs;