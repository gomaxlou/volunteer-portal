const { eventOperations } = require('../src/lib/dbOperations');
const { initDb } = require('../src/lib/db');
const fs = require('fs');
const path = require('path');

async function migrateData() {
    try {
        // 初始化數據庫
        initDb();

        // 讀取 events.json
        const eventsData = JSON.parse(
            fs.readFileSync(
                path.join(process.cwd(), 'src', 'data', 'events.json'),
                'utf-8'
            )
        );

        // 遍歷並插入每個活動
        for (const event of eventsData.events) {
            try {
                eventOperations.create(event);
                console.log(`Successfully migrated event: ${event.title}`);
            } catch (error) {
                console.error(`Failed to migrate event: ${event.title}`, error);
            }
        }

        console.log('Data migration completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
    }
}

migrateData();
