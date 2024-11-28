import fs from 'fs/promises';
import path from 'path';
import { eventQueries } from '../src/lib/db/events';

async function migrateEvents() {
  try {
    // 讀取 JSON 文件
    const eventsFile = path.join(process.cwd(), 'src/data/events.json');
    const data = await fs.readFile(eventsFile, 'utf8');
    const { events } = JSON.parse(data);

    console.log(`Found ${events.length} events to migrate`);

    // 遷移每個活動到資料庫
    for (const event of events) {
      try {
        await eventQueries.create(event);
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
  }
}

// 執行遷移
migrateEvents();
