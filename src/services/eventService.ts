import type { EventType } from '../types';
import { delay } from '../utils/delay';

// In-memory cache for demo purposes
let eventsCache: EventType[] | null = null;

/**
 * Initialize events cache and set live event date to current time
 */
const initializeEvents = async (): Promise<EventType[]> => {
  const eventsData = await import('../data/events.json');
  const events = eventsData.default as EventType[];
  
  // Find the live event (evt-2) and update its date to current time
  const liveEventIndex = events.findIndex(event => event.id === 'evt-2');
  if (liveEventIndex !== -1) {
    const now = new Date();
    const liveEvent = { ...events[liveEventIndex] };
    
    // Set the event date to today at 9:00 AM
    const eventDate = new Date(now);
    eventDate.setHours(9, 0, 0, 0);
    liveEvent.date = eventDate.toISOString();
    
    // Update registration deadline to yesterday
    const deadline = new Date(now);
    deadline.setDate(deadline.getDate() - 1);
    deadline.setHours(23, 59, 0, 0);
    liveEvent.registrationDeadline = deadline.toISOString();
    
    // Update check-in times for attendees to today
    liveEvent.attendees = liveEvent.attendees.map(attendee => {
      if (typeof attendee !== 'string' && attendee.checkedIn && attendee.checkInTime) {
        const checkInTime = new Date(now);
        checkInTime.setHours(8, 45, 0, 0);
        return {
          ...attendee,
          checkInTime: checkInTime.toISOString()
        };
      }
      return attendee;
    });
    
    events[liveEventIndex] = liveEvent;
  }
  
  return events;
};

/**
 * Check if an event is happening today (live)
 */
const isEventLiveToday = (eventDate: string): boolean => {
  const today = new Date();
  const event = new Date(eventDate);
  
  return (
    today.getFullYear() === event.getFullYear() &&
    today.getMonth() === event.getMonth() &&
    today.getDate() === event.getDate()
  );
};

/**
 * Fetch all events (sorted with live events on top)
 */
export const getEvents = async (): Promise<EventType[]> => {
  await delay(800);
  if (!eventsCache) {
    eventsCache = await initializeEvents();
  }
  
  // Sort events: live events (today) first, then by date
  const sortedEvents = [...eventsCache].sort((a, b) => {
    const aIsLive = isEventLiveToday(a.date);
    const bIsLive = isEventLiveToday(b.date);
    
    // If one is live and the other isn't, live comes first
    if (aIsLive && !bIsLive) return -1;
    if (!aIsLive && bIsLive) return 1;
    
    // Otherwise, sort by date (most recent first)
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  return sortedEvents;
};

/**
 * Fetch a single event by ID
 */
export const getEventById = async (id: string): Promise<EventType | null> => {
  await delay(600);
  const events = await getEvents();
  return events.find(event => event.id === id) || null;
};

/**
 * Update an event
 */
export const updateEvent = async (id: string, updatedEvent: EventType): Promise<EventType> => {
  await delay(500);
  const events = await getEvents();
  const index = events.findIndex(event => event.id === id);
  
  if (index === -1) {
    throw new Error('Event not found');
  }
  
  events[index] = updatedEvent;
  eventsCache = [...events]; // Update cache
  
  return updatedEvent;
};

/**
 * Fetch events by company ID
 */
export const getEventsByCompanyId = async (companyId: string): Promise<EventType[]> => {
  await delay(700);
  const events = await getEvents();
  return events.filter(event => event.companyId === companyId);
};

/**
 * Fetch events by student ID (events the student is attending)
 */
export const getEventsByStudentId = async (studentId: string): Promise<EventType[]> => {
  await delay(700);
  const events = await getEvents();
  const studentEvents: EventType[] = [];
  
  for (const event of events) {
    // Check if student is in attendees array
    const hasStudent = event.attendees.some(attendee => 
      typeof attendee === 'string' ? attendee === studentId : attendee.id === studentId
    );
    if (hasStudent) {
      studentEvents.push(event);
    }
  }
  
  return studentEvents;
};
