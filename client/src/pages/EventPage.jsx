import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SongsList from '../components/SongsList';
import { GET_EVENTS } from '../utils/queries';

const EventPage = () => {
  const { id } = useParams(); // Retrieve the event ID from the URL
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_EVENTS);

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>Error loadng events: {error.message}</p>;

  const handleSongAdd = () => {
    navigate(`/events/${id}/add_song`);
  }

  const event = data?.event;

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