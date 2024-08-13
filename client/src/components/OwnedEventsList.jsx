import React from 'react';
import EventComponent from './EventComponent';
import { useQuery } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import './EventList.css'; // We'll create this CSS file next

const OwnedEventsList = ({ userId }) => {
  // Use the query to get the currently logged-in user's data
  const { data, loading, error } = useQuery(GET_ME);

  if (loading) return <div className="loading">Loading events...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  // Extract events from the data returned by the query
  const events = data?.me?.events || [];

  return (
    <div className="events-list">
      <h2 className="events-list-title">Hosted Events</h2>
      <div className="events-grid">
        {events.map((event) => (
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

export default OwnedEventsList;