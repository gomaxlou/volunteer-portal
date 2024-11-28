const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const { dirname } = require('path');

// 數據庫文件路徑
const dbPath = path.join(process.cwd(), 'data', 'volunteer.db');

// 創建數據庫連接
export const getDb = () => {
    try {
        const db = new Database(dbPath);
        
        // 啟用外鍵約束
        db.pragma('foreign_keys = ON');
        
        return db;
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
}

// 初始化數據庫表
export const initDb = () => {
    const db = getDb();
    
    // 創建活動表
    db.exec(`
        CREATE TABLE IF NOT EXISTS events (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            startDate TEXT NOT NULL,
            endDate TEXT NOT NULL,
            location TEXT NOT NULL,
            description TEXT,
            image TEXT,
            participants INTEGER DEFAULT 0,
            maxParticipants INTEGER,
            registrationDeadline TEXT,
            projectManager TEXT,
            details TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    
    // 創建用戶表
    db.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    
    // 創建用戶活動關聯表
    db.exec(`
        CREATE TABLE IF NOT EXISTS user_events (
            user_id INTEGER,
            event_id TEXT,
            status TEXT DEFAULT 'registered',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, event_id),
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (event_id) REFERENCES events(id)
        )
    `);
    
    db.close();
}

// 確保數據目錄存在
const dataDir = dirname(dbPath);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// 初始化數據庫
initDb();
