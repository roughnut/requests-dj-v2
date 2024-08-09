import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Song from './Song';
import songData from '../utils/songData';

// const SongsList = ({ eventId }) => {
//   const [songs, setSongs] = useState([]);

//   useEffect(() => {
//     const fetchSongs = async () => {
//       try {
//         const response = await fetch(`/api/events/${eventId}/songs`);
//         if (response.ok) {
//           const data = await response.json();
//           setSongs(data.songs);
//         } else {
//           console.error('Failed to fetch songs');
//         }
//       } catch (error) {
//         console.error('Error fetching songs:', error);
//       }
//     };

//     fetchSongs();
//   }, [eventId]);

//   const handleUpvote = async (songId) => {
//     try {
//       const response = await fetch(`/api/songs/${songId}/upvote`, {
//         method: 'POST',
//       });
//       if (response.ok) {
//         // Update song list or refresh the page if needed
//       } else {
//         console.error('Failed to upvote song');
//       }
//     } catch (error) {
//       console.error('Error upvoting song:', error);
//     }
//   };

//   return (
//     <div>
//       {songs.map((song) => (
//         <Song key={song.id} song={song} onUpvote={handleUpvote} />
//       ))}
//     </div>
//   );
// };

const SongsList = () => {

  const { id: eventId } = useParams(); // Get the event ID from the URL
  const [songs, setSongs] = useState(
    songData.filter(song => song.eventId === parseInt(eventId)) // Filter songs by eventId
  );

  const handleUpvote = (songId) => {
    setSongs(songs.map(song => 
      song.id === songId ? { ...song, upvotes: song.upvotes + 1 } : song
    ));
  };


  return (
    <div className="container mt-4">
      <h2>Songs List</h2>
      <div className="row">
        {songs.map(song => (
          <div className="col-12 mb-3" key={song.id}>
            <Song song={song} onUpvote={handleUpvote}/>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SongsList;