import { getDb } from './db';
import { Event } from './types';
import * as crypto from 'crypto';

/**
 * 用戶資料結構
 */
export interface User {
    id?: number;
    chinese_name: string;
    email: string;
    phone?: string;
}

/**
 * 活動資料結構
 */
export interface VolunteerEvent {
    id?: number;
    title: string;
    startDate: string;
    endDate: string;
    location: string;
    description?: string;
    image?: string;
    participants?: number;
    maxParticipants: number;
    registrationDeadline: string;
    projectManagerName: string;
    projectManagerTitle?: string;
    projectManagerEmail: string;
    projectManagerPhone: string;
    projectManagerLine?: string;
    category?: string;
    difficulty?: string;
    requirements?: string[];  
    benefits?: string[];     
    items?: string[];       
    notes?: string[];       
    transportation?: string;
    meetingPoint?: string;
    schedule?: string;
    status?: string;
    created_at?: string;
    updated_at?: string;
    createdBy?: number;
}

class UserOperations {
    // 新增用戶
    create(user: User) {
        const db = getDb();
        const stmt = db.prepare(`
            INSERT INTO users (chinese_name, email, phone)
            VALUES (?, ?, ?)
        `);
        const result = stmt.run(user.chinese_name, user.email, user.phone);
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
        const { chinese_name, email, phone } = user;
        const stmt = db.prepare(`
            UPDATE users 
            SET chinese_name = COALESCE(?, chinese_name),
                email = COALESCE(?, email),
                phone = COALESCE(?, phone)
            WHERE id = ?
        `);
        const result = stmt.run(chinese_name, email, phone, id);
        db.close();
        return result.changes > 0;
    }
}

class EventOperations {
    // 將字串陣列轉換為 JSON 字串
    private stringArrayToJson(arr: string[] | undefined | null): string | null {
        if (!arr) return null;
        try {
            return JSON.stringify(arr);
        } catch {
            return null;
        }
    }

    // 將字串轉換為字串陣列
    private jsonToStringArray(str: string | null): string[] | null {
        if (!str) return null;
        try {
            // 如果字串以 [ 開頭，嘗試解析為 JSON
            if (str.startsWith('[')) {
                return JSON.parse(str);
            }
            // 否則，將其視為單個字串項目
            return [str];
        } catch {
            // 如果解析失敗，返回原始字串作為單個項目
            return [str];
        }
    }

    // 新增活動
    create(event: VolunteerEvent) {
        const db = getDb();
        try {
            // 先檢查必填欄位
            const requiredFields = [
                'title',
                'startDate',
                'endDate',
                'location',
                'maxParticipants',
                'registrationDeadline',
                'projectManagerName',
                'projectManagerEmail',
                'projectManagerPhone'
            ];

            const missingFields = requiredFields.filter(field => {
                const value = event[field as keyof VolunteerEvent];
                const isEmpty = value === undefined || value === null || value === '' || value === ' ';
                if (isEmpty) {
                    console.log(`Missing required field ${field}:`, value);
                }
                return isEmpty;
            });

            if (missingFields.length > 0) {
                throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
            }

            // 清理和驗證 projectManagerName
            if (typeof event.projectManagerName !== 'string' || event.projectManagerName.trim() === '') {
                throw new Error('projectManagerName must be a non-empty string');
            }
            event.projectManagerName = event.projectManagerName.trim();

            const stmt = db.prepare(`
                INSERT INTO events (
                    title, startDate, endDate, location, description,
                    image, participants, maxParticipants, registrationDeadline,
                    projectManagerName, projectManagerTitle, projectManagerEmail,
                    projectManagerPhone, projectManagerLine, category, difficulty,
                    requirements, benefits, items, notes, transportation,
                    meetingPoint, schedule, status, createdBy
                )
                VALUES (
                    @title, @startDate, @endDate, @location, @description,
                    @image, @participants, @maxParticipants, @registrationDeadline,
                    @projectManagerName, @projectManagerTitle, @projectManagerEmail,
                    @projectManagerPhone, @projectManagerLine, @category, @difficulty,
                    @requirements, @benefits, @items, @notes, @transportation,
                    @meetingPoint, @schedule, @status, @createdBy
                )
            `);

            // 準備要插入的數據
            const insertData = {
                title: event.title.trim(),
                startDate: event.startDate,
                endDate: event.endDate,
                location: event.location.trim(),
                description: (event.description || '').trim(),
                image: event.image || '/images/default-event.jpg',
                participants: event.participants || 0,
                maxParticipants: event.maxParticipants,
                registrationDeadline: event.registrationDeadline,
                projectManagerName: event.projectManagerName,
                projectManagerTitle: event.projectManagerTitle?.trim() || null,
                projectManagerEmail: event.projectManagerEmail.trim(),
                projectManagerPhone: event.projectManagerPhone.trim(),
                projectManagerLine: event.projectManagerLine?.trim() || null,
                category: event.category?.trim() || null,
                difficulty: event.difficulty?.trim() || null,
                requirements: this.stringArrayToJson(event.requirements),
                benefits: this.stringArrayToJson(event.benefits),
                items: this.stringArrayToJson(event.items),
                notes: this.stringArrayToJson(event.notes),
                transportation: event.transportation?.trim() || null,
                meetingPoint: event.meetingPoint?.trim() || null,
                schedule: event.schedule?.trim() || null,
                status: event.status || 'draft',
                createdBy: event.createdBy || null
            };

            // 輸出詳細的插入數據日誌
            console.log('=== Event Creation Data ===');
            console.log('Required Fields:');
            requiredFields.forEach(field => {
                console.log(`${field}: "${insertData[field as keyof typeof insertData]}"`);
            });
            console.log('\nOptional Fields:');
            Object.entries(insertData)
                .filter(([key]) => !requiredFields.includes(key))
                .forEach(([key, value]) => {
                    console.log(`${key}: "${value}"`);
                });
            console.log('========================');

            try {
                const result = stmt.run(insertData);
                console.log('Event created successfully:', { changes: result.changes, lastInsertRowid: result.lastInsertRowid });
                return result.lastInsertRowid;
            } catch (sqlError) {
                console.error('SQL Error:', sqlError);
                console.error('SQL Parameters:', Object.entries(insertData).map(([key, value]) => `${key}: "${value}"`));
                throw sqlError;
            }
        } catch (error) {
            console.error('Error creating event:', error);
            throw error;
        } finally {
            db.close();
        }
    }

    // 取得所有活動
    getAll() {
        const db = getDb();
        try {
            const events = db.prepare(`
                SELECT e.*, u.chinese_name as creatorName
                FROM events e
                LEFT JOIN users u ON e.createdBy = u.id
                WHERE e.status != 'deleted'
                ORDER BY e.created_at DESC
            `).all();
            return events.map((event: { requirements: string[] | null | undefined; notes: string[] | null | undefined; }) => ({
                ...event,
                requirements: this.stringArrayToJson(event.requirements),
                notes: this.stringArrayToJson(event.notes)
            }));
        } catch (error) {
            console.error('Get all events error:', error);
            return [];
        } finally {
            db.close();
        }
    }

    // 根據 ID 取得活動
    getById(id: number) {
        const db = getDb();
        try {
            const event = db.prepare(`
                SELECT e.*, u.chinese_name as creatorName
                FROM events e
                LEFT JOIN users u ON e.createdBy = u.id
                WHERE e.id = ? AND e.status != 'deleted'
            `).get(id);
            if (!event) return null;
            return {
                ...event,
                requirements: this.jsonToStringArray(event.requirements),
                notes: this.jsonToStringArray(event.notes)
            };
        } catch (error) {
            console.error('Get event by id error:', error);
            return null;
        }
    }

    // 更新活動
    update(id: number, event: Partial<VolunteerEvent>): boolean {
        const db = getDb();
        try {
            // 先檢查活動是否存在
            const existingEvent = this.getById(id);
            if (!existingEvent) {
                return false;
            }

            // 準備更新的欄位
            const updates: string[] = [];
            const values: any[] = [];

            // 檢查每個可能的欄位
            if (event.title !== undefined) {
                updates.push('title = ?');
                values.push(event.title);
            }
            if (event.startDate !== undefined) {
                updates.push('startDate = ?');
                values.push(event.startDate);
            }
            if (event.endDate !== undefined) {
                updates.push('endDate = ?');
                values.push(event.endDate);
            }
            if (event.location !== undefined) {
                updates.push('location = ?');
                values.push(event.location);
            }
            if (event.description !== undefined) {
                updates.push('description = ?');
                values.push(event.description);
            }
            if (event.maxParticipants !== undefined) {
                updates.push('maxParticipants = ?');
                values.push(event.maxParticipants);
            }
            if (event.registrationDeadline !== undefined) {
                updates.push('registrationDeadline = ?');
                values.push(event.registrationDeadline);
            }
            if (event.projectManagerName !== undefined) {
                updates.push('projectManagerName = ?');
                values.push(event.projectManagerName);
            }
            if (event.projectManagerTitle !== undefined) {
                updates.push('projectManagerTitle = ?');
                values.push(event.projectManagerTitle);
            }
            if (event.projectManagerEmail !== undefined) {
                updates.push('projectManagerEmail = ?');
                values.push(event.projectManagerEmail);
            }
            if (event.projectManagerPhone !== undefined) {
                updates.push('projectManagerPhone = ?');
                values.push(event.projectManagerPhone);
            }
            if (event.projectManagerLine !== undefined) {
                updates.push('projectManagerLine = ?');
                values.push(event.projectManagerLine);
            }
            if (event.requirements !== undefined) {
                updates.push('requirements = ?');
                values.push(this.stringArrayToJson(event.requirements));
            }
            if (event.benefits !== undefined) {
                updates.push('benefits = ?');
                values.push(this.stringArrayToJson(event.benefits));
            }
            if (event.items !== undefined) {
                updates.push('items = ?');
                values.push(this.stringArrayToJson(event.items));
            }
            if (event.notes !== undefined) {
                updates.push('notes = ?');
                values.push(this.stringArrayToJson(event.notes));
            }
            if (event.transportation !== undefined) {
                updates.push('transportation = ?');
                values.push(event.transportation);
            }
            if (event.meetingPoint !== undefined) {
                updates.push('meetingPoint = ?');
                values.push(event.meetingPoint);
            }
            if (event.schedule !== undefined) {
                updates.push('schedule = ?');
                values.push(event.schedule);
            }
            if (event.status !== undefined) {
                updates.push('status = ?');
                values.push(event.status);
            }

            // 更新 updated_at
            updates.push('updated_at = CURRENT_TIMESTAMP');

            // 如果沒有要更新的欄位，返回 true（視為更新成功）
            if (updates.length === 0) {
                return true;
            }

            // 執行更新
            const query = `
                UPDATE events 
                SET ${updates.join(', ')}
                WHERE id = ?
            `;
            values.push(id);

            db.prepare(query).run(...values);
            return true;
        } catch (error) {
            console.error('Error updating event:', error);
            return false;
        } finally {
            db.close();
        }
    }

    // 更新活動參與人數
    updateParticipants(id: number, count: number) {
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

    // 刪除活動（軟刪除）
    delete(id: number): boolean {
        const db = getDb();
        const stmt = db.prepare('UPDATE events SET status = ? WHERE id = ?');
        const result = stmt.run('deleted', id);
        return result.changes > 0;
    }
}

class UserEventOperations {
    // 報名活動
    register(userId: number, eventId: number) {
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
            projectManagerName: event.projectManagerName,
            projectManagerTitle: event.projectManagerTitle,
            projectManagerEmail: event.projectManagerEmail,
            projectManagerPhone: event.projectManagerPhone,
            projectManagerLine: event.projectManagerLine
        }));
    }

    // 取得活動的所有參與用戶
    getEventUsers(eventId: number) {
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
