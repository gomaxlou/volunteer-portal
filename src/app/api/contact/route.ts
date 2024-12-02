import { NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // 基本驗證
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: '所有欄位都是必填的' },
        { status: 400 }
      );
    }

    // 發送郵件
    await sendContactEmail({ name, email, subject, message });

    return NextResponse.json(
      { message: '訊息已成功送出' },
      { status: 200 }
    );
  } catch (error) {
    console.error('處理聯絡表單時發生錯誤:', error);
    return NextResponse.json(
      { error: '處理請求時發生錯誤' },
      { status: 500 }
    );
  }
}
