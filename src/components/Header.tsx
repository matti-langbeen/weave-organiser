import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <span className="logo-icon">🎓</span>
          <span className="logo-text">Weave Organiser</span>
        </Link>
        <nav className="header-nav">
          <Link to="/">Events</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
