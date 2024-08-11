import React from 'react';
import EventComponent from './EventComponent';
import { useQuery } from '@apollo/client';
import { GET_EVENTS } from '../utils/queries';

const EventsList = ({ userId }) => {
  const { data, loading, error } = useQuery(GET_EVENTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {data.events.map((event) => (
        <EventComponent
          key={event._id}
          eventInfo={event}
          userId={userId}
        />
      ))}
    </div>
  );
};

export default EventsList;