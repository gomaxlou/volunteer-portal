import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';
import { eventOperations } from '@/lib/dbOperations';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 獲取單個活動
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    console.log('GET request received');
    
    // 驗證用戶是否已登入
    const token = request.cookies.get('auth-token')?.value;
    console.log('Auth token:', token ? 'present' : 'missing');
    
    if (!token) {
      console.log('No auth token found');
      return NextResponse.json(
        { message: '未登入' },
        { status: 401 }
      );
    }

    try {
      // 驗證 token
      const decoded = verify(token, JWT_SECRET);
      console.log('Token verified:', decoded);
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json(
        { message: '登入已過期，請重新登入' },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    console.log('Event ID from params:', id);

    const event = eventOperations.getById(id);
    console.log('Event from database:', event);

    if (!event) {
      console.log('Event not found');
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
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    console.log('PUT request received');
    
    const { id } = await context.params;
    console.log('Event ID from params:', id);
    
    // 驗證用戶是否為管理員
    const token = request.cookies.get('auth-token')?.value;
    console.log('Auth token:', token ? 'present' : 'missing');
    
    if (!token) {
      console.log('No auth token found');
      return NextResponse.json(
        { message: '未登入' },
        { status: 401 }
      );
    }

    try {
      const decoded = verify(token, JWT_SECRET) as { role: string };
      console.log('Token verified:', decoded);
      
      if (decoded.role !== 'admin') {
        console.log('Insufficient role');
        return NextResponse.json(
          { message: '權限不足' },
          { status: 403 }
        );
      }

      const data = await request.json();
      console.log('Request data:', data);

      const success = eventOperations.update(id, data);
      console.log('Update result:', success);

      if (!success) {
        console.log('Update failed');
        return NextResponse.json(
          { message: '更新失敗' },
          { status: 400 }
        );
      }

      return NextResponse.json({ message: '更新成功' });
    } catch (error) {
      console.error('Update event error:', error);
      if (error instanceof Error) {
        return NextResponse.json(
          { message: error.message },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { message: '更新失敗' },
        { status: 400 }
      );
    }
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
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    console.log('DELETE request received');
    
    const { id } = await context.params;
    console.log('Event ID from params:', id);
    
    // 驗證用戶是否為管理員
    const token = request.cookies.get('auth-token')?.value;
    console.log('Auth token:', token ? 'present' : 'missing');
    
    if (!token) {
      console.log('No auth token found');
      return NextResponse.json(
        { message: '未登入' },
        { status: 401 }
      );
    }

    try {
      const decoded = verify(token, JWT_SECRET) as { role: string };
      console.log('Token verified:', decoded);
      
      if (decoded.role !== 'admin') {
        console.log('Insufficient role');
        return NextResponse.json(
          { message: '權限不足' },
          { status: 403 }
        );
      }

      const success = eventOperations.delete(id);
      console.log('Delete result:', success);

      if (!success) {
        console.log('Delete failed');
        return NextResponse.json(
          { message: '刪除失敗' },
          { status: 400 }
        );
      }

      return NextResponse.json({ message: '刪除成功' });
    } catch (error) {
      console.error('Delete event error:', error);
      if (error instanceof Error) {
        return NextResponse.json(
          { message: error.message },
          { status: 400 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error('Delete event error:', error);
    return NextResponse.json(
      { message: '系統錯誤' },
      { status: 500 }
    );
  }
}
