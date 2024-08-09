import React from 'react';
import { useParams } from 'react-router-dom';
import SongsList from '../components/SongsList';

const EventPage = () => {
  const { id } = useParams(); // Retrieve the event ID from the URL

  return (
    <div>
      <h1 className="text-4xl font-bold text-custom-charcoal">Event Details</h1>
      {/* Fetch and display event details here */}
      <SongsList eventId={id} />
    </div>
  );
};

export default EventPage;