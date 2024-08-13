import { gql } from '@apollo/client';

// Query to get the currently logged-in user
export const GET_ME = gql`
  query me {
    me {
      _id
      username
      events {
        _id
        name
        description
        date
      }
      songRequests {
        _id
        title
        artist
        upvotes
      }
      upvotes {
        _id
        songRequest {
          _id
          title
        }
      }
    }
  }
`;

// Query to get all users
export const GET_USERS = gql`
  query users {
    users {
      _id
      username
    }
  }
`;

// Query to get a user by username
export const GET_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      events {
        _id
        name
        description
        date
      }
      songRequests {
        _id
        title
        artist
        upvotes
      }
      upvotes {
        _id
        songRequest {
          _id
          title
        }
      }
    }
  }
`;

// Query to get all events
export const GET_EVENTS = gql`
  query events {
    events {
      _id
      name
      description
      date
      user {
        _id
        username
      }
      songRequests {
        _id
        title
        artist
        upvotes
      }
    }
  }
`;

// Query to get a single event by ID
export const GET_EVENT = gql`
  query event($_id: ID!) {
    event(_id: $_id) {
      _id
      name
      description
      date
      user {
        _id
        username
      }
      songRequests {
        _id
        title
        artist
        user {
          _id
          username
        }
        upvotes
      }
    }
  }
`;

// Query to get song requests for a specific event
export const GET_SONG_REQUESTS = gql`
  query songRequests($event: ID!) {
    songRequests(event: $event) {
      _id
      title
      artist
      event {
        _id
        name
      }
      user {
        _id
        username
      }
      upvotes
    }
  }
`;

// Query to get a specific song request by ID
export const GET_SONG_REQUEST = gql`
  query songRequest($_id: ID!) {
    songRequest(_id: $_id) {
      _id
      title
      artist
      event {
        _id
        name
      }
      user {
        _id
        username
      }
      upvotes
    }
  }
`;