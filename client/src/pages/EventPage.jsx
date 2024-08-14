import React from 'react';
import { useQuery } from '@apollo/client';
import { useParams, useNavigate } from 'react-router-dom';
import SongsList from '../components/SongsList';
import { GET_EVENT, GET_SONG_REQUESTS } from "../utils/queries";

const EventPage = () => {
  const { id } = useParams(); // Retrieve the event ID from the URL
  const navigate = useNavigate();

  // Query to get event details
  const {
    loading: eventLoading,
    error: eventError,
    data: eventData,
  } = useQuery(GET_EVENT, {
    variables: { _id: id },
  });

  // Query to get song requests
  const {
    loading: songsLoading,
    error: songsError,
    data: songsData,
  } = useQuery(GET_SONG_REQUESTS, {
    variables: { event: id },
  });
if (eventLoading || songsLoading) return <p>Loading...</p>;
if (eventError) return <p>Error loading event: {eventError.message}</p>;
if (songsError) return <p>Error loading song requests: {songsError.message}</p>;

const event = eventData?.event;
const songRequests = songsData?.songRequests;

  const handleSongAdd = () => {
    navigate(`/events/${id}/add_song`);
  };

  console.log("Event: ", event);
  console.log("Song Requests: ", songRequests);

  return (
    <div>
      <h2 className="text-4xl font-bold text-custom-charcoal">{event.name}</h2>
      <p className="text-2xl font-bold">{event.description}</p>
      <h4>DJ: {event.user.username}</h4>
      <button className="btn btn-dark m-2" onClick={handleSongAdd}>
        Request a Song
      </button>
      <SongsList eventId={id} />
    </div>
  );
};

export default EventPage;