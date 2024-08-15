// import React from 'react';
import { useQuery, /*useMutation*/ } from '@apollo/client';
import { useParams } from 'react-router-dom';
import Song from './Song';
import './SongsList.css';
import { GET_SONG_REQUESTS } from '../utils/queries';
// import { ADD_UPVOTE } from '../utils/mutations';

const SongsList = () => {
  const { id: eventId } = useParams();

  const { loading, error, data, refetch  } = useQuery(GET_SONG_REQUESTS, {
    variables: { event: eventId },
    fetchPolicy: 'cache-and-network',
  });

  // const [upvoteSong] = useMutation(ADD_UPVOTE);

  // const handleUpvote = async (songId) => {
  //   try {
  //     await upvoteSong({
  //       variables: { songRequestId: songId },
  //       update: (cache, { data: { addUpvote } }) => {
  //         const existingData = cache.readQuery({
  //           query: GET_SONG_REQUESTS,
  //           variables: { event: eventId },
  //         });

  //         if (existingData && existingData.songRequests) {
  //           const updatedRequests = existingData.songRequests.map((song) =>
  //             song._id === addUpvote._id ? { ...song, ...addUpvote } : song
  //           );

  //           cache.writeQuery({
  //             query: GET_SONG_REQUESTS,
  //             variables: { event: eventId },
  //             data: { songRequests: updatedRequests },
  //           });
  //         }
  //       },
  //     });
  //     // Refetch to ensure data consistency
  //     await refetch();
  //   } catch (error) {
  //     console.error('Error upvoting song:', error);
  //   }
  // };

  if (loading) return <p>Loading songs...</p>;
  if (error) return <p>Error loading songs: {error.message}</p>;

  const songs = data?.songRequests || [];

  return (
    <div className="songs-list">
      {/* <h2 className='songs-list-title'>Songs List</h2> */}
      <div className="songs-grid">
        {songs.length > 0 ? (
          songs.map(song => (
            <div className='songs-song' key={song._id}>
              <Song song={song} refetch={refetch} />
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