import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import type { EventType } from '../types';
import { getEventById, updateEvent } from '../services/eventService';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import EventQRCode from '../components/EventQRCode';
import { EventStats } from '../components/EventStats';
import ConnectionTracker from '../components/ConnectionTracker';
import './EventDetail.css';

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editMode = searchParams.get('edit') === 'true';
  
  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Edit form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
    capacity: 0,
    registrationDeadline: '',
    imageUrl: ''
  });

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
        
        // Initialize form data
        setFormData({
          name: eventData.name,
          description: eventData.description,
          date: eventData.date.substring(0, 16), // Format for datetime-local input
          location: eventData.location,
          capacity: eventData.capacity || 0,
          registrationDeadline: eventData.registrationDeadline?.substring(0, 16) || '',
          imageUrl: eventData.imageUrl || ''
        });
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

  const isPastEvent = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!id || !event) return;

    try {
      setSaving(true);
      const updatedEvent = {
        ...event,
        name: formData.name,
        description: formData.description,
        date: new Date(formData.date).toISOString(),
        location: formData.location,
        capacity: formData.capacity,
        registrationDeadline: formData.registrationDeadline ? new Date(formData.registrationDeadline).toISOString() : undefined,
        imageUrl: formData.imageUrl
      };
      
      await updateEvent(id, updatedEvent);
      setEvent(updatedEvent);
      navigate(`/events/${id}`);
    } catch (err) {
      console.error('Error saving event:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
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

  const isUpcoming = !isPastEvent(event.date);

  return (
    <div className="page-container">
      <Link to="/" className="back-link">← Back to Events</Link>
      
      <div className="event-detail">
        {editMode ? (
          // Edit Mode
          <div className="event-edit-form">
            <div className="form-header">
              <h1>Edit Event</h1>
              <div className="form-actions">
                <button 
                  className="btn btn-secondary" 
                  onClick={() => navigate(`/events/${id}`)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="name">Event Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Event Date & Time *</label>
                <input
                  type="datetime-local"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="registrationDeadline">Registration Deadline</label>
                <input
                  type="datetime-local"
                  id="registrationDeadline"
                  name="registrationDeadline"
                  value={formData.registrationDeadline}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="capacity">Capacity</label>
                <input
                  type="number"
                  id="capacity"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="imageUrl">Image URL</label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
              {formData.imageUrl && (
                <div className="image-preview">
                  <img src={formData.imageUrl} alt="Preview" />
                </div>
              )}
            </div>
          </div>
        ) : (
          // View Mode
          <>
            {event.imageUrl && (
              <div className="event-detail-hero">
                <img src={event.imageUrl} alt={event.name} />
                {event.live && <div className="event-status-badge live">🔴 LIVE</div>}
                {!event.live && !isUpcoming && <div className="event-status-badge">Past Event</div>}
              </div>
            )}

            <div className="event-detail-content">
              <div className="event-header">
                <h1>{event.name}</h1>
                <div className="event-actions">
                  {isUpcoming && (
                    <>
                      <Link to={`/events/${id}/booth-map`} className="btn btn-secondary">
                        🗺️ Booth Map
                      </Link>
                      <Link to={`/events/${id}?edit=true`} className="btn btn-primary">
                        Edit Event
                      </Link>
                    </>
                  )}
                </div>
              </div>

              <div className="event-detail-meta">
                <div className="meta-item">
                  <span className="icon">📅</span>
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="meta-item">
                  <span className="icon">📍</span>
                  <span>{event.location}</span>
                </div>
                {event.capacity && (
                  <div className="meta-item">
                    <span className="icon">👥</span>
                    <span>Capacity: {event.attendees.length} / {event.capacity}</span>
                  </div>
                )}
              </div>

              <div className="event-detail-section">
                <h2>About This Event</h2>
                <p>{event.description}</p>
              </div>

              {/* Show dashboard only for live events */}
              {event.live && <ConnectionTracker eventId={event.id} event={event} />}

              {/* Show summary stats for past events only */}
              {!event.live && !isUpcoming && <EventStats event={event} />}

              {isUpcoming && (
                <div className="event-detail-section">
                  <h2>Event Check-in</h2>
                  <EventQRCode 
                    eventId={event.id}
                    eventName={event.name}
                    eventDate={event.date}
                  />
                </div>
              )}

              {event.attendees.length > 0 && (
                <div className="event-detail-section">
                  <h2>Attendees ({event.attendees.length})</h2>
                  <div className="attendees-grid">
                    {[...event.attendees]
                      .sort((a, b) => {
                        // Sort: checked in first, then not checked in
                        if (a.checkedIn && !b.checkedIn) return -1;
                        if (!a.checkedIn && b.checkedIn) return 1;
                        return 0;
                      })
                      .map(attendee => (
                      <div key={attendee.id} className={`attendee-card ${attendee.checkedIn ? 'checked-in' : 'not-checked-in'}`}>
                        {attendee.avatar && (
                          <img src={attendee.avatar} alt={attendee.name} className="attendee-avatar" />
                        )}
                        <div className="attendee-info">
                          <h4>{attendee.name}</h4>
                          <p className="attendee-email">{attendee.email}</p>
                          {attendee.major && <p className="attendee-major">{attendee.major}</p>}
                          {!isUpcoming && (
                            <div className="attendee-checkin-status">
                              {attendee.checkedIn ? (
                                <>
                                  <span className="status-badge checked-in">✓ Checked In</span>
                                  {attendee.checkInTime && (
                                    <span className="checkin-time">
                                      {new Date(attendee.checkInTime).toLocaleTimeString('en-US', { 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                      })}
                                    </span>
                                  )}
                                </>
                              ) : (
                                !event.live && <span className="status-badge not-checked-in">✗ No Show</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isUpcoming && event.attendees.length === 0 && (
                <div className="event-detail-section">
                  <EmptyState 
                    message="No registrations yet" 
                    description="Attendees will appear here once they register for your event." 
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EventDetail;
