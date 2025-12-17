export interface EventType {
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  companyId: string;
  attendees: string[]; // student IDs
  imageUrl?: string;
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

