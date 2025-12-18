import { useEffect, useState, useMemo } from 'react';
import type { EventType } from '../types';
import './ConnectionTracker.css';

interface ConnectionTrackerProps {
  eventId: string;
  event: EventType;
}

export function ConnectionTracker({ eventId, event }: ConnectionTrackerProps) {
  // Generate a stable initial count based on eventId
  const getInitialCount = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = ((hash << 5) - hash) + id.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash % 100) + 50; // Between 50-150
  };

  const [connections, setConnections] = useState(getInitialCount(eventId));
  const [recentIncrease, setRecentIncrease] = useState(false);

  // Calculate check-in stats
  const stats = useMemo(() => {
    const total = event.attendees.length;
    const checkedIn = event.attendees.filter(a => a.checkedIn).length;
    const notCheckedIn = total - checkedIn;
    const percentage = total > 0 ? Math.round((checkedIn / total) * 100) : 0;
    const activeUsers = Math.floor(connections * 0.68);
    
    return {
      total,
      checkedIn,
      notCheckedIn,
      percentage,
      activeUsers,
      connections
    };
  }, [event.attendees, connections]);

  useEffect(() => {
    // Random increment interval between 3-8 seconds
    const getRandomInterval = () => Math.floor(Math.random() * 5000) + 3000;
    
    const scheduleNextIncrement = () => {
      const timeout = setTimeout(() => {
        // Randomly increase by 1-3 connections
        const increase = Math.floor(Math.random() * 3) + 1;
        setConnections(prev => prev + increase);
        
        // Show animation
        setRecentIncrease(true);
        setTimeout(() => setRecentIncrease(false), 1000);
        
        // Schedule next increment
        scheduleNextIncrement();
      }, getRandomInterval());
      
      return timeout;
    };
    
    const timeout = scheduleNextIncrement();
    
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="connection-tracker">
      <div className="connection-header">
        <h3 className="connection-title">Live Event Dashboard</h3>
        <span className="live-indicator">
          <span className="pulse-dot"></span>
          LIVE
        </span>
      </div>
      
      <div className="stats-grid">
        {/* Primary Metrics */}
        <div className="stat-card primary">
          <div className="stat-icon">🤝</div>
          <div className="stat-content">
            <div className={`stat-value ${recentIncrease ? 'pulse' : ''}`}>
              {stats.connections.toLocaleString()}
            </div>
            <div className="stat-label">Total Connections</div>
          </div>
        </div>

        <div className="stat-card primary">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">{stats.activeUsers.toLocaleString()}</div>
            <div className="stat-label">Active Users</div>
          </div>
        </div>

        {/* Check-in Metrics */}
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.checkedIn} / {stats.total}</div>
            <div className="stat-label">Checked In</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{stats.percentage}%</div>
            <div className="stat-label">Check-in Rate</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="dashboard-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${stats.percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default ConnectionTracker;
