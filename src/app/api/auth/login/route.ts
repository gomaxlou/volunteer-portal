import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { sign } from 'jsonwebtoken';
import { authOperations } from '@/lib/auth-db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // 驗證用戶
    const user = await authOperations.verifyUser(username, password);

    if (!user) {
      return NextResponse.json(
        { message: '帳號或密碼錯誤' },
        { status: 401 }
      );
    }

    // 創建 JWT token
    const token = sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
        chinese_name: user.chinese_name
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 創建響應
    const response = NextResponse.json({
      message: '登入成功',
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        chinese_name: user.chinese_name,
        email: user.email
      }
    });

    // 設置 cookie
    const cookieOptions = {
      name: 'auth-token',
      value: token,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 86400 // 1 day
    };
    response.cookies.set(cookieOptions);

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: '登入失敗' },
      { status: 500 }
    );
  }
}
