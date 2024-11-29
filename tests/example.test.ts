import { createTestRunner } from './TestTracker';

const testRunner = createTestRunner();

// 測試範例
async function main() {
    const dbOperationsPath = '../src/lib/dbOperations.ts';
    const eventsPath = '../src/lib/db/events.ts';

    // 測試資料庫操作
    await testRunner.runTest(
        'EventOperations.getById',
        dbOperationsPath,
        [eventsPath],
        async () => {
            // 這裡放測試邏輯
            // 如果測試失敗，拋出錯誤
            // 如果成功，什麼都不做
        }
    );

    // 測試活動列表
    await testRunner.runTest(
        'EventsList',
        '../src/components/EventsList.tsx',
        [dbOperationsPath, eventsPath],
        async () => {
            // 測試邏輯
        }
    );
}

main().catch(console.error);
