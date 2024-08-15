import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_EVENT } from '../utils/mutations';
import { GET_EVENT } from '../utils/queries';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';


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

      console.log(eventDate);

      const parsedDate = new Date(parseInt(eventDate, 10));
      console.log("Parsed Date:", parsedDate);

      const year = parsedDate.getFullYear();
      const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const day = String(parsedDate.getDate()).padStart(2, '0');

      console.log("Year:", year);   // Output: 2024
      console.log("Month:", month); // Output: 08
      console.log("Day:", day);     // Output: 24

      const formattedDate = `${year}-${month}-${day}`;
      setDate(formattedDate);
    }
  }, [data]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name || !description || !date) {
      alert('Please fill out all fields.');
      return;
    }

    if (new Date(date).getTime() < Date.now()) {
      alert('Please select a date in the future.');
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
      navigate('/dashboard');
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      alert('Event update failed. Please try again later.');
    }
  };

  if (loading) return <p>Loading...</p>; // Loading state
  if (error) return <p>Error: {error.message}</p>; // Error state

  console.log(name, description, date, data.event.date);
  return (
    <Container className="d-flex justify-content-center align-items-center">
      <Row className="justify-content-center w-100">
        <Col xs={12} md={8} lg={6}>
          <div className="p-4 bg-light rounded-3 shadow">
            <h1 className="display-4 text-center">Update your Event</h1>
            <p className="lead text-center">Change any exisitng details from your event below.</p>
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
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                className="w-100 mt-4"
                size="lg"
              >
                Update Event
              </Button>
              {error && <p className="text-danger mt-2 text-center">{error}</p>}
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default UpdateEvent;