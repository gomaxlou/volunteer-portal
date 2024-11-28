import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 需要認證的路徑
const PROTECTED_PATHS = ['/reports'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log('Middleware 處理路徑:', pathname);

  // 只檢查受保護的路徑
  if (!PROTECTED_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // 獲取 token
  const token = request.cookies.get('auth-token')?.value;
  console.log('檢查 token:', token ? '存在' : '不存在');

  if (!token) {
    console.log('無 token，重定向到登入頁面');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // 驗證 token
    verify(token, JWT_SECRET);
    console.log('Token 驗證成功');
    return NextResponse.next();
  } catch (error) {
    console.log('Token 驗證失敗，重定向到登入頁面');
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// 配置需要進行中間件檢查的路徑
export const config = {
  matcher: [
    '/reports/:path*',
  ],
};
