import React, { useState } from 'react';
import { FaThumbsUp } from 'react-icons/fa';

const Song = ({ song, onUpvote }) => {
  const [upvotes, setUpvotes] = useState(song.upvotes);

  const handleUpvote = () => {
    onUpvote(song.id);
    setUpvotes(upvotes + 1);
    if (onUpvote) {
        onUpvote(song.id); // Pass the song ID to the parent
      }
  };

  return (
    <div className="border border-success p-3 rounded transition-shadow hover-shadow-sm m-2">
      <header className="h5 fw-bold text-dark">{song.title}</header>
      <p className="mb-1">Artist: {song.artist}</p>
      <p className="mb-1">Requested by: {song.requestedBy}</p>
      <p className="mb-1">E.ID: {song.eventId}</p>
      <p className="mb-1">Votes: {upvotes}</p>
      <button className="btn btn-dark" onClick={handleUpvote}>
        <FaThumbsUp /> Upvote
      </button>
    </div>
  );
};

export default Song;