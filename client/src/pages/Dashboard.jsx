import React from 'react';
import { useQuery } from '@apollo/client';
import OwnedEventsList from '../components/OwnedEventsList';
import { GET_ME } from '../utils/queries';
import { useSongContext } from '../utils/GlobalState';
import Auth from '../utils/auth';
import './Events.css'; 

const Dashboard = () => {
  const { state } = useSongContext();
  const userId = state.user ? state.user._id : null;
  
  // Check if user is logged in
  const isLoggedIn = Auth.loggedIn();

  const { loading, error, data } = useQuery(GET_ME, {
    skip: !isLoggedIn, // Skip the query if user is not logged in
    onError: (error) => {
      console.error('GraphQL error:', error);
      // Handle token expiration
      if (error.message.includes('Invalid token') || error.message.includes('jwt expired')) {
        Auth.logout(); // Log out the user if token is invalid or expired
        window.location.assign('/login'); // Redirect to login page
      }
    }
  });

  if (!isLoggedIn) return <p>Please log in to view your events.</p>;
  if (loading) return <p>Loading events...</p>;
  if (error) {
    console.error('Error in Dashboard component:', error);
    return <p>Error loading events: {error.message}</p>;
  }

  // Extract events from data.me
  const events = data?.me?.events || [];

  return (
    <div className="events-page">
      <h1 className="events-title">My Events</h1>
      {events.length > 0 ? (
        <OwnedEventsList events={events} userId={userId} />
      ) : (
        <p>You haven't created any events yet.</p>
      )}
    </div>
  );
};

export default Dashboard;