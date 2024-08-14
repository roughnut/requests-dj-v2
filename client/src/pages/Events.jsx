import React from 'react';
import { useQuery } from '@apollo/client';
import EventsList from '../components/EventList'
import { GET_EVENTS } from '../utils/queries';
import { useSongContext } from '../utils/GlobalState';
import './Events.css';

const Events = () => {
  const { state } = useSongContext();
  const userId = state.user ? state.user._id : null;
  const {loading, error, data } = useQuery(GET_EVENTS);

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>Error loading events: {error.message}</p>;

  const events = data?.events || [];

  return (
    <div className="events-page">
      <h2 className="events-title">All events</h2>
      <EventsList events={events} userId={userId} />
    </div>
  );
};

export default Events;