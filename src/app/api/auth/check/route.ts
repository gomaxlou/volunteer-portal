import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    // 從 cookie 中獲取 token
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: '未登入' },
        { status: 401 }
      );
    }

    // 驗證 token
    const decoded = verify(token, JWT_SECRET);
    
    return NextResponse.json({
      authenticated: true,
      user: decoded
    });
    
  } catch (error) {
    console.error('驗證 token 失敗:', error);
    return NextResponse.json(
      { message: '認證失敗' },
      { status: 401 }
    );
  }
}
