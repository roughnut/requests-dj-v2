import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

export default function Home() {
  return (
    <Container>
      <Row className="my-5">
        <Col>
          <div className="p-5 mb-4 bg-light rounded-3">
            <h1 className="display-4">Audience interaction, made easy.</h1>
            <p className="lead">Manage events and get song requests in a snap!</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={8}>
          <h2 className="mb-4">About Requests.DJ</h2>
          <p className="text-muted">
            Request.DJ is a platform that allows DJs and event organizers to create interactive
            playlists for their events. Attendees can request songs, vote on upcoming tracks,
            and engage with the music selection process in real-time.
          </p>
          <p className="text-muted">
            Whether you're hosting a wedding, a corporate event, or a night at the club,
            Request.DJ helps you create a memorable and engaging musical experience for your audience.
          </p>
        </Col>
        <Col md={4}>
          <h3 className="mb-3">Features</h3>
          <ul className="list-group">
            <li className="list-group-item">Create and manage events</li>
            <li className="list-group-item">Real-time song requests</li>
            <li className="list-group-item">Voting system for tracks</li>
            <li className="list-group-item">Dashboard for playlist management</li>
            <li className="list-group-item">Mobile-friendly </li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
}
