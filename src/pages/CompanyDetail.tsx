import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Company, Event } from '../types';
import { getCompanyById } from '../services/companyService';
import { getEventsByCompanyId } from '../services/eventService';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import EventCard from '../components/EventCard';
import './CompanyDetail.css';

const CompanyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const companyData = await getCompanyById(id);

        if (!companyData) {
          setError('Company not found');
          setLoading(false);
          return;
        }

        setCompany(companyData);

        // Fetch company events
        const eventsData = await getEventsByCompanyId(id);
        setEvents(eventsData);
      } catch (err) {
        setError('Failed to load company details');
        console.error('Error fetching company details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="page-container">
        <EmptyState message={error || 'Company not found'} />
      </div>
    );
  }

  return (
    <div className="page-container">
      <Link to="/" className="back-link">← Back to Events</Link>

      <div className="company-detail">
        <div className="company-detail-header">
          {company.logo && (
            <img src={company.logo} alt={company.name} className="company-detail-logo" />
          )}
          <div className="company-detail-info">
            <h1>{company.name}</h1>
            <p className="company-detail-industry">{company.industry}</p>
            {company.website && (
              <a 
                href={company.website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="company-website"
              >
                🌐 Visit Website
              </a>
            )}
          </div>
        </div>

        <div className="company-detail-section">
          <h2>About</h2>
          <p>{company.description}</p>
        </div>

        {events.length > 0 && (
          <div className="company-detail-section">
            <h2>Events ({events.length})</h2>
            <div className="company-events-grid">
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
        )}

        {events.length === 0 && (
          <div className="company-detail-section">
            <EmptyState 
              message="No events scheduled" 
              description="This company has no upcoming events at this time." 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDetail;
