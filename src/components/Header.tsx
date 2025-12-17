import { Link } from 'react-router-dom';
import { useOrganizer } from '../contexts/OrganizerContext';
import './Header.css';

const Header = () => {
  const { organizer } = useOrganizer();
  
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <span className="logo-icon">🎓</span>
          <span className="logo-text">Weave Organiser</span>
        </Link>
        <nav className="header-nav">
          <Link to="/">My Events</Link>
          <div className="organizer-info">
            {organizer.avatar && (
              <img src={organizer.avatar} alt={organizer.name} className="organizer-avatar" />
            )}
            <div className="organizer-details">
              <span className="organizer-name">{organizer.name}</span>
              <span className="organizer-company">{organizer.company}</span>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
