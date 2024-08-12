import React, { useState } from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import { useMutation } from '@apollo/client';
import { ADD_UPVOTE } from '../utils/mutations';

const Song = ({ song, onUpvote }) => {
  const [upvotes, setUpvotes] = useState(song.upvotes.length);
  const [addUpvote, { loading, error }] = useMutation(ADD_UPVOTE);

  const handleUpvote = async () => {
    try {
      await addUpvote({ variables: { songRequestId: song._id } });
      setUpvotes(upvotes + 1); // Update upvote count optimistically
      if (onUpvote) {
        onUpvote(song._id); // Call parent handler if needed
      }
    } catch (err) {
      console.error('Error upvoting:', err);
      alert('Failed to upvote. Please try again.');
    }
  };

  return (
    <div className="border border-success p-3 rounded transition-shadow hover-shadow-sm m-2">
      <header className="h5 fw-bold text-dark">{song.title}</header>
      <p className="mb-1">Artist: {song.artist}</p>
      <p className="mb-1">Votes: {song.upvotes.length}</p>
      <button
        className="btn btn-dark"
        onClick={handleUpvote}
        disabled={loading} // Disable button while loading
      >
        <FaThumbsUp /> {loading ? 'Upvoting...' : 'Upvote'}
      </button>
      {error && <p className="text-danger mt-2">Error upvoting song.</p>}
    </div>
  );
};

export default Song;