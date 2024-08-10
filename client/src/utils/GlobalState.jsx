import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
import Auth from "./auth";

// Create the context
const SongContext = createContext();

// Initial state
const initialState = {
  user: Auth.getProfile() || null,
  isAuthenticated: Auth.loggedIn(),
  events: [],
  currentEvent: null,
  songRequests: [],
  isModalOpen: false,
  error: null,
  loading: false,
};

// Provider component
const SongProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  // Function to update state
  const updateState = (newState) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  // Specific update functions
  const setUser = (user) => updateState({ user, isAuthenticated: !!user });
  const setEvents = (events) => updateState({ events });
  const setCurrentEvent = (currentEvent) => updateState({ currentEvent });
  const setSongRequests = (songRequests) => updateState({ songRequests });
  const setIsModalOpen = (isModalOpen) => updateState({ isModalOpen });
  const setError = (error) => updateState({ error });
  const setLoading = (loading) => updateState({ loading });

  // Value to be provided to consumers
  const value = {
    state,
    setUser,
    setEvents,
    setCurrentEvent,
    setSongRequests,
    setIsModalOpen,
    setError,
    setLoading,
  };

  return <SongContext.Provider value={value}>{children}</SongContext.Provider>;
};

// PropTypes for the provider
SongProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook to use the context
const useSongContext = () => {
  const context = useContext(SongContext);
  if (!context) {
    throw new Error("useSongContext must be used within a SongProvider");
  }
  return context;
};

export { SongProvider, useSongContext };

// Comments:
// - We've replaced the useReducer with useState for simpler state management.
// - Instead of dispatching actions, we now have specific functions to update each part of the state.
// - The context now provides both the state and these update functions.
// - Consumers can use the useSongContext hook to access both state and update functions.
// - This approach is more straightforward for simpler applications while still providing global state management.
