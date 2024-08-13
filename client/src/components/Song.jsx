import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaThumbsUp } from 'react-icons/fa';
import { useMutation } from '@apollo/client';
import { ADD_UPVOTE, REMOVE_UPVOTE } from '../utils/mutations';

const Song = ({ song, onUpvote, addUpvote, refetch }) => {
  const [upvotes, setUpvotes] = useState(song?.upvotes || 0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [guestId, setGuestId] = useState(null);

  const [addUpvoteMutation] = useMutation(ADD_UPVOTE);
  const [removeUpvoteMutation] = useMutation(REMOVE_UPVOTE);

  useEffect(() => {
    let storedGuestId = localStorage.getItem('guestId');
    if (!storedGuestId) {
      storedGuestId = `guest_${Date.now()}`;
      localStorage.setItem('guestId', storedGuestId);
    }
    setGuestId(storedGuestId);
    console.log('Guest ID set:', storedGuestId);
  }, []);

  useEffect(() => {
    if (song && song._id && guestId) {
      const upvoteStatus = localStorage.getItem(`hasVoted_${song._id}_${guestId}`);
      setHasUpvoted(upvoteStatus === 'true');
    }
  }, [song, guestId]);

  const handleUpvote = async () => {
    if (!guestId) {
      console.error('No guestId found. Unable to upvote.');
      alert('Unable to upvote. Please try refreshing the page.');
      return;
    }

    if (!song || !song._id) {
      console.error('Invalid song data:', song);
      alert('Invalid song data. Please try again.');
      return;
    }

    try {
      console.log('Upvoting song:', JSON.stringify(song, null, 2));
      console.log('Current upvote status:', hasUpvoted);
      console.log('Using guestId:', guestId);

      const mutation = hasUpvoted ? removeUpvoteMutation : addUpvoteMutation;
      const mutationName = hasUpvoted ? 'removeUpvote' : 'addUpvote';
      
      console.log(`Executing ${mutationName} mutation with variables:`, JSON.stringify({ songRequestId: song._id, guestId }, null, 2));
      
      const { data, errors } = await mutation({
        variables: { songRequestId: song._id, guestId },
      });

      console.log(`${mutationName} mutation response:`, JSON.stringify({ data, errors }, null, 2));

      if (errors) {
        console.error('GraphQL errors:', JSON.stringify(errors, null, 2));
        throw new Error(errors[0].message);
      }

      if (data) {
        const updatedSong = data[mutationName];
        if (updatedSong) {
          console.log('Updated song:', JSON.stringify(updatedSong, null, 2));
          setUpvotes(updatedSong.upvotes);
          const newUpvoteStatus = !hasUpvoted;
          setHasUpvoted(newUpvoteStatus);
          localStorage.setItem(`hasVoted_${song._id}_${guestId}`, newUpvoteStatus.toString());
          refetch();
        } else {
          console.error('Unexpected mutation response:', JSON.stringify(data, null, 2));
        }
      } else {
        console.error('No data returned from mutation');
      }

      if (onUpvote) {
        onUpvote(song._id);
      }
    } catch (err) {
      console.error('Error upvoting:', err);
      if (err.message.includes('User ID or Guest ID is required')) {
        console.error('GuestId not properly passed to mutation. Current guestId:', guestId);
        alert('Unable to upvote. Please try refreshing the page.');
      }
      if (err.graphQLErrors) {
        console.error('GraphQL errors:', JSON.stringify(err.graphQLErrors, null, 2));
      }
      if (err.networkError) {
        console.error('Network error:', err.networkError);
        if (err.networkError.result) {
          console.error('Network error result:', JSON.stringify(err.networkError.result, null, 2));
          if (err.networkError.result.errors) {
            console.error('Server errors:', JSON.stringify(err.networkError.result.errors, null, 2));
          }
        }
      }
    }
  };

  const handleButtonClick = async () => {
    await handleUpvote();
    // if (addUpvote) {
    //   addUpvote(song._id);
    // }
  };

  if (!song) {
    return null;
  }

  return (
    <div className="song-card">
      <header className="song-title">{song.title}</header>
      <p className="song-artist">{song.artist}</p>
      <p className="song-votes">Votes: {upvotes}</p>
      <button
        className={`btn ${hasUpvoted ? 'btn-success' : 'btn-dark'}`}
        onClick={handleButtonClick}
      >
        <FaThumbsUp /> {hasUpvoted ? 'Unvote' : 'Upvote'}
      </button>
    </div>
  );
};

Song.propTypes = {
  song: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    upvotes: PropTypes.number,
  }).isRequired,
  onUpvote: PropTypes.func,
  addUpvote: PropTypes.func,
};

export default Song;