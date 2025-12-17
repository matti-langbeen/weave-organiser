import { useEffect, useState } from 'react';
import type { EventType } from '../types';
import { getEvents } from '../services/eventService';
import { useOrganizer } from '../contexts/OrganizerContext';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import './EventList.css';

const EventList = () => {
  const { organizer } = useOrganizer();
  const [upcomingEvents, setUpcomingEvents] = useState<EventType[]>([]);
  const [pastEvents, setPastEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getEvents();
        
        // Filter events for this organizer only
        const organizerEvents = data.filter(event => event.organizerId === organizer.id);
        
        // Split into past and upcoming
        const now = new Date();
        const past = organizerEvents.filter(event => new Date(event.date) < now);
        const upcoming = organizerEvents.filter(event => new Date(event.date) >= now);
        
        // Sort: upcoming ascending, past descending
        setPastEvents(past.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        setUpcomingEvents(upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      } catch (err) {
        setError('Failed to load events');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [organizer.id]);

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

  if (upcomingEvents.length === 0 && pastEvents.length === 0) {
    return (
      <div className="page-container">
        <EmptyState 
          message="No events found" 
          description="You haven't created any events yet." 
        />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Events</h1>
        <p>Manage your organized events - {organizer.name}</p>
      </div>

      {upcomingEvents.length > 0 && (
        <section className="event-section">
          <h2 className="section-title">Upcoming Events</h2>
          <div className="event-list-grid">
            {upcomingEvents.map(event => (
              <EventCard
                key={event.id}
                id={event.id}
                name={event.name}
                date={event.date}
                location={event.location}
                imageUrl={event.imageUrl}
                description={event.description}
                isUpcoming={true}
              />
            ))}
          </div>
        </section>
      )}

      {pastEvents.length > 0 && (
        <section className="event-section">
          <h2 className="section-title">Past Events</h2>
          <div className="event-list-grid">
            {pastEvents.map(event => (
              <EventCard
                key={event.id}
                id={event.id}
                name={event.name}
                date={event.date}
                location={event.location}
                imageUrl={event.imageUrl}
                description={event.description}
                isUpcoming={false}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default EventList;
