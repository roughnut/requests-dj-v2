import {
  LOGIN_USER,
  LOGOUT_USER,
  UPDATE_USER,
  ADD_EVENT,
  UPDATE_EVENT,
  REMOVE_EVENT,
  SET_CURRENT_EVENT,
  ADD_SONG_REQUEST,
  UPDATE_SONG_REQUEST,
  REMOVE_SONG_REQUEST,
  ADD_UPVOTE,
  REMOVE_UPVOTE,
  TOGGLE_MODAL,
  SET_ERROR,
  CLEAR_ERROR,
  SET_LOADING
} from './actions';

export const reducer = (state, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true
      };
    case LOGOUT_USER:
      return {
        ...state,
        user: null,
        isAuthenticated: false
      };
    case UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    case ADD_EVENT:
      return {
        ...state,
        events: [...state.events, action.payload]
      };
    case UPDATE_EVENT:
      return {
        ...state,
        events: state.events.map(event => 
          event._id === action.payload._id ? action.payload : event
        )
      };
    case REMOVE_EVENT:
      return {
        ...state,
        events: state.events.filter(event => event._id !== action.payload)
      };
    case SET_CURRENT_EVENT:
      return {
        ...state,
        currentEvent: action.payload
      };
    case ADD_SONG_REQUEST:
      return {
        ...state,
        songRequests: [...state.songRequests, action.payload]
      };
    case UPDATE_SONG_REQUEST:
      return {
        ...state,
        songRequests: state.songRequests.map(request => 
          request._id === action.payload._id ? action.payload : request
        )
      };
    case REMOVE_SONG_REQUEST:
      return {
        ...state,
        songRequests: state.songRequests.filter(request => request._id !== action.payload)
      };
    case ADD_UPVOTE:
      return {
        ...state,
        songRequests: state.songRequests.map(request =>
          request._id === action.payload.songRequestId
            ? { ...request, upvotes: [...request.upvotes, action.payload.upvote] }
            : request
        )
      };
    case REMOVE_UPVOTE:
      return {
        ...state,
        songRequests: state.songRequests.map(request =>
          request._id === action.payload.songRequestId
            ? { ...request, upvotes: request.upvotes.filter(upvote => upvote._id !== action.payload.upvoteId) }
            : request
        )
      };
    case TOGGLE_MODAL:
      return {
        ...state,
        isModalOpen: !state.isModalOpen
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload
      };
    case CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

export const initialState = {
  user: null,
  isAuthenticated: false,
  events: [],
  currentEvent: null,
  songRequests: [],
  isModalOpen: false,
  error: null,
  loading: false
};