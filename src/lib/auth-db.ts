import { db } from './db/db';
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
    } catch (error) {
      console.error('驗證用戶失敗:', error);
      throw error;
    }
  },

  // 註冊新用戶
  async registerUser(userData: UserRegistration) {
    try {
      const hashedPassword = await hash(userData.password, 10);

      const result = db.prepare(`
        INSERT INTO users (
          chinese_name, english_name, username, password, 
          email, gender, birthday, phone, id_number, skills
        ) VALUES (
          @chinese_name, @english_name, @username, @password,
          @email, @gender, @birthday, @phone, @id_number, @skills
        )
      `).run({
        ...userData,
        password: hashedPassword
      });

      if (!result.lastInsertRowid) {
        throw new Error('註冊失敗');
      }

      const user = db.prepare(
        'SELECT * FROM users WHERE id = ?'
      ).get(result.lastInsertRowid);

      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('註冊用戶失敗:', error);
      throw error;
    }
  }
};
