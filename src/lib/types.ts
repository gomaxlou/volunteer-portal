export interface Event {
  id: string;
  title: string;
  startDate: string;
  endDate?: string;
  location: string;
  description: string;
  image?: string;
  participants: number;
  maxParticipants: number;
  registrationDeadline: string;
  projectManager: {
    name: string;
    title?: string;
    phone: string;
    email?: string;
    line?: string;
  };
  details?: {
    difficulty?: '簡單' | '中等' | '困難';
    duration?: string;
    category?: string;
    meetingPoint?: string;
    schedule?: string[];
    items?: string[];
    notes?: string[];
    transportation?: string[];
    weather?: string[];
    targetAudience?: string[];
    requirements?: string[];
    benefits?: string[];
    contact?: {
      name: string;
      phone: string;
      email?: string;
    };
  };
}

export type EventFormData = Omit<Event, 'id' | 'participants'>;
