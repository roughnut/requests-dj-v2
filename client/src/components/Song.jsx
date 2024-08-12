import React, { useState, useEffect } from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import { useMutation } from '@apollo/client';
import { ADD_UPVOTE, REMOVE_UPVOTE } from '../utils/mutations';

const Song = ({ song, onUpvote }) => {
  const [upvotes, setUpvotes] = useState(song.upvotes.length);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  const [addUpvote, { loading: addingLoading, error: addError }] = useMutation(ADD_UPVOTE);
  const [removeUpvote, { loading: removingLoading, error: removeError }] = useMutation(REMOVE_UPVOTE);

  // Initialize guestId on component mount
  useEffect(() => {
    let guestId = localStorage.getItem('guestId');
    if (!guestId) {
      guestId = `guest_${Date.now()}`;
      localStorage.setItem('guestId', guestId);
    }
  }, []);

  useEffect(() => {
    const upvoteStatus = localStorage.getItem(`hasVoted_${song._id}`);
    if (upvoteStatus === null) {
      localStorage.setItem(`hasVoted_${song._id}`, 'false');
      setHasUpvoted(false);
    } else {
      setHasUpvoted(upvoteStatus === 'true');
    }
  }, [song._id]);

  const handleUpvote = async () => {
    const guestId = localStorage.getItem('guestId');

    if (!guestId) {
      alert('You need to be logged in to upvote.');
      return;
    }

    try {
      if (hasUpvoted) {
        await removeUpvote({ variables: { upvoteId: guestId || song._id } });
        setUpvotes(upvotes - 1);
        localStorage.setItem(`hasVoted_${song._id}`, 'false');
      } else {
        await addUpvote({ variables: { songRequestId: song._id } });
        setUpvotes(upvotes + 1);
        localStorage.setItem(`hasVoted_${song._id}`, 'true');
      }
      setHasUpvoted(!hasUpvoted);
      if (onUpvote) {
        onUpvote(song._id);
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
      <p className="mb-1">Votes: {upvotes}</p>
      <button
        className={`btn ${hasUpvoted ? 'btn-success' : 'btn-dark'}`}
        onClick={handleUpvote}
        disabled={addingLoading || removingLoading} // Disable button while loading
      >
        <FaThumbsUp /> {hasUpvoted ? 'Unvote' : 'Upvote'}
      </button>
      {(addError || removeError) && <p className="text-danger mt-2">Error: {addError?.message || removeError?.message}</p>}
    </div>
  );
};

export default Song;