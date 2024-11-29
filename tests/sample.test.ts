import { createTestRunner } from './TestTracker.js';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testRunner = createTestRunner();

async function main() {
    // 測試資料庫操作
    await testRunner.runTest(
        'EventOperations.getById',
        path.resolve(__dirname, '../src/lib/dbOperations.ts'),
        [path.resolve(__dirname, '../src/lib/db/events.ts')],
        async () => {
            // 模擬測試
            await new Promise(resolve => setTimeout(resolve, 500));
            console.log('測試 getById 操作');
        }
    );

    // 測試活動列表（模擬失敗）
    await testRunner.runTest(
        'EventsList.render',
        path.resolve(__dirname, '../src/components/EventsList.tsx'),
        [path.resolve(__dirname, '../src/lib/dbOperations.ts')],
        async () => {
            await new Promise(resolve => setTimeout(resolve, 300));
            throw new Error('渲染失敗：找不到必要的 props');
        }
    ).catch(console.error);
}

main();
