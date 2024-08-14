import React from 'react';
import { useQuery } from '@apollo/client';
import { useNavigate } from "react-router-dom";
import OwnedEventsList from '../components/OwnedEventsList';
import { GET_ME } from '../utils/queries';
import Auth from '../utils/auth';
import './Events.css'; 

const Dashboard = () => {
  // Check if user is logged in
  const isLoggedIn = Auth.loggedIn();

  const { loading, error, data } = useQuery(GET_ME, {
    skip: !isLoggedIn,
    onError: (error) => {
      console.error('GraphQL error:', error);
      if (error.message.includes('Invalid token') || error.message.includes('jwt expired')) {
        Auth.logout();
        window.location.assign('/login');
      }
    }
  });

  const navigate = useNavigate();

  const handleEventCreate = () => {
    navigate(`/events/create_event`);
  };

  if (!isLoggedIn) return <p>Please log in to view your events.</p>;
  if (loading) return <p>Loading events...</p>;
  if (error) return <p>Error loading events: {error.message}</p>;

  const { events, _id: userId, username } = data.me;

  return (
    <div className="events-page">
      <div className="create-event-container">
        <button 
          className="btn btn-primary create-event-button"
          onClick={handleEventCreate}
        >
          Create an Event
        </button>
      </div>
      <h2 className="events-title">My Events</h2>
      {events && events.length > 0 ? (
        <OwnedEventsList events={events} userId={userId} username={username} />
      ) : (
        <p>You haven't created any events yet.</p>
      )}
    </div>
  );
};

export default Dashboard;