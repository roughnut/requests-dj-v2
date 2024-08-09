import React from 'react';
import { useNavigate } from "react-router-dom";
import EventsList from '../components/EventList'

const Events = () => {
  // Example data, to be changed out when database connected
  const events = [
    { id: '1', name: 'Event 1', user_id: 'user1', createdBy: "Sam" },
    { id: '2', name: 'Event 2', user_id: 'user2', createdBy: "Stavos" },
    // ...more events
  ];

  // Sample userId to simulate being the owner of the event.
  const userId = 'user1';

  const navigate = useNavigate();

  const handleEventCreate = () => {
    navigate(`/events/create_event`);
  }

  return (
    <div>
      <h1>Events</h1>
      <button 
            className="btn btn-dark m-2"
            onClick={handleEventCreate}
          >
            Create an Event
          </button>
      <EventsList events={events} userId={userId} />
    </div>
  );
};

export default Events;