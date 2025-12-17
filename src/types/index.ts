export interface Organizer {
  id: string;
  name: string;
  email: string;
  company: string;
  avatar?: string;
}

export interface Attendee {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  major?: string;
  registeredAt?: string;
}

export interface EventType {
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  organizerId: string;
  companyId?: string;
  attendees: Attendee[];
  imageUrl?: string;
  capacity?: number;
  registrationDeadline?: string;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  industry: string;
  logo?: string;
  website?: string;
  eventIds: string[];
}

export interface Student {
  id: string;
  name: string;
  email: string;
  major: string;
  graduationYear: number;
  bio?: string;
  skills: string[];
  eventIds: string[]; // events attended
  avatar?: string;
}

