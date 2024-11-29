import * as fs from 'node:fs';
import * as path from 'node:path';
import * as cryptoNode from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface TestResult {
    timestamp: number;
    status: 'pass' | 'fail';
    details?: string;
}

interface TestCache {
    lastCleanup: number;
    tests: {
        [key: string]: {
            hash: string;
            results: TestResult;
            dependencies: string[];
        };
    };
}

class TestTracker {
    private cacheFile: string;
    private logFile: string;
    private cache: TestCache = {
        lastCleanup: 0,
        tests: {}
    };
    private checkLog: string[] = [];
    private currentTestName: string = '';
    private testStartTime: number = 0;

    constructor() {
        this.cacheFile = path.join(process.cwd(), '.test-cache.json');
        this.logFile = path.join(process.cwd(), 'logs', 'test-tracker.log');
        this.ensureLogDirectory();
        this.loadCache();
        this.checkDailyCleanup();
    }

    private ensureLogDirectory() {
        const logDir = path.dirname(this.logFile);
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
    }

    private formatDate(date: Date): string {
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
               `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }

    public appendToLog(message: string, type: 'info' | 'warning' | 'error' | 'success' = 'info') {
        const now = new Date();
        const timestamp = this.formatDate(now);
        
        // 準備日誌訊息
        const logEntry = `[${timestamp}] ${this.currentTestName ? `[${this.currentTestName}] ` : ''}${message}`;
        
        // 控制台輸出（帶顏色）
        const consoleColors = {
            info: '\x1b[36m',     // 青色
            warning: '\x1b[33m',   // 黃色
            error: '\x1b[31m',     // 紅色
            success: '\x1b[32m'    // 綠色
        };
        console.log(`${consoleColors[type]}${logEntry}\x1b[0m`);

        // HTML 格式的日誌訊息
        const htmlLogFile = this.logFile.replace('.log', '.html');
        const typeColors = {
            info: '#17a2b8',      // 藍色
            warning: '#ffc107',    // 黃色
            error: '#dc3545',      // 紅色
            success: '#28a745'     // 綠色
        };

        // 如果 HTML 檔案不存在，建立它並加入 CSS
        if (!fs.existsSync(htmlLogFile)) {
            const htmlHeader = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>測試日誌</title>
    <style>
        body {
            font-family: 'Microsoft JhengHei', Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .log-container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .test-section {
            border: 1px solid #dee2e6;
            margin: 20px 0;
            border-radius: 5px;
            overflow: hidden;
        }
        .test-header {
            background: #343a40;
            color: white;
            padding: 10px 15px;
            font-weight: bold;
        }
        .test-body {
            padding: 15px;
        }
        .log-entry {
            padding: 8px 15px;
            margin: 5px 0;
            border-radius: 3px;
            font-family: monospace;
        }
        .timestamp {
            color: #6c757d;
            margin-right: 10px;
        }
        .test-name {
            font-weight: bold;
            margin-right: 10px;
        }
        .test-result {
            padding: 10px 15px;
            margin-top: 10px;
            border-top: 1px solid #dee2e6;
            font-weight: bold;
        }
        .duration {
            color: #6c757d;
            font-size: 0.9em;
        }
        .auto-scroll {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 20px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .auto-scroll:hover {
            background: #0056b3;
        }
    </style>
    <script>
        function scrollToBottom() {
            window.scrollTo(0, document.body.scrollHeight);
        }
        // 自動滾動到底部
        window.onload = scrollToBottom;
    </script>
</head>
<body>
    <div class="log-container">
        <h1>測試日誌</h1>
        <div id="log-content">
`;
            fs.writeFileSync(htmlLogFile, htmlHeader);
        }

        // 添加日誌條目
        const htmlEntry = `            <div class="log-entry" style="background-color: ${typeColors[type]}15;">
                <span class="timestamp">${timestamp}</span>
                ${this.currentTestName ? `<span class="test-name">[${this.currentTestName}]</span>` : ''}
                <span style="color: ${typeColors[type]};">${message}</span>
                ${this.testStartTime ? `<span class="duration">(${Date.now() - this.testStartTime}ms)</span>` : ''}
            </div>\n`;

        fs.appendFileSync(htmlLogFile, htmlEntry);
    }

    private startNewTestSection(testName: string) {
        this.currentTestName = testName;
        this.testStartTime = Date.now();
        
        const separator = '='.repeat(80);
        const timestamp = this.formatDate(new Date());
        
        // 控制台輸出
        const header = `\n${separator}\n` +
                      `測試開始: ${testName}\n` +
                      `時間: ${timestamp}\n` +
                      separator + '\n';
        console.log('\x1b[1m' + header + '\x1b[0m');

        // HTML 輸出
        const htmlLogFile = this.logFile.replace('.log', '.html');
        const htmlHeader = `        <div class="test-section">
            <div class="test-header">
                測試開始: ${testName}
                <div style="font-size: 0.9em;">時間: ${timestamp}</div>
            </div>
            <div class="test-body">\n`;
        
        fs.appendFileSync(htmlLogFile, htmlHeader);
    }

    private endTestSection(status: 'pass' | 'fail', details?: string) {
        const duration = Date.now() - this.testStartTime;
        
        // 控制台輸出
        const result = `\n結果: ${status.toUpperCase()}${details ? ` - ${details}` : ''}\n` +
                      `耗時: ${duration}ms\n` +
                      '='.repeat(80) + '\n';
        const color = status === 'pass' ? '\x1b[32m' : '\x1b[31m';
        console.log(color + result + '\x1b[0m');

        // HTML 輸出
        const htmlLogFile = this.logFile.replace('.log', '.html');
        const statusColor = status === 'pass' ? '#28a745' : '#dc3545';
        const htmlResult = `            <div class="test-result" style="color: ${statusColor};">
                結果: ${status.toUpperCase()}${details ? ` - ${details}` : ''}
                <div class="duration">耗時: ${duration}ms</div>
            </div>
        </div>
    </div>\n`;
        
        fs.appendFileSync(htmlLogFile, htmlResult);
        
        this.currentTestName = '';
        this.testStartTime = 0;
    }

    private loadCache() {
        try {
            if (fs.existsSync(this.cacheFile)) {
                this.cache = JSON.parse(fs.readFileSync(this.cacheFile, 'utf-8'));
            }
        } catch (error) {
            console.warn('無法載入測試快取，將建立新的快取');
            this.cache = { lastCleanup: 0, tests: {} };
        }
    }

    private saveCache() {
        fs.writeFileSync(this.cacheFile, JSON.stringify(this.cache, null, 2));
    }

    private calculateFileHash(filePath: string): string {
        const content = fs.readFileSync(filePath, 'utf-8');
        return cryptoNode.createHash('md5').update(content).digest('hex');
    }

    private hasFileChanged(filePath: string, lastHash: string): boolean {
        try {
            const currentHash = this.calculateFileHash(filePath);
            const changed = currentHash !== lastHash;
            if (changed) {
                this.appendToLog(`檔案已變更: ${filePath}`, 'warning');
            } else {
                this.appendToLog(`檔案未變更: ${filePath}`, 'success');
            }
            return changed;
        } catch (error) {
            this.appendToLog(`檢查檔案變更失敗: ${filePath} - ${error}`, 'error');
            return true;
        }
    }

    private checkDailyCleanup() {
        const now = Date.now();
        const oneDayMs = 24 * 60 * 60 * 1000;
        
        if (now - this.cache.lastCleanup > oneDayMs) {
            this.appendToLog('執行每日快取清理', 'info');
            this.clearCache();
            this.cache.lastCleanup = now;
            this.saveCache();
        } else {
            const nextCleanup = new Date(this.cache.lastCleanup + oneDayMs);
            this.appendToLog(`下次快取清理時間: ${nextCleanup.toLocaleString()}`, 'info');
        }
    }

    shouldRunTest(testName: string, filePath: string, dependencies: string[] = []): boolean {
        this.checkLog = [];
        this.startNewTestSection(testName);
        
        const cacheEntry = this.cache.tests[testName];
        
        if (!cacheEntry) {
            this.appendToLog('找不到快取記錄，需要執行測試', 'warning');
            return true;
        }

        this.appendToLog(`檢查主要檔案: ${filePath}`, 'info');
        if (this.hasFileChanged(filePath, cacheEntry.hash)) {
            return true;
        }

        for (const dep of dependencies) {
            if (!fs.existsSync(dep)) {
                this.appendToLog(`相依檔案不存在: ${dep}`, 'warning');
                continue;
            }
            this.appendToLog(`檢查相依檔案: ${dep}`, 'info');
            const depEntry = this.cache.tests[dep];
            if (!depEntry || this.hasFileChanged(dep, depEntry.hash)) {
                return true;
            }
        }

        return false;
    }

    recordTestResult(
        testName: string, 
        filePath: string, 
        status: 'pass' | 'fail',
        dependencies: string[] = [],
        details?: string
    ) {
        this.appendToLog(
            `記錄測試結果: ${status.toUpperCase()}${details ? ` (${details})` : ''}`,
            status === 'pass' ? 'success' : 'error'
        );
        
        this.cache.tests[testName] = {
            hash: this.calculateFileHash(filePath),
            results: {
                timestamp: Date.now(),
                status,
                details
            },
            dependencies
        };
        this.saveCache();
        this.endTestSection(status, details);
    }

    getLastTestResult(testName: string): TestResult | null {
        return this.cache.tests[testName]?.results || null;
    }

    clearCache() {
        this.appendToLog('清理所有測試快取', 'info');
        this.cache.tests = {};
        this.saveCache();
    }
}

function createTestRunner() {
    const tracker = new TestTracker();

    return {
        async runTest(
            testName: string,
            filePath: string,
            dependencies: string[],
            testFn: () => Promise<void>
        ) {
            const shouldRun = tracker.shouldRunTest(testName, filePath, dependencies);
            
            if (!shouldRun) {
                const lastResult = tracker.getLastTestResult(testName);
                tracker.appendToLog(
                    `跳過測試 - 使用快取結果 (${lastResult?.status})`,
                    lastResult?.status === 'pass' ? 'success' : 'warning'
                );
                return;
            }

            try {
                await testFn();
                tracker.recordTestResult(testName, filePath, 'pass', dependencies);
            } catch (error) {
                tracker.recordTestResult(
                    testName, 
                    filePath, 
                    'fail', 
                    dependencies,
                    error instanceof Error ? error.message : String(error)
                );
                throw error;
            }
        }
    };
}

export { createTestRunner };
