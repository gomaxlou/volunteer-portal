import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import type { UserInfo } from '@/lib/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET() {
  try {
    // 等待 cookies Promise 解析
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: '未登入' },
        { status: 401 }
      );
    }

    try {
      const decoded = verify(token, JWT_SECRET) as { 
        id: number;
        username: string; 
        role: 'admin' | 'user';
        chinese_name: string;
      };
      
      const user: UserInfo = {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role,
        chinese_name: decoded.chinese_name
      };
      return NextResponse.json({ user });
    } catch (error) {
      return NextResponse.json(
        { message: '登入已過期' },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: '系統錯誤' },
      { status: 500 }
    );
  }
}
