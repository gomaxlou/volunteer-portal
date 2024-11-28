import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { verify } from 'jsonwebtoken'

// 新增活動圖片
export async function POST(request: NextRequest) {
  try {
    // 驗證用戶是否為管理員
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: '未登入' },
        { status: 401 }
      );
    }

    try {
      const decoded = verify(token, process.env.JWT_SECRET || 'your-secret-key') as { 
        id: number;
        role: string;
      };
      
      if (decoded.role !== 'admin') {
        return NextResponse.json(
          { error: '權限不足' },
          { status: 403 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { error: '登入已過期' },
        { status: 401 }
      );
    }

    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json(
        { error: '請選擇檔案' },
        { status: 400 }
      )
    }

    // 驗證檔案類型
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: '只能上傳圖片檔案' },
        { status: 400 }
      )
    }

    // 驗證檔案大小 (2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: '檔案大小不能超過 2MB' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 確保目錄存在
    const uploadDir = join(process.cwd(), 'public/images/events')
    try {
      await writeFile(join(uploadDir, '.keep'), '')
    } catch (error) {
      // 忽略錯誤，目錄可能已存在
    }

    // 生成唯一檔名
    const timestamp = Date.now()
    const filename = `event-${timestamp}-${file.name}`
    const path = join(uploadDir, filename)

    // 儲存檔案
    await writeFile(path, buffer)

    return NextResponse.json({
      url: `/images/events/${filename}`
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: '上傳失敗' },
      { status: 500 }
    )
  }
}
