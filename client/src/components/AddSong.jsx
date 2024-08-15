import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { ADD_SONG_REQUEST } from '../utils/mutations'; // Import your mutation
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

const AddSong = () => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id: eventId } = useParams(); // Get the event ID from the URL

  const [addSongRequest, { loading }] = useMutation(ADD_SONG_REQUEST, {
    onError: (error) => {
      setError(error.message);
      console.error('GraphQL error:', error);
      console.error('GraphQL error details:', JSON.stringify(error, null, 2));
      if (error.graphQLErrors) {
        error.graphQLErrors.forEach((graphQLError, index) => {
          console.error(`GraphQL Error ${index + 1}:`, graphQLError);
        });
      }
      if (error.networkError) {
        console.error('Network error:', error.networkError);
      }
    },
    onCompleted: () => {
      navigate(`/events/${eventId}`);
      window.location.reload();
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title) {
      alert('Please enter a song title.');
      return;
    }

    try {
      await addSongRequest({
        variables: {
          eventId,
          title,
          artist: artist || '',
        },
      });
    } catch (err) {
      setError('Song request failed. Please try again later.');
      console.error('Error in handleSubmit:', err);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center">
      <Row className="justify-content-center w-100">
        <Col xs={12} md={8} lg={6}>
          <div className="p-4 bg-light rounded-3 shadow">
            <h2 className="display-4 text-center p-2">Song Request</h2>
            {/* <p className="lead text-center">Fill out the form below to request a song for the event.</p> */}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="song-title">Song Title & Artist</Form.Label>
                <Form.Control
                  type="text"
                  id="song-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Enter song title & artist"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="song-artist">Your name</Form.Label>
                <Form.Control
                  type="text"
                  id="song-artist"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder="Enter your name"
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                className="w-100 mt-3"
                size="lg"
                disabled={loading} // Disable button while loading
              >
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
              {error && <p className="text-danger mt-2 text-center">{error}</p>}
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AddSong;