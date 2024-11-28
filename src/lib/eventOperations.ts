import { eventQueries, type Event } from './db/events';

class EventOperations {
  create(event: Event): number {
    try {
      // 轉換為資料庫格式
      const dbEvent = {
        title: event.title,
        startDate: event.startDate,
        endDate: event.endDate,
        location: event.location,
        description: event.description,
        maxParticipants: event.maxParticipants,
        participants: event.participants,
        registrationDeadline: event.registrationDeadline,
        image: event.image,
        projectManagerName: event.projectManager?.name,
        projectManagerEmail: event.projectManager?.email,
        projectManagerPhone: event.projectManager?.phone,
        requirements: event.details?.requirements ? JSON.stringify(event.details.requirements) : undefined,
        notes: event.details?.notes ? JSON.stringify(event.details.notes) : undefined,
        createdBy: event.createdBy
      };

      const id = eventQueries.create(dbEvent);
      return Number(id);
    } catch (error) {
      console.error('Error creating event:', error);
      throw new Error('Failed to create event');
    }
  }

  update(id: number, updatedEvent: Partial<Event>): boolean {
    try {
      // 轉換為資料庫格式
      const dbEvent: any = {
        ...updatedEvent,
        projectManagerName: updatedEvent.projectManager?.name,
        projectManagerEmail: updatedEvent.projectManager?.email,
        projectManagerPhone: updatedEvent.projectManager?.phone,
        requirements: updatedEvent.details?.requirements ? JSON.stringify(updatedEvent.details.requirements) : undefined,
        notes: updatedEvent.details?.notes ? JSON.stringify(updatedEvent.details.notes) : undefined
      };

      // 移除不需要的欄位
      delete dbEvent.projectManager;
      delete dbEvent.details;

      return eventQueries.update(id, dbEvent);
    } catch (error) {
      console.error('Error updating event:', error);
      throw new Error('Failed to update event');
    }
  }

  delete(id: number): boolean {
    try {
      return eventQueries.delete(id);
    } catch (error) {
      console.error('Error deleting event:', error);
      throw new Error('Failed to delete event');
    }
  }

  getAll(): Event[] {
    try {
      return eventQueries.getAll();
    } catch (error) {
      console.error('Error getting events:', error);
      return [];
    }
  }

  getById(id: number): Event | null {
    try {
      const event = eventQueries.getById(id);
      if (!event) return null;
      
      return {
        id: event.id,
        title: event.title,
        startDate: event.startDate,
        endDate: event.endDate,
        location: event.location,
        description: event.description,
        maxParticipants: event.maxParticipants,
        participants: event.participants,
        registrationDeadline: event.registrationDeadline,
        image: event.image,
        projectManager: event.projectManagerName ? {
          name: event.projectManagerName,
          email: event.projectManagerEmail || '',
          phone: event.projectManagerPhone || ''
        } : undefined,
        details: {
          requirements: event.requirements ? JSON.parse(event.requirements) : [],
          notes: event.notes ? JSON.parse(event.notes) : []
        },
        createdBy: event.createdBy,
        creatorName: event.creatorName
      };
    } catch (error) {
      console.error('Error getting event:', error);
      return null;
    }
  }
}

export const eventOperations = new EventOperations();
