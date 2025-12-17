import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Student, EventType } from '../types';
import { getStudentById } from '../services/studentService';
import { getEventsByStudentId } from '../services/eventService';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import EventCard from '../components/EventCard';
import './StudentProfile.css';

const StudentProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const studentData = await getStudentById(id);

        if (!studentData) {
          setError('Student not found');
          setLoading(false);
          return;
        }

        setStudent(studentData);

        // Fetch student's events
        const eventsData = await getEventsByStudentId(id);
        setEvents(eventsData);
      } catch (err) {
        setError('Failed to load student profile');
        console.error('Error fetching student profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="page-container">
        <EmptyState message={error || 'Student not found'} />
      </div>
    );
  }

  return (
    <div className="page-container">
      <Link to="/" className="back-link">← Back to Events</Link>

      <div className="student-profile">
        <div className="student-profile-header">
          {student.avatar && (
            <img src={student.avatar} alt={student.name} className="student-avatar-large" />
          )}
          <div className="student-profile-info">
            <h1>{student.name}</h1>
            <p className="student-major">{student.major}</p>
            <p className="student-graduation">Class of {student.graduationYear}</p>
            <a href={`mailto:${student.email}`} className="student-email">
              ✉️ {student.email}
            </a>
          </div>
        </div>

        {student.bio && (
          <div className="student-profile-section">
            <h2>About</h2>
            <p>{student.bio}</p>
          </div>
        )}

        {student.skills.length > 0 && (
          <div className="student-profile-section">
            <h2>Skills</h2>
            <div className="skills-list">
              {student.skills.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {events.length > 0 && (
          <div className="student-profile-section">
            <h2>Events Attending ({events.length})</h2>
            <div className="student-events-grid">
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
          <div className="student-profile-section">
            <EmptyState 
              message="No events registered" 
              description="This student hasn't registered for any events yet." 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;
