import React from "react";
import { useNavigate } from "react-router-dom";

const EventComponent = ({ eventInfo, userId }) => {
  const navigate = useNavigate();

  const handleBoxClick = () => {
    navigate(`/events/${eventInfo.id}`);
  };

  const handleDeleteClick = async (e) => {
    e.stopPropagation(); // Prevents the box click handler from firing
    if (window.confirm('Are you sure you want to delete this event?')) {
      await deleteEvent(eventInfo.id);
    }
  };

  return (
    <div
      className="border border-success p-3 rounded transition-shadow hover-shadow-sm m-2"
      onClick={handleBoxClick}
      style={{ cursor: "pointer" }}
    >
      <header className="h5 fw-bold text-dark">{eventInfo.name}</header>
      <p className="mb-1">Hosted by {eventInfo.createdBy}</p>

      {eventInfo.user_id === userId && (
        <div className="mt-2">
          <a
            href={`/events/update/${eventInfo.id}`}
            className="btn btn-dark m-2"
            onClick={(e) => e.stopPropagation()}
          >
            Update Event
          </a>
          <button 
            className="btn btn-dark m-2"
            onClick={handleDeleteClick}
          >
            Delete Event
          </button>
        </div>
      )}
    </div>
  );
};


// To handle deleting an event, will be updated once server connected.
const deleteEvent = async (eventId) => {
  try {
    const response = await fetch(`/api/events/${eventId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete event');
    }

    alert('Event deleted successfully');
  } catch (error) {
    console.error('Error deleting event:', error);
    alert('Failed to delete event');
  }
};


export default EventComponent;