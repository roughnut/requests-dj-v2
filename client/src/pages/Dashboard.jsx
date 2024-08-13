import React from 'react';
import { useQuery } from '@apollo/client';
import OwnedEventsList from '../components/OwnedEventsList';
import { GET_ME } from '../utils/queries';
import { useSongContext } from '../utils/GlobalState';
import './Events.css'; // We'll create this CSS file next

const Dashboard = () => {
  const { state } = useSongContext();
  const userId = state.user ? state.user._id : null;
  
  const { loading, error, data } = useQuery(GET_ME);

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>Error loading events: {error.message}</p>;

  // Extract events from data.me
  const events = data?.me?.events || [];

  return (
    <div className="events-page">
      <h1 className="events-title">Events</h1>
      <OwnedEventsList events={events} userId={userId} />
    </div>
  );
};

export default Dashboard;