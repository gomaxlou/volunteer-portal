import { db } from './db';

// 啟用外鍵約束
db.pragma('foreign_keys = ON');

// 創建事件表
db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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
    createdBy INTEGER REFERENCES users(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// 定義資料庫事件介面
export interface DbEvent {
  id: number;
  title: string;
  startDate: string;
  endDate?: string;
  location: string;
  description?: string;
  maxParticipants: number;
  participants: number;
  registrationDeadline: string;
  image?: string;
  projectManagerName?: string;
  projectManagerEmail?: string;
  projectManagerPhone?: string;
  requirements?: string;
  notes?: string;
  createdBy?: number;
  created_at?: string;
  creatorName?: string;
}

// 定義 API 事件介面
export interface ApiEvent {
  id: number;
  title: string;
  startDate: string;
  endDate?: string;
  location: string;
  description?: string;
  maxParticipants: number;
  participants: number;
  registrationDeadline: string;
  image?: string;
  projectManager?: {
    name: string;
    email: string;
    phone: string;
  };
  details: {
    requirements: string[];
    notes: string[];
  };
  createdBy?: number;
  creatorName?: string;
}

export const eventQueries = {
  create: (event: DbEvent) => {
    const stmt = db.prepare(`
      INSERT INTO events (
        title, startDate, endDate, location, description,
        maxParticipants, participants, registrationDeadline, image,
        projectManagerName, projectManagerEmail, projectManagerPhone,
        requirements, notes, createdBy
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `);

    const result = stmt.run(
      event.title,
      event.startDate,
      event.endDate || '',
      event.location,
      event.description || '',
      event.maxParticipants,
      event.participants,
      event.registrationDeadline,
      event.image || '/images/default-event.jpg',
      event.projectManagerName || null,
      event.projectManagerEmail || null,
      event.projectManagerPhone || null,
      event.requirements || '[]',
      event.notes || '[]',
      event.createdBy || null
    );

    return result.lastInsertRowid;
  },

  getAll: () => {
    const stmt = db.prepare(`
      SELECT 
        e.*,
        u.chinese_name as creatorName
      FROM events e
      LEFT JOIN users u ON e.createdBy = u.id
      ORDER BY e.created_at DESC
    `);

    const events = stmt.all() as DbEvent[];
    return events.map((event): ApiEvent => ({
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
        requirements: JSON.parse(event.requirements || '[]'),
        notes: JSON.parse(event.notes || '[]')
      },
      createdBy: event.createdBy,
      creatorName: event.creatorName
    }));
  },

  getById: (id: number) => {
    const stmt = db.prepare(`
      SELECT 
        e.*,
        u.chinese_name as creatorName
      FROM events e
      LEFT JOIN users u ON e.createdBy = u.id
      WHERE e.id = ?
    `);

    const event = stmt.get(id) as DbEvent | undefined;
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
        requirements: JSON.parse(event.requirements || '[]'),
        notes: JSON.parse(event.notes || '[]')
      },
      createdBy: event.createdBy,
      creatorName: event.creatorName
    } as ApiEvent;
  },

  update: (id: number, event: Partial<DbEvent>) => {
    const updates: string[] = [];
    const values: any[] = [];

    Object.entries(event).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id') {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (updates.length === 0) return false;

    const stmt = db.prepare(`
      UPDATE events 
      SET ${updates.join(', ')}
      WHERE id = ?
    `);

    values.push(id);
    const result = stmt.run(...values);
    return result.changes > 0;
  },

  delete: (id: number) => {
    const stmt = db.prepare('DELETE FROM events WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
};
