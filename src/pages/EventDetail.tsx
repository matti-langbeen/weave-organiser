import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Event, Company, Student } from '../types';
import { getEventById } from '../services/eventService';
import { getCompanyById } from '../services/companyService';
import { getStudentsByEventId } from '../services/studentService';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import './EventDetail.css';

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [attendees, setAttendees] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const eventData = await getEventById(id);
        
        if (!eventData) {
          setError('Event not found');
          setLoading(false);
          return;
        }

        setEvent(eventData);

        // Fetch company and attendees in parallel
        const [companyData, attendeesData] = await Promise.all([
          getCompanyById(eventData.companyId),
          getStudentsByEventId(id)
        ]);

        setCompany(companyData);
        setAttendees(attendeesData);
      } catch (err) {
        setError('Failed to load event details');
        console.error('Error fetching event details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="page-container">
        <EmptyState message={error || 'Event not found'} />
      </div>
    );
  }

  return (
    <div className="page-container">
      <Link to="/" className="back-link">← Back to Events</Link>
      
      <div className="event-detail">
        {event.imageUrl && (
          <div className="event-detail-hero">
            <img src={event.imageUrl} alt={event.name} />
          </div>
        )}

        <div className="event-detail-content">
          <h1>{event.name}</h1>

          <div className="event-detail-meta">
            <div className="meta-item">
              <span className="icon">📅</span>
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="meta-item">
              <span className="icon">📍</span>
              <span>{event.location}</span>
            </div>
          </div>

          <div className="event-detail-section">
            <h2>About This Event</h2>
            <p>{event.description}</p>
          </div>

          {company && (
            <div className="event-detail-section">
              <h2>Hosted By</h2>
              <Link to={`/companies/${company.id}`} className="company-card">
                {company.logo && (
                  <img src={company.logo} alt={company.name} className="company-logo" />
                )}
                <div>
                  <h3>{company.name}</h3>
                  <p className="company-industry">{company.industry}</p>
                </div>
              </Link>
            </div>
          )}

          {attendees.length > 0 && (
            <div className="event-detail-section">
              <h2>Attendees ({attendees.length})</h2>
              <div className="attendees-grid">
                {attendees.map(student => (
                  <Link 
                    key={student.id} 
                    to={`/students/${student.id}`} 
                    className="attendee-card"
                  >
                    {student.avatar && (
                      <img src={student.avatar} alt={student.name} className="attendee-avatar" />
                    )}
                    <div className="attendee-info">
                      <h4>{student.name}</h4>
                      <p>{student.major}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
