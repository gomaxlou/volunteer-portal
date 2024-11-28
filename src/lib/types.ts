export interface Event {
  id: string;
  title: string;
  startDate: string;
  endDate?: string;
  location: string;
  description: string;
  maxParticipants: number;
  participants: number;
  registrationDeadline: string;
  image?: string;
  projectManager?: {
    name: string;
    email: string;
    phone: string;
  };
  details?: {
    requirements: string[];
    notes: string[];
    category?: string;
    difficulty?: string;
    duration?: string;
  };
  createdBy?: string;
  creatorName?: string;
}

export type EventFormData = Omit<Event, 'id' | 'participants'>;
