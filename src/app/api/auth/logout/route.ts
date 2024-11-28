import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({ message: '登出成功' });
    
    // 刪除 auth-token cookie
    response.cookies.delete('auth-token');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: '系統錯誤' },
      { status: 500 }
    );
  }
}
