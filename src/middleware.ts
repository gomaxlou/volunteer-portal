import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwtToken } from './lib/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 公開路徑列表
const publicPaths = [
  '/login',
  '/register',
  '/',
  '/about',
  '/donation',
  '/api/auth/callback',
  '/api/auth/providers',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log('Middleware 處理路徑:', pathname);

  // 如果是公開路徑或報告頁面，直接放行
  if (publicPaths.some(path => pathname.startsWith(path)) || pathname.startsWith('/reports')) {
    return NextResponse.next();
  }

  // 檢查認證
  const token = request.cookies.get('token')?.value;
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const verifiedToken = await verifyJwtToken(token);
    if (!verifiedToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  } catch (error) {
    console.error('Token 驗證失敗:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// 配置需要進行中間件處理的路徑
export const config = {
  matcher: [
    /*
     * 匹配所有路徑除了：
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
