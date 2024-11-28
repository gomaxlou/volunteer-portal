import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';
import { eventOperations } from '@/lib/dbOperations';

// 獲取活動列表
export async function GET(request: NextRequest) {
  try {
    const events = eventOperations.getAll();
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

    let decoded;
    try {
      decoded = verify(token, process.env.JWT_SECRET || 'your-secret-key') as { 
        id: number;
        role: string;
      };
      
      if (decoded.role !== 'admin') {
        return NextResponse.json(
          { message: '權限不足' },
          { status: 403 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { message: '登入已過期' },
        { status: 401 }
      );
    }

    const eventData = await request.json();

    console.log('Validating event data:', eventData);
    // 驗證必填欄位
    const requiredFields = [
      'title',
      'startDate',
      'endDate',
      'location',
      'maxParticipants',
      'registrationDeadline',
      'projectManagerName',
      'projectManagerEmail',
      'projectManagerPhone'
    ];

    const missingFields = requiredFields.filter(field => {
      const value = eventData[field];
      const isEmpty = value === undefined || value === null || value === '';
      if (isEmpty) {
        console.log(`Missing field ${field}:`, value);
      }
      return isEmpty;
    });

    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
      return NextResponse.json(
        { 
          message: '以下欄位為必填：' + missingFields.join(', '),
          fields: missingFields 
        },
        { status: 400 }
      );
    }

    // 驗證日期格式
    const dateFields = ['startDate', 'endDate', 'registrationDeadline'];
    const invalidDateFields = dateFields.filter(field => {
      const date = new Date(eventData[field]);
      return isNaN(date.getTime());
    });

    if (invalidDateFields.length > 0) {
      console.log('Invalid date fields:', invalidDateFields);
      return NextResponse.json(
        {
          message: '以下日期格式不正確：' + invalidDateFields.join(', '),
          fields: invalidDateFields
        },
        { status: 400 }
      );
    }

    // 驗證數字欄位
    if (isNaN(parseInt(eventData.maxParticipants)) || parseInt(eventData.maxParticipants) <= 0) {
      console.log('Invalid maxParticipants:', eventData.maxParticipants);
      return NextResponse.json(
        {
          message: '最大參與人數必須為正整數',
          fields: ['maxParticipants']
        },
        { status: 400 }
      );
    }

    // 處理陣列欄位
    const arrayFields = ['requirements', 'benefits', 'items', 'notes'];
    arrayFields.forEach(field => {
      if (eventData[field]) {
        // 如果欄位是字串（多行文字），轉換為陣列
        if (typeof eventData[field] === 'string') {
          eventData[field] = eventData[field]
            .split('\n')
            .map(item => item.trim())
            .filter(Boolean);
        }
        // 將陣列轉換為 JSON 字串存入資料庫
        eventData[field] = JSON.stringify(eventData[field]);
      }
    });

    // 設置預設值和資料類型轉換
    const processedEventData = {
      ...eventData,
      participants: 0,
      maxParticipants: parseInt(eventData.maxParticipants),
      image: eventData.image || '/images/events/default-event.jpg',
      status: eventData.status || 'draft',
      createdBy: decoded.id,
      // 確保所有選填欄位都有定義
      projectManagerTitle: eventData.projectManagerTitle || null,
      projectManagerLine: eventData.projectManagerLine || null,
      category: eventData.category || null,
      difficulty: eventData.difficulty || null,
      transportation: eventData.transportation || null,
      meetingPoint: eventData.meetingPoint || null,
      schedule: eventData.schedule || null
    };
    
    const eventId = eventOperations.create(processedEventData);
    
    return NextResponse.json({ 
      message: '活動創建成功',
      eventId: eventId
    });
  } catch (error) {
    console.error('Create event error:', error);
    return NextResponse.json(
      { message: '系統錯誤', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// 更新活動
export async function PUT(request: NextRequest) {
  try {
    // 驗證用戶是否為管理員
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { message: '未登入' },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = verify(token, process.env.JWT_SECRET || 'your-secret-key') as {
        id: number;
        role: string;
      };
      
      if (decoded.role !== 'admin') {
        return NextResponse.json(
          { message: '權限不足' },
          { status: 403 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { message: '登入已過期' },
        { status: 401 }
      );
    }

    const eventData = await request.json();
    const { id, ...updateData } = eventData;

    if (!id) {
      return NextResponse.json(
        { message: '缺少活動ID' },
        { status: 400 }
      );
    }

    // 處理專案經理資訊
    if (updateData.projectManager) {
      updateData.projectManagerName = updateData.projectManager.name;
      updateData.projectManagerEmail = updateData.projectManager.email;
      updateData.projectManagerPhone = updateData.projectManager.phone;
    }

    // 處理詳細資訊
    if (updateData.details) {
      updateData.requirements = JSON.stringify(updateData.details.requirements || []);
      updateData.notes = JSON.stringify(updateData.details.notes || []);
    }

    // 處理圖片路徑
    if (updateData.imageUrl) {
      // 如果提供了新的圖片URL（從上傳API返回），使用它
      updateData.image = updateData.imageUrl;
      delete updateData.imageUrl; // 移除臨時欄位
    }

    // 更新活動
    const success = eventOperations.update(id, updateData);
    
    if (!success) {
      return NextResponse.json(
        { message: '活動不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: '活動更新成功'
    });
  } catch (error) {
    console.error('Update event error:', error);
    return NextResponse.json(
      { message: '系統錯誤', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// 刪除活動
export async function DELETE(request: NextRequest) {
  try {
    // 驗證用戶是否為管理員
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { message: '未登入' },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = verify(token, process.env.JWT_SECRET || 'your-secret-key') as {
        id: number;
        role: string;
      };
      
      if (decoded.role !== 'admin') {
        return NextResponse.json(
          { message: '權限不足' },
          { status: 403 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { message: '登入已過期' },
        { status: 401 }
      );
    }

    // 從 URL 獲取活動 ID
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { message: '缺少活動ID' },
        { status: 400 }
      );
    }

    // 刪除活動
    const success = eventOperations.delete(parseInt(id));
    
    if (!success) {
      return NextResponse.json(
        { message: '活動不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: '活動刪除成功'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    return NextResponse.json(
      { message: '系統錯誤', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
