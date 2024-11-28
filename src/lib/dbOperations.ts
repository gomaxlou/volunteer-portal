import { getDb } from './db';
import { Event } from './types';

/**
 * 用戶資料結構
 */
export interface User {
    id?: number;
    name: string;
    email: string;
    phone?: string;
}

/**
 * 活動資料結構
 */
export type VolunteerEvent = Event;

class UserOperations {
    // 新增用戶
    create(user: User) {
        const db = getDb();
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
        const db = getDb();
        const users = db.prepare('SELECT * FROM users').all();
        db.close();
        return users;
    }

    // 根據 ID 取得用戶
    getById(id: number) {
        const db = getDb();
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
        db.close();
        return user;
    }

    // 更新用戶資料
    update(id: number, user: Partial<User>) {
        const db = getDb();
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
    create(event: VolunteerEvent) {
        const db = getDb();
        try {
            const stmt = db.prepare(`
                INSERT INTO events (
                    id, title, startDate, endDate, location, description,
                    image, participants, maxParticipants, registrationDeadline,
                    projectManager, details
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);
            const result = stmt.run(
                event.id,
                event.title,
                event.startDate,
                event.endDate,
                event.location,
                event.description,
                event.image,
                event.participants || 0,
                event.maxParticipants,
                event.registrationDeadline,
                JSON.stringify(event.projectManager),
                JSON.stringify(event.details)
            );
            return result.lastInsertRowid;
        } finally {
            db.close();
        }
    }

    // 取得所有活動
    getAll() {
        const db = getDb();
        try {
            const events = db.prepare('SELECT * FROM events').all();
            return events.map((event: any) => ({
                ...event,
                projectManager: JSON.parse(event.projectManager || '{}'),
                details: JSON.parse(event.details || '{}')
            }));
        } finally {
            db.close();
        }
    }

    // 根據 ID 取得活動
    getById(id: string) {
        const db = getDb();
        try {
            const event = db.prepare('SELECT * FROM events WHERE id = ?').get(id);
            return event ? {
                ...event,
                projectManager: JSON.parse(event.projectManager || '{}'),
                details: JSON.parse(event.details || '{}')
            } : null;
        } finally {
            db.close();
        }
    }

    // 更新活動參與人數
    updateParticipants(id: string, count: number) {
        const db = getDb();
        try {
            const stmt = db.prepare(`
                UPDATE events 
                SET participants = ?
                WHERE id = ?
            `);
            const result = stmt.run(count, id);
            return result.changes > 0;
        } finally {
            db.close();
        }
    }

    // 刪除活動
    delete(id: string): boolean {
        const db = getDb();
        try {
            const result = db.prepare('DELETE FROM events WHERE id = ?').run(id);
            return result.changes > 0;
        } catch (error) {
            console.error('Delete event error:', error);
            return false;
        } finally {
            db.close();
        }
    }
}

class UserEventOperations {
    // 報名活動
    register(userId: number, eventId: string) {
        const db = getDb();
        const stmt = db.prepare(`
            INSERT INTO user_events (user_id, event_id)
            VALUES (?, ?)
        `);
        try {
            const result = stmt.run(userId, eventId);
            if (result.changes > 0) {
                // 更新活動參與人數
                const event = eventOperations.getById(eventId);
                if (event) {
                    eventOperations.updateParticipants(eventId, (event.participants || 0) + 1);
                }
            }
            db.close();
            return result.changes > 0;
        } catch (error) {
            db.close();
            throw error;
        }
    }

    // 取得用戶參與的所有活動
    getUserEvents(userId: number) {
        const db = getDb();
        const events = db.prepare(`
            SELECT e.*, ue.status
            FROM events e
            JOIN user_events ue ON e.id = ue.event_id
            WHERE ue.user_id = ?
        `).all(userId);
        db.close();
        return events.map((event: VolunteerEvent) => ({
            ...event,
            projectManager: JSON.parse(event.projectManager || '{}'),
            details: JSON.parse(event.details || '{}')
        }));
    }

    // 取得活動的所有參與用戶
    getEventUsers(eventId: string) {
        const db = getDb();
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

export const userOperations = new UserOperations();
export const eventOperations = new EventOperations();
export const userEventOperations = new UserEventOperations();
