import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const AddSong = () => {
  const [name, setName] = useState('');
  const [artist, setArtist] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name || !artist) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      const response = await fetch(`/api/events/${id}/`, {
        method: 'POST',
        body: JSON.stringify({ name, artist }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        navigate(`/events/${id}`);
      } else {
        alert('Song request failed. Please try again later.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Song request failed. Please try again later.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center text-4xl font-weight-bold mb-4">Add Song</h2>
      <form className="mx-auto" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="event-title" className="form-label">Song Title:</label>
          <input
            type="text"
            id="song-title"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="event-desc" className="form-label">Song Artist:</label>
          <input
            type="text"
            id="song-artist"
            className="form-control"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="btn btn-dark btn-lg w-100 mt-4"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddSong;