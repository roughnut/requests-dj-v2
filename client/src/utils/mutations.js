import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $password: String!) {
    addUser(username: $username, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_EVENT = gql`
  mutation addEvent($name: String!, $description: String!, $date: String!) {
    addEvent(name: $name, description: $description, date: $date) {
       _id
       name
       description
       date
       user {
         _id
         username
       }
     }
   }
 `;

export const ADD_SONG_REQUEST = gql`
  mutation addSongRequest($eventId: ID!, $title: String!, $artist: String) {
    addSongRequest(eventId: $eventId, title: $title, artist: $artist) {
      _id
      title
      artist
      event {
        _id
        name
      }
    }
  }
`;

export const ADD_UPVOTE = gql`
  mutation addUpvote($songRequestId: ID!, $guestId: String) {
    addUpvote(songRequestId: $songRequestId, guestId: $guestId) {
      _id
      title
      artist
      upvotes
    }
  }
`;

export const REMOVE_UPVOTE = gql`
  mutation removeUpvote($songRequestId: ID!, $guestId: String) {
    removeUpvote(songRequestId: $songRequestId, guestId: $guestId) {
      _id
      title
      artist
      upvotes
    }
  }
`;

export const REMOVE_EVENT = gql`
  mutation RemoveEvent($eventId: ID!) {
    removeEvent(eventId: $eventId) {
      _id
      name
    }
  }
`;

export const UPDATE_EVENT = gql`
  mutation UpdateEvent($eventId: ID!, $name: String!, $description: String!, $date: String!) {
    updateEvent(eventId: $eventId, name: $name, description: $description, date: $date) {
      _id
      name
      description
      date
    }
  }
`;
