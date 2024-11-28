"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventQueries = void 0;
const db_1 = require("./db");
// 創建事件表
db_1.db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    startDate TEXT NOT NULL,
    endDate TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    maxParticipants INTEGER NOT NULL,
    participants INTEGER DEFAULT 0,
    registrationDeadline TEXT NOT NULL,
    image TEXT,
    projectManagerName TEXT,
    projectManagerEmail TEXT,
    projectManagerPhone TEXT,
    requirements TEXT,
    notes TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);
exports.eventQueries = {
    create: (event) => {
        var _a, _b, _c, _d, _e;
        const stmt = db_1.db.prepare(`
      INSERT INTO events (
        id, title, startDate, endDate, location, description,
        maxParticipants, participants, registrationDeadline, image,
        projectManagerName, projectManagerEmail, projectManagerPhone,
        requirements, notes
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `);
        return stmt.run(event.id, event.title, event.startDate, event.endDate, event.location, event.description, event.maxParticipants, event.participants || 0, event.registrationDeadline, event.image, ((_a = event.projectManager) === null || _a === void 0 ? void 0 : _a.name) || null, ((_b = event.projectManager) === null || _b === void 0 ? void 0 : _b.email) || null, ((_c = event.projectManager) === null || _c === void 0 ? void 0 : _c.phone) || null, JSON.stringify(((_d = event.details) === null || _d === void 0 ? void 0 : _d.requirements) || []), JSON.stringify(((_e = event.details) === null || _e === void 0 ? void 0 : _e.notes) || []));
    },
    getAll: () => {
        const stmt = db_1.db.prepare(`
      SELECT * FROM events
      ORDER BY startDate DESC
    `);
        const events = stmt.all();
        return events.map(event => ({
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
                email: event.projectManagerEmail,
                phone: event.projectManagerPhone
            } : undefined,
            details: {
                requirements: JSON.parse(event.requirements || '[]'),
                notes: JSON.parse(event.notes || '[]')
            }
        }));
    },
    getById: (id) => {
        const stmt = db_1.db.prepare('SELECT * FROM events WHERE id = ?');
        const event = stmt.get(id);
        if (!event)
            return null;
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
                email: event.projectManagerEmail,
                phone: event.projectManagerPhone
            } : undefined,
            details: {
                requirements: JSON.parse(event.requirements || '[]'),
                notes: JSON.parse(event.notes || '[]')
            }
        };
    },
    update: (id, event) => {
        var _a, _b, _c, _d, _e;
        const currentEvent = exports.eventQueries.getById(id);
        if (!currentEvent)
            return false;
        const updatedEvent = { ...currentEvent, ...event };
        const stmt = db_1.db.prepare(`
      UPDATE events SET
        title = ?,
        startDate = ?,
        endDate = ?,
        location = ?,
        description = ?,
        maxParticipants = ?,
        participants = ?,
        registrationDeadline = ?,
        image = ?,
        projectManagerName = ?,
        projectManagerEmail = ?,
        projectManagerPhone = ?,
        requirements = ?,
        notes = ?
      WHERE id = ?
    `);
        const result = stmt.run(updatedEvent.title, updatedEvent.startDate, updatedEvent.endDate, updatedEvent.location, updatedEvent.description, updatedEvent.maxParticipants, updatedEvent.participants, updatedEvent.registrationDeadline, updatedEvent.image, ((_a = updatedEvent.projectManager) === null || _a === void 0 ? void 0 : _a.name) || null, ((_b = updatedEvent.projectManager) === null || _b === void 0 ? void 0 : _b.email) || null, ((_c = updatedEvent.projectManager) === null || _c === void 0 ? void 0 : _c.phone) || null, JSON.stringify(((_d = updatedEvent.details) === null || _d === void 0 ? void 0 : _d.requirements) || []), JSON.stringify(((_e = updatedEvent.details) === null || _e === void 0 ? void 0 : _e.notes) || []), id);
        return result.changes > 0;
    },
    delete: (id) => {
        const stmt = db_1.db.prepare('DELETE FROM events WHERE id = ?');
        const result = stmt.run(id);
        return result.changes > 0;
    }
};
