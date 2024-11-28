"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventOperations = void 0;
const events_1 = require("./db/events");
class EventOperations {
    async create(event) {
        try {
            await events_1.eventQueries.create(event);
            return event.id;
        }
        catch (error) {
            console.error('Error creating event:', error);
            throw new Error('Failed to create event');
        }
    }
    async update(id, updatedEvent) {
        try {
            return await events_1.eventQueries.update(id, updatedEvent);
        }
        catch (error) {
            console.error('Error updating event:', error);
            throw new Error('Failed to update event');
        }
    }
    async delete(id) {
        try {
            return await events_1.eventQueries.delete(id);
        }
        catch (error) {
            console.error('Error deleting event:', error);
            throw new Error('Failed to delete event');
        }
    }
    async getAll() {
        try {
            return await events_1.eventQueries.getAll();
        }
        catch (error) {
            console.error('Error getting events:', error);
            return [];
        }
    }
    async getById(id) {
        try {
            return await events_1.eventQueries.getById(id);
        }
        catch (error) {
            console.error('Error getting event:', error);
            return null;
        }
    }
}
exports.eventOperations = new EventOperations();
