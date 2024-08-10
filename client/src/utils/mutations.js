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
  mutation addUser($username: String!, $password: String!, $is_dj: Boolean!) {
    addUser(username: $username, password: $password, is_dj: $is_dj) {
      token
      user {
        _id
        username
        is_dj
      }
    }
  }
`;

export const ADD_EVENT = gql`
-  mutation addEvent($name: String!, $description: String!, $date: String!, $user: UserInput!) {
-    addEvent(name: $name, description: $description, date: $date, user: $user) {
+  mutation addEvent($name: String!, $description: String!, $date: String!) {
+    addEvent(name: $name, description: $description, date: $date) {
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
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_UPVOTE = gql`
  mutation addUpvote($songRequestId: ID!) {
    addUpvote(songRequestId: $songRequestId) {
      _id
      user {
        _id
        username
      }
      songRequest {
        _id
        title
      }
    }
  }
`;
