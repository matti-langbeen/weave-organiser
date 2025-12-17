import { useEffect, useState } from 'react';
import type { EventType } from '../types';
import { getEvents } from '../services/eventService';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import './EventList.css';

const EventList = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        setError('Failed to load events');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <EmptyState message="Error" description={error} />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="page-container">
        <EmptyState 
          message="No events found" 
          description="There are no upcoming events at this time." 
        />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Upcoming Events</h1>
        <p>Browse and register for campus events and career fairs</p>
      </div>
      <div className="event-list-grid">
        {events.map(event => (
          <EventCard
            key={event.id}
            id={event.id}
            name={event.name}
            date={event.date}
            location={event.location}
            imageUrl={event.imageUrl}
            description={event.description}
          />
        ))}
      </div>
    </div>
  );
};

export default EventList;
