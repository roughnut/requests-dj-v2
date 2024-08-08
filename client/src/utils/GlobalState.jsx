import { createContext, useContext, useReducer } from "react";
import { reducer } from "./reducers";
import PropTypes from "prop-types";

const SongContext = createContext();
const { Provider } = SongContext;

const initialState = {
  user: null,
  isAuthenticated: false,
  events: [],
  currentEvent: null,
  songRequests: [],
  isModalOpen: false,
  error: null,
  loading: false,
};

const SongProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <Provider value={[state, dispatch]}>{children}</Provider>;
};

SongProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const useSongContext = () => useContext(SongContext);

export { SongProvider, useSongContext };
