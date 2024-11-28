"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userEventOperations = exports.eventOperations = exports.userOperations = void 0;
const db_1 = require("./db");
class UserOperations {
    // 新增用戶
    create(user) {
        const db = (0, db_1.getDb)();
        const stmt = db.prepare(`
            INSERT INTO users (name, email, phone)
            VALUES (?, ?, ?)
        `);
        const result = stmt.run(user.name, user.email, user.phone);
        db.close();
        return result.lastInsertRowid;
    }
    // 取得所有用戶
    getAll() {
        const db = (0, db_1.getDb)();
        const users = db.prepare('SELECT * FROM users').all();
        db.close();
        return users;
    }
    // 根據 ID 取得用戶
    getById(id) {
        const db = (0, db_1.getDb)();
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
        db.close();
        return user;
    }
    // 更新用戶資料
    update(id, user) {
        const db = (0, db_1.getDb)();
        const { name, email, phone } = user;
        const stmt = db.prepare(`
            UPDATE users 
            SET name = COALESCE(?, name),
                email = COALESCE(?, email),
                phone = COALESCE(?, phone)
            WHERE id = ?
        `);
        const result = stmt.run(name, email, phone, id);
        db.close();
        return result.changes > 0;
    }
}
class EventOperations {
    // 新增活動
    create(event) {
        const db = (0, db_1.getDb)();
        try {
            const stmt = db.prepare(`
                INSERT INTO events (
                    id, title, startDate, endDate, location, description,
                    image, participants, maxParticipants, registrationDeadline,
                    projectManager, details
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);
            const result = stmt.run(event.id, event.title, event.startDate, event.endDate, event.location, event.description, event.image, event.participants || 0, event.maxParticipants, event.registrationDeadline, JSON.stringify(event.projectManager), JSON.stringify(event.details));
            return result.lastInsertRowid;
        }
        finally {
            db.close();
        }
    }
    // 取得所有活動
    getAll() {
        const db = (0, db_1.getDb)();
        try {
            const events = db.prepare('SELECT * FROM events').all();
            return events.map((event) => ({
                ...event,
                projectManager: JSON.parse(event.projectManager || '{}'),
                details: JSON.parse(event.details || '{}')
            }));
        }
        finally {
            db.close();
        }
    }
    // 根據 ID 取得活動
    getById(id) {
        const db = (0, db_1.getDb)();
        try {
            const event = db.prepare('SELECT * FROM events WHERE id = ?').get(id);
            return event ? {
                ...event,
                projectManager: JSON.parse(event.projectManager || '{}'),
                details: JSON.parse(event.details || '{}')
            } : null;
        }
        finally {
            db.close();
        }
    }
    // 更新活動參與人數
    updateParticipants(id, count) {
        const db = (0, db_1.getDb)();
        try {
            const stmt = db.prepare(`
                UPDATE events 
                SET participants = ?
                WHERE id = ?
            `);
            const result = stmt.run(count, id);
            return result.changes > 0;
        }
        finally {
            db.close();
        }
    }
    // 刪除活動
    delete(id) {
        const db = (0, db_1.getDb)();
        try {
            const result = db.prepare('DELETE FROM events WHERE id = ?').run(id);
            return result.changes > 0;
        }
        catch (error) {
            console.error('Delete event error:', error);
            return false;
        }
        finally {
            db.close();
        }
    }
}
class UserEventOperations {
    // 報名活動
    register(userId, eventId) {
        const db = (0, db_1.getDb)();
        const stmt = db.prepare(`
            INSERT INTO user_events (user_id, event_id)
            VALUES (?, ?)
        `);
        try {
            const result = stmt.run(userId, eventId);
            if (result.changes > 0) {
                // 更新活動參與人數
                const event = exports.eventOperations.getById(eventId);
                if (event) {
                    exports.eventOperations.updateParticipants(eventId, (event.participants || 0) + 1);
                }
            }
            db.close();
            return result.changes > 0;
        }
        catch (error) {
            db.close();
            throw error;
        }
    }
    // 取得用戶參與的所有活動
    getUserEvents(userId) {
        const db = (0, db_1.getDb)();
        const events = db.prepare(`
            SELECT e.*, ue.status
            FROM events e
            JOIN user_events ue ON e.id = ue.event_id
            WHERE ue.user_id = ?
        `).all(userId);
        db.close();
        return events.map((event) => ({
            ...event,
            projectManager: JSON.parse(event.projectManager || '{}'),
            details: JSON.parse(event.details || '{}')
        }));
    }
    // 取得活動的所有參與用戶
    getEventUsers(eventId) {
        const db = (0, db_1.getDb)();
        const users = db.prepare(`
            SELECT u.*, ue.status
            FROM users u
            JOIN user_events ue ON u.id = ue.user_id
            WHERE ue.event_id = ?
        `).all(eventId);
        db.close();
        return users;
    }
}
exports.userOperations = new UserOperations();
exports.eventOperations = new EventOperations();
exports.userEventOperations = new UserEventOperations();
