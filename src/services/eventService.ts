import type { EventType } from '../types';
import { delay } from '../utils/delay';

// In-memory cache for demo purposes
let eventsCache: EventType[] | null = null;

/**
 * Fetch all events
 */
export const getEvents = async (): Promise<EventType[]> => {
  await delay(800);
  if (!eventsCache) {
    const eventsData = await import('../data/events.json');
    eventsCache = eventsData.default as EventType[];
  }
  return eventsCache;
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
