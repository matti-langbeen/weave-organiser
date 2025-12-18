import { useMemo } from 'react';
import type { EventType } from '../types';
import './EventStats.css';

interface EventStatsProps {
  event: EventType;
}

export function EventStats({ event }: EventStatsProps) {
  const stats = useMemo(() => {
    const total = event.attendees.length;
    const checkedIn = event.attendees.filter(a => a.checkedIn).length;
    const notCheckedIn = total - checkedIn;
    const percentage = total > 0 ? Math.round((checkedIn / total) * 100) : 0;
    
    return {
      total,
      checkedIn,
      notCheckedIn,
      percentage
    };
  }, [event.attendees]);

  return (
    <div className="event-stats">
      <h3 className="stats-title">
        Check-in Statistics
      </h3>
      
      <div className="stats-grid">
        <div className="stat-card stat-total">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Registered</div>
        </div>

        <div className="stat-card stat-checked-in">
          <div className="stat-value">{stats.checkedIn}</div>
          <div className="stat-label">Checked In</div>
        </div>

        <div className="stat-card stat-not-checked-in">
          <div className="stat-value">{stats.notCheckedIn}</div>
          <div className="stat-label">Not Checked In</div>
        </div>

        <div className="stat-card stat-percentage">
          <div className="stat-value">{stats.percentage}%</div>
          <div className="stat-label">Check-in Rate</div>
        </div>
      </div>

      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${stats.percentage}%` }}
        >
        </div>
      </div>
    </div>
  );
}
