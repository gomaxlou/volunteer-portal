import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import eventsData from '@/data/events.json';

export async function GET(request: NextRequest) {
  try {
    // 確保返回的是數組格式，並且從 events 屬性中獲取數據
    const events = eventsData.events || [];
    
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { message: '獲取活動資料失敗' },
      { status: 500 }
    );
  }
}

// 新增活動
export async function POST(request: NextRequest) {
  try {
    // 驗證用戶是否為管理員
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { message: '未登入' },
        { status: 401 }
      );
    }

    try {
      const decoded = verify(token, process.env.JWT_SECRET || 'your-secret-key') as { role: string };
      if (decoded.role !== 'admin') {
        return NextResponse.json(
          { message: '權限不足' },
          { status: 403 }
        );
      }
    } catch {
      return NextResponse.json(
        { message: '登入已過期' },
        { status: 401 }
      );
    }

    const eventData = await request.json();

    // 驗證必填欄位
    if (!eventData.title || !eventData.startDate || !eventData.endDate || !eventData.location || !eventData.description || !eventData.maxParticipants || !eventData.registrationDeadline) {
      return NextResponse.json(
        { message: '缺少必填欄位' },
        { status: 400 }
      );
    }

    // 處理圖片欄位
    const image = eventData.image && eventData.image.trim() !== '' 
      ? eventData.image 
      : undefined;

    // 生成唯一 ID
    eventData.id = `event-${Date.now()}`;
    
    // 設置預設值
    eventData.participants = eventData.participants || 0;
    eventData.maxParticipants = eventData.maxParticipants || 20;
    
    const result = eventOperations.create(eventData);
    
    return NextResponse.json({ 
      message: '活動創建成功',
      eventId: result
    });
  } catch (error) {
    console.error('Create event error:', error);
    return NextResponse.json(
      { message: '系統錯誤', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
