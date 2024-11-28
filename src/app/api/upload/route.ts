import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { checkAuth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await checkAuth()
    if (!user) {
      return NextResponse.json(
        { error: '請先登入' },
        { status: 401 }
      )
    }

    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json(
        { error: '請選擇檔案' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: '只能上傳圖片檔案' },
        { status: 400 }
      )
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: '檔案大小不能超過 2MB' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `event-${timestamp}-${file.name}`
    const path = join(process.cwd(), 'public/images/events', filename)

    // Save file
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
