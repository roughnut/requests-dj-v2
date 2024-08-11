import React from 'react';
import EventComponent from './EventComponent';
import { useQuery } from '@apollo/client';
import { GET_EVENTS } from '../utils/queries';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';

const EventsList = ({ userId }) => {
  const { data, loading, error } = useQuery(GET_EVENTS);

  if (loading) return (
    <Container className="text-center mt-5">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </Container>
  );

  if (error) return (
    <Container className="mt-5">
      <Alert variant="danger">
        Error: {error.message}
      </Alert>
    </Container>
  );

  return (
    <Container className="py-5">
      <h2 className="text-center mb-4">Upcoming Events</h2>
      <Row xs={1} md={2} lg={3} className="g-4">
        {data.events.map((event) => (
          <Col key={event._id}>
            <EventComponent
              eventInfo={event}
              userId={userId}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default EventsList;