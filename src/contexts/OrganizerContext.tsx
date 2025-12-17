import { createContext, useContext, ReactNode } from 'react';
import type { Organizer } from '../types';

interface OrganizerContextType {
  organizer: Organizer;
}

const OrganizerContext = createContext<OrganizerContextType | undefined>(undefined);

// Demo organizer data
const demoOrganizer: Organizer = {
  id: 'org-1',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@weave.edu',
  company: 'Weave Career Services',
  avatar: 'https://i.pravatar.cc/150?img=47'
};

export const OrganizerProvider = ({ children }: { children: ReactNode }) => {
  return (
    <OrganizerContext.Provider value={{ organizer: demoOrganizer }}>
      {children}
    </OrganizerContext.Provider>
  );
};

export const useOrganizer = () => {
  const context = useContext(OrganizerContext);
  if (context === undefined) {
    throw new Error('useOrganizer must be used within an OrganizerProvider');
  }
  return context;
};
