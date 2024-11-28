"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authOperations = void 0;
const db_1 = require("./db");
const bcryptjs_1 = require("bcryptjs");
exports.authOperations = {
    // 驗證用戶登入
    async verifyUser(username, password) {
        const db = (0, db_1.getDb)();
        try {
            const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
            if (!user) {
                return null;
            }
            const isValid = await (0, bcryptjs_1.compare)(password, user.password);
            if (!isValid) {
                return null;
            }
            // 不返回密碼
            const { password: _, ...userWithoutPassword } = user;
            return userWithoutPassword;
        }
        finally {
            db.close();
        }
    },
    // 註冊新用戶
    async registerUser(userData) {
        const db = (0, db_1.getDb)();
        try {
            // 檢查用戶名是否已存在
            const existingUser = db.prepare('SELECT username FROM users WHERE username = ? OR email = ? OR id_number = ?').get(userData.username, userData.email, userData.id_number);
            if (existingUser) {
                throw new Error('用戶名、電子郵件或身份證字號已被使用');
            }
            // 加密密碼
            const hashedPassword = await (0, bcryptjs_1.hash)(userData.password, 10);
            // 插入新用戶
            const result = db.prepare(`
        INSERT INTO users (
          chinese_name, english_name, username, password, 
          email, gender, birthday, phone, 
          id_number, skills, role
        ) VALUES (
          ?, ?, ?, ?, 
          ?, ?, ?, ?, 
          ?, ?, 'user'
        )
      `).run(userData.chinese_name, userData.english_name || null, userData.username, hashedPassword, userData.email, userData.gender, userData.birthday, userData.phone, userData.id_number, userData.skills || null);
            if (result.changes === 0) {
                throw new Error('註冊失敗');
            }
            return { success: true };
        }
        finally {
            db.close();
        }
    }
};
