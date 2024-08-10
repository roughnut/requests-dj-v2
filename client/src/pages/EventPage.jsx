import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SongsList from '../components/SongsList';

const EventPage = () => {
  const { id } = useParams(); // Retrieve the event ID from the URL

  const navigate = useNavigate();

  const handleSongAdd = () => {
    navigate(`/events/${id}/add_song`);
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-custom-charcoal">Event Details</h1>
      {/* Fetch and display event details here */}
      <button 
            className="btn btn-dark m-2"
            onClick={handleSongAdd}
          >
            Add a Song
          </button>
      <SongsList eventId={id} />
    </div>
  );
};

export default EventPage;