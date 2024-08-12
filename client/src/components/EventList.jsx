import React from 'react';
import EventComponent from './EventComponent';
import { useQuery } from '@apollo/client';
import { GET_EVENTS } from '../utils/queries';
import './EventList.css'; // We'll create this CSS file next

const EventsList = ({ userId }) => {
  const { data, loading, error } = useQuery(GET_EVENTS);

  if (loading) return <div className="loading">Loading events...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div className="events-list">
      <h2 className="events-list-title">Upcoming Events</h2>
      <div className="events-grid">
        {data.events.map((event) => (
          <EventComponent
            key={event._id}
            eventInfo={event}
            userId={userId}
          />
        ))}
      </div>
    </div>
  );
};

export default EventsList;