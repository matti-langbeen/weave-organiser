import { Link } from 'react-router-dom';
import './EventCard.css';

interface EventCardProps {
  id: string;
  name: string;
  date: string;
  location: string;
  imageUrl?: string;
  description?: string;
}

const EventCard = ({ id, name, date, location, imageUrl, description }: EventCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Link to={`/events/${id}`} className="event-card">
      {imageUrl && (
        <div className="event-card-image">
          <img src={imageUrl} alt={name} />
        </div>
      )}
      <div className="event-card-content">
        <h3>{name}</h3>
        {description && <p className="event-card-description">{description}</p>}
        <div className="event-card-meta">
          <div className="event-card-meta-item">
            <span className="icon">📅</span>
            <span>{formatDate(date)}</span>
          </div>
          <div className="event-card-meta-item">
            <span className="icon">📍</span>
            <span>{location}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
