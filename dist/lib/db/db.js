"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
// 創建資料庫連接
const db = new better_sqlite3_1.default(path_1.default.join(process.cwd(), 'data/volunteer-portal.db'), {
    verbose: console.log
});
exports.db = db;
// 啟用外鍵約束
db.pragma('foreign_keys = ON');
