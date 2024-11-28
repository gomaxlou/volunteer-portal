import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authOperations } from '@/lib/auth-db';

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();
    
    // 基本驗證
    if (!userData.username || !userData.password || !userData.chinese_name || 
        !userData.email || !userData.gender || !userData.birthday || 
        !userData.phone || !userData.id_number) {
      return NextResponse.json(
        { message: '所有必填欄位都必須填寫' },
        { status: 400 }
      );
    }

    // 密碼強度驗證
    if (userData.password.length < 8) {
      return NextResponse.json(
        { message: '密碼長度必須至少8個字符' },
        { status: 400 }
      );
    }

    // 身份證字號格式驗證（簡單版）
    const idNumberRegex = /^[A-Z][12]\d{8}$/;
    if (!idNumberRegex.test(userData.id_number)) {
      return NextResponse.json(
        { message: '身份證字號格式不正確' },
        { status: 400 }
      );
    }

    // 電子郵件格式驗證
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      return NextResponse.json(
        { message: '電子郵件格式不正確' },
        { status: 400 }
      );
    }

    // 註冊用戶
    await authOperations.registerUser(userData);

    return NextResponse.json({
      message: '註冊成功',
      success: true
    });
  } catch (error: any) {
    console.error('註冊錯誤:', error);
    
    // 處理特定錯誤
    if (error.message.includes('已被使用')) {
      return NextResponse.json(
        { message: error.message },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: '註冊失敗' },
      { status: 500 }
    );
  }
}
