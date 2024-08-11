import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_EVENT } from '../utils/mutations';
import { GET_EVENT } from '../utils/queries';

const UpdateEvent = () => {
  const { id } = useParams(); // Get event ID from URL
  const navigate = useNavigate();

  // States for form fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  // Query to fetch event details
  const { data, loading, error } = useQuery(GET_EVENT, {
    variables: { _id: id }, // Adjust to use _id based on your schema
  });

  const [updateEvent] = useMutation(UPDATE_EVENT);

  useEffect(() => {
    if (data && data.event) {
      setName(data.event.name);
      setDescription(data.event.description);

      // Handle date formatting
      const eventDate = data.event.date;
      if (eventDate) {
        // Try to parse and format date
        const parsedDate = new Date(eventDate);
        if (!isNaN(parsedDate.getTime())) {
          setDate(parsedDate.toISOString().split('T')[0]); // Format date for the input? doesnt seem to be working.
        }
      }
    }
  }, [data]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name || !description || !date) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      await updateEvent({
        variables: {
          eventId: id, // Pass event ID as variable
          name,
          description,
          date: new Date(date).toISOString(), // Format date to ISO string
        },
      });
      alert('Event updated successfully');
      navigate('/events');
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      alert('Event update failed. Please try again later.');
    }
  };

  if (loading) return <p>Loading...</p>; // Loading state
  if (error) return <p>Error: {error.message}</p>; // Error state

  return (
    <div className="container mt-5">
      <h2 className="text-center text-4xl font-weight-bold mb-4">Update Event</h2>
      <form className="mx-auto" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="event-title" className="form-label">Event Title:</label>
          <input
            type="text"
            id="event-title"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="event-desc" className="form-label">Event Description:</label>
          <input
            type="text"
            id="event-desc"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="event-date" className="form-label">Event Date:</label>
          <input
            type="date"
            id="event-date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
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

export default UpdateEvent;