import React from 'react';
import EventComponent from './EventComponent';

const EventsList = ({ events, userId }) => {
  return (
    <div>
        {/* This will map out each event to the events page. */}
      {events.map(event => (
        <EventComponent key={event.id} eventInfo={event} userId={userId} />
      ))}
    </div>
  );
};

export default EventsList;