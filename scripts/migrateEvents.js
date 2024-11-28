const fs = require('fs').promises;
const path = require('path');
const Database = require('better-sqlite3');

// 創建資料庫連接
const db = new Database(path.join(process.cwd(), 'data/volunteer-portal.db'), {
  verbose: console.log
});

// 啟用外鍵約束
db.pragma('foreign_keys = ON');

// 創建事件表
db.exec(`
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

async function migrateEvents() {
  try {
    // 讀取 JSON 文件
    const eventsFile = path.join(process.cwd(), 'src/data/events.json');
    const data = await fs.readFile(eventsFile, 'utf8');
    const { events } = JSON.parse(data);

    console.log(`Found ${events.length} events to migrate`);

    // 準備 SQL 語句
    const stmt = db.prepare(`
      INSERT INTO events (
        id, title, startDate, endDate, location, description,
        maxParticipants, participants, registrationDeadline, image,
        projectManagerName, projectManagerEmail, projectManagerPhone,
        requirements, notes
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `);

    // 遷移每個活動到資料庫
    for (const event of events) {
      try {
        stmt.run(
          event.id,
          event.title,
          event.startDate,
          event.endDate,
          event.location,
          event.description,
          event.maxParticipants,
          event.participants || 0,
          event.registrationDeadline,
          event.image,
          event.projectManager?.name || null,
          event.projectManager?.email || null,
          event.projectManager?.phone || null,
          JSON.stringify(event.details?.requirements || []),
          JSON.stringify(event.details?.notes || [])
        );
        console.log(`✓ Migrated event: ${event.title}`);
      } catch (error) {
        console.error(`✗ Failed to migrate event: ${event.title}`, error);
      }
    }

    // 備份原始 JSON 文件
    const backupFile = path.join(process.cwd(), 'src/data/events.json.bak');
    await fs.copyFile(eventsFile, backupFile);
    console.log(`\nOriginal data backed up to: ${backupFile}`);

    console.log('\nMigration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    db.close();
  }
}

// 執行遷移
migrateEvents();
