import type { EventType } from '../types';
import { delay } from '../utils/delay';

/**
 * Fetch all events
 */
export const getEvents = async (): Promise<EventType[]> => {
  await delay(800);
  const eventsData = await import('../data/events.json');
  return eventsData.default as EventType[];
};

/**
 * Fetch a single event by ID
 */
export const getEventById = async (id: string): Promise<EventType | null> => {
  await delay(600);
  const eventsData = await import('../data/events.json');
  const events = eventsData.default as EventType[];
  return events.find(event => event.id === id) || null;
};

/**
 * Fetch events by company ID
 */
export const getEventsByCompanyId = async (companyId: string): Promise<EventType[]> => {
  await delay(700);
  const eventsData = await import('../data/events.json');
  const events = eventsData.default as EventType[];
  return events.filter(event => event.companyId === companyId);
};

/**
 * Fetch events by student ID (events the student is attending)
 */
export const getEventsByStudentId = async (studentId: string): Promise<EventType[]> => {
  await delay(700);
  const eventsData = await import('../data/events.json');
  const events = eventsData.default as EventType[];
  return events.filter(event => event.attendees.includes(studentId));
};
