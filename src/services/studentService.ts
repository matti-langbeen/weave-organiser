import { Student } from '../types';
import { delay } from '../utils/delay';

/**
 * Fetch all students
 */
export const getStudents = async (): Promise<Student[]> => {
  await delay(800);
  const studentsData = await import('../data/students.json');
  return studentsData.default as Student[];
};

/**
 * Fetch a single student by ID
 */
export const getStudentById = async (id: string): Promise<Student | null> => {
  await delay(600);
  const studentsData = await import('../data/students.json');
  const students = studentsData.default as Student[];
  return students.find(student => student.id === id) || null;
};

/**
 * Fetch students attending a specific event
 */
export const getStudentsByEventId = async (eventId: string): Promise<Student[]> => {
  await delay(700);
  const studentsData = await import('../data/students.json');
  const students = studentsData.default as Student[];
  return students.filter(student => student.eventIds.includes(eventId));
};
