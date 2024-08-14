import React from 'react';
import EventComponent from './EventComponent';
import './EventList.css';

const OwnedEventsList = ({ events, userId, username }) => {
  if (!events || events.length === 0) {
    return <div className="loading">No events found.</div>;
  }

  return (
    <div className="events-list">
      <div className="events-grid">
        {events.map((event) => (
          <EventComponent
            key={event._id}
            eventInfo={event}
            userId={userId}
            username={username}
          />
        ))}
      </div>
    </div>
  );
};

export default OwnedEventsList;