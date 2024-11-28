import { getDb } from './db';
import { compare, hash } from 'bcryptjs';

export interface User {
  id: number;
  chinese_name: string;
  english_name?: string;
  username: string;
  email: string;
  gender: 'M' | 'F';
  birthday: string;
  phone: string;
  id_number: string;
  skills?: string;
  role: 'admin' | 'user';
}

export interface UserRegistration extends Omit<User, 'id' | 'role'> {
  password: string;
}

export const authOperations = {
  // 驗證用戶登入
  async verifyUser(username: string, password: string) {
    const db = getDb();
    try {
      const user = db.prepare(
        'SELECT * FROM users WHERE username = ?'
      ).get(username);

      if (!user) {
        return null;
      }

      const isValid = await compare(password, user.password);
      if (!isValid) {
        return null;
      }

      // 不返回密碼
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } finally {
      db.close();
    }
  },

  // 註冊新用戶
  async registerUser(userData: UserRegistration) {
    const db = getDb();
    try {
      // 檢查用戶名是否已存在
      const existingUser = db.prepare(
        'SELECT username FROM users WHERE username = ? OR email = ? OR id_number = ?'
      ).get(userData.username, userData.email, userData.id_number);

      if (existingUser) {
        throw new Error('用戶名、電子郵件或身份證字號已被使用');
      }

      // 加密密碼
      const hashedPassword = await hash(userData.password, 10);

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
      `).run(
        userData.chinese_name,
        userData.english_name || null,
        userData.username,
        hashedPassword,
        userData.email,
        userData.gender,
        userData.birthday,
        userData.phone,
        userData.id_number,
        userData.skills || null
      );

      if (result.changes === 0) {
        throw new Error('註冊失敗');
      }

      return { success: true };
    } finally {
      db.close();
    }
  }
};
