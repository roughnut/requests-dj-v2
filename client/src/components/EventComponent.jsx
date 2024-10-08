import React from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { REMOVE_EVENT } from "../utils/mutations";
import { formatDate } from "../utils/formatDate";
import { useSongContext } from "../utils/GlobalState";

const EventComponent = ({ eventInfo, username }) => {
  const { state } = useSongContext();
  const { user } = state;
  const userId = user ? user.data._id : null;
  const navigate = useNavigate();
  const [deleteEvent] = useMutation(REMOVE_EVENT);

  if (!eventInfo) {
    return <div>Loading event information...</div>;
  }

  const handleBoxClick = () => {
    navigate(`/events/${eventInfo._id}`);
  };

  const handleDeleteClick = async (e) => {
    e.stopPropagation();

    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent({ variables: { eventId: eventInfo._id } });
        alert('Event deleted successfully');
        window.location.reload();
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event');
      }
    }
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    const eventUrl = `${window.location.origin}/events/${eventInfo._id}`;
    navigator.clipboard.writeText(eventUrl)
      .then(() => {
        alert('Event link copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy event link: ', err);
        alert('Failed to copy event link');
      });
  };

  return (
    <div
      className="event-card"
      onClick={handleBoxClick}
    >
      <h3 className="event-title">{eventInfo.name}</h3>
      <p className="event-host">
        Hosted by {username}
      </p>
      <p className="event-description">{eventInfo.description}</p>
      <p className="event-date">Date: {formatDate(eventInfo.date)}</p>
      <div className="event-actions">
        <button 
          className="btn btn-outline-primary event-action-btn"
          onClick={handleShareClick}
        >
          Share Event
        </button>
        <Link
          to={`/events/${eventInfo._id}/update`}
          className="btn btn-outline-primary event-action-btn"
          onClick={(e) => e.stopPropagation()}
        >
          Update Event
        </Link>
        <button 
          className="btn btn-outline-danger event-action-btn"
          onClick={handleDeleteClick}
        >
          Delete Event
        </button>
      </div>
    </div>
  );
};

EventComponent.propTypes = {
  eventInfo: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    user: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
    }),
  }),
};

export default EventComponent;
