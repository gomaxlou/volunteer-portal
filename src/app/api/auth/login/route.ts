import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { sign } from 'jsonwebtoken';
import { authOperations } from '@/lib/auth-db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    console.log('Login attempt for user:', username);

    // 驗證用戶
    const user = await authOperations.verifyUser(username, password);

    if (!user) {
      console.log('Login failed: Invalid credentials for user:', username);
      return NextResponse.json(
        { message: '帳號或密碼錯誤' },
        { status: 401 }
      );
    }

    console.log('User verified:', { id: user.id, username: user.username, role: user.role });

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

    console.log('Token created for user:', { username: user.username, role: user.role });

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

    console.log('Login successful for user:', { username: user.username, role: user.role });
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: '登入失敗' },
      { status: 500 }
    );
  }
}
