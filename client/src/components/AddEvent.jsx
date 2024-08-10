import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { ADD_EVENT } from '../utils/mutations';
import Auth from '../utils/auth';

const AddEvent = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');

  const { state } = useSongContext();
  const navigate = useNavigate();

  const [addEvent] = useMutation(ADD_EVENT);

  useEffect(() => {
    console.log('Auth token:', Auth.getToken());
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!Auth.loggedIn()) {
      alert('You need to be logged in to add an event!');
      navigate('/login');
      return;
    }

    if (!name || !description || !date) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      const token = Auth.getToken();
      console.log('Sending request with token:', token);

      const { data } = await addEvent({
        variables: { name, description, date },
        context: {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      });

      console.log('Response data:', data);

      if (data?.addEvent) {
        navigate('/');
      } else {
        alert('Failed to add event. Please try again later.');
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.graphQLErrors) {
        console.error('GraphQL errors:', error.graphQLErrors);
        error.graphQLErrors.forEach((err) => {
          console.error('GraphQL error details:', err);
        });
      }
      if (error.networkError) {
        console.error('Network error:', error.networkError);
      }
      if (error.message.includes('UNAUTHENTICATED')) {
        alert('You need to be logged in to add an event!');
        navigate('/login');
      } else {
        alert('Failed to add event. Please check the console for more details.');
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center text-4xl font-weight-bold mb-4">Add Event</h2>
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

export default AddEvent;
