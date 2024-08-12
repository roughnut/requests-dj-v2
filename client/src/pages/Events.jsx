import React from 'react';
import { useNavigate } from "react-router-dom";
import { useQuery } from '@apollo/client';
import EventsList from '../components/EventList'
import { GET_EVENTS } from '../utils/queries';
import { useSongContext } from '../utils/GlobalState';
import './Events.css'; // We'll create this CSS file next

const Events = () => {
  const { state } = useSongContext();
  const userId = state.user ? state.user._id : null;
  const {loading, error, data } = useQuery(GET_EVENTS);

  const navigate = useNavigate();

  const handleEventCreate = () => {
    navigate(`/events/create_event`);
  }

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>Error loading events: {error.message}</p>;

  const events = data?.events || [];

  return (
    <div className="events-page">
      <h1 className="events-title">Events</h1>
      <div className="create-event-container">
        <button 
          className="btn btn-primary create-event-button"
          onClick={handleEventCreate}
        >
          Create an Event
        </button>
      </div>
      <EventsList events={events} userId={userId} />
    </div>
  );
};

export default Events;