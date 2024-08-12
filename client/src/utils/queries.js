import { gql } from '@apollo/client';

export const GET_ME = gql`
  query me {
    me {
      _id
      username
      is_dj
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

export const GET_USERS = gql`
  query users {
    users {
      _id
      username
      is_dj
    }
  }
`;

export const GET_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      is_dj
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
      }
    }
  }
`;

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
        upvotes {
          _id
          user {
            _id
            username
          }
        }
      }
    }
  }
`;

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
      upvotes {
        _id
        user {
          _id
          username
        }
      }
    }
  }
`;

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
      upvotes {
        _id
        user {
          _id
          username
        }
      }
    }
  }
`;