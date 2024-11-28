import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

// 創建資料庫連接
const db = new Database(path.join(process.cwd(), 'data/volunteer.db'));

// 啟用外鍵約束
db.pragma('foreign_keys = ON');

// 創建 users 表
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    chinese_name TEXT NOT NULL,
    english_name TEXT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    gender TEXT CHECK(gender IN ('M', 'F')),
    birthday TEXT,
    phone TEXT,
    id_number TEXT UNIQUE,
    skills TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('admin', 'user')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// 創建默認管理員帳號（如果不存在）
const adminExists = db.prepare('SELECT 1 FROM users WHERE username = ?').get('admin');
if (!adminExists) {
  const hashedPassword = bcrypt.hashSync('admin123', 10);
  
  db.prepare(`
    INSERT INTO users (
      chinese_name, username, password, email, gender, role
    ) VALUES (
      '管理員', 'admin', ?, 'admin@example.com', 'M', 'admin'
    )
  `).run(hashedPassword);
}

export { db };
