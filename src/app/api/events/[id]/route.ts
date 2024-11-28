import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { eventOperations } from '../../../../lib/dbOperations';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 獲取單個活動
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const event = eventOperations.getById(params.id);
    if (!event) {
      return NextResponse.json(
        { message: '找不到活動' },
        { status: 404 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Get event error:', error);
    return NextResponse.json(
      { message: '系統錯誤' },
      { status: 500 }
    );
  }
}

// 更新活動
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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
      const decoded = verify(token, JWT_SECRET) as { role: string };
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
    const success = eventOperations.update(params.id, eventData);
    
    if (!success) {
      return NextResponse.json(
        { message: '找不到活動' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: '活動更新成功' });
  } catch (error) {
    console.error('Update event error:', error);
    return NextResponse.json(
      { message: '系統錯誤' },
      { status: 500 }
    );
  }
}

// 刪除活動
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
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
      const decoded = verify(token, JWT_SECRET) as { role: string };
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

    const event = eventOperations.getById(params.id);
    if (!event) {
      return NextResponse.json(
        { message: '找不到活動' },
        { status: 404 }
      );
    }

    const success = eventOperations.delete(params.id);
    if (!success) {
      return NextResponse.json(
        { message: '刪除活動失敗' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: '活動刪除成功' });
  } catch (error) {
    console.error('Delete event error:', error);
    return NextResponse.json(
      { message: '系統錯誤' },
      { status: 500 }
    );
  }
}
