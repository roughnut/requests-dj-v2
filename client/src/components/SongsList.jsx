import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import Song from './Song';
import { GET_SONG_REQUESTS } from '../utils/queries'; // Import your GraphQL query
import { ADD_UPVOTE } from '../utils/mutations'; // Import a mutation for upvoting (if you have one)

const SongsList = () => {
  const { id: eventId } = useParams(); // Get the event ID from the URL

  // Fetch songs from the server using the GET_SONG_REQUESTS query
  const { loading, error, data } = useQuery(GET_SONG_REQUESTS, {
    variables: { event: eventId },
  });

  // Optionally, use a mutation to handle upvotes
  const [upvoteSong] = useMutation(ADD_UPVOTE);

  const handleUpvote = async (songId) => {
    try {
      await upvoteSong({
        variables: { id: songId },
        refetchQueries: [{ query: GET_SONG_REQUESTS, variables: { event: eventId } }],
      });
    } catch (error) {
      console.error('Error upvoting song:', error);
    }
  };

  if (loading) return <p>Loading songs...</p>;
  if (error) return <p>Error loading songs: {error.message}</p>;

  const songs = data?.songRequests || [];

  console.log(songs);

  return (
    <div className="container mt-4">
      <h2>Songs List</h2>
      <div className="row">
        {songs.length > 0 ? (
          songs.map(song => (
            <div className="col-12 mb-3" key={song._id}>
              <Song key={song.id} song={song} onUpvote={handleUpvote} />
            </div>
          ))
        ) : (
          <p>No songs have been requested for this event yet.</p>
        )}
      </div>
    </div>
  );
};

export default SongsList;