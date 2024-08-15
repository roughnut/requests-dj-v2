import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { ADD_EVENT } from '../utils/mutations';
import Auth from '../utils/auth';
import { useSongContext } from '../utils/GlobalState';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const AddEvent = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState(null);

  const { state, setEvents } = useSongContext();
  const navigate = useNavigate();

  const [addEvent] = useMutation(ADD_EVENT);

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
        variables: { 
          name, 
          description, 
          date: new Date(date).toISOString(), // Format date to ISO string
        },
        context: {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      });

      console.log('Response data:', data);

      if (data?.addEvent) {
        // Update the global state with the new event
        setEvents([...state.events, data.addEvent]);
        navigate('/dashboard');
        window.location.reload();
      } else {
        alert('Failed to add event. Please try again later.');
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.graphQLErrors) {
        console.error('GraphQL errors:', error.graphQLErrors);
        error.graphQLErrors.forEach((err) => {
          console.error('GraphQL error details:', err);
          alert(`GraphQL Error: ${err.message}`);
        });
      }
      if (error.networkError) {
        console.error('Network error:', error.networkError);
        if (error.networkError.result && error.networkError.result.errors) {
          error.networkError.result.errors.forEach((err) => {
            console.error('Network error details:', err);
            alert(`Network Error: ${err.message}`);
          });
        } else {
          alert(`Network Error: ${error.networkError.message}`);
        }
      }
      if (error.message.includes('UNAUTHENTICATED')) {
        alert('You need to be logged in to add an event!');
        navigate('/login');
      } else if (!error.graphQLErrors && !error.networkError) {
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center">
      <Row className="justify-content-center w-100">
        <Col xs={12} md={8} lg={6}>
          <div className="p-4 bg-light rounded-3 shadow">
            <h1 className="display-4 text-center">Create a New Event</h1>
            <p className="lead text-center">Fill out the form below to add a new event to your lineup.</p>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label htmlFor="event-title">Event Title</Form.Label>
                <Form.Control
                  type="text"
                  id="event-title"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter event title"
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label htmlFor="event-desc">Event Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  id="event-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Describe your event"
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label htmlFor="event-date">Event Date</Form.Label>
                <Form.Control
                  type="date"
                  id="event-date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  min={new Date().toISOString().split('T')[0]} // Set minimum date to today
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                className="w-100 mt-4"
                size="lg"
              >
                Create Event
              </Button>
              {error && <p className="text-danger mt-2 text-center">{error}</p>}
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AddEvent;