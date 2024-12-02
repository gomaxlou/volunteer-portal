import { NextRequest, NextResponse } from 'next/server';
import { createCanvas } from 'canvas';

// 定義顏色主題
const themes = {
  education: {
    background: '#4C51BF', // Indigo
    text: '#FFFFFF',
  },
  environment: {
    background: '#2F855A', // Green
    text: '#FFFFFF',
  },
  elderly: {
    background: '#B7791F', // Yellow
    text: '#FFFFFF',
  },
  default: {
    background: '#4A5568', // Gray
    text: '#FFFFFF',
  },
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category') || 'default';
  const text = searchParams.get('text') || 'Placeholder Image';
  const width = parseInt(searchParams.get('width') || '800');
  const height = parseInt(searchParams.get('height') || '600');

  // 創建 canvas
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // 獲取主題顏色
  const theme = themes[category as keyof typeof themes] || themes.default;

  // 設置背景
  ctx.fillStyle = theme.background;
  ctx.fillRect(0, 0, width, height);

  // 添加網格圖案
  ctx.strokeStyle = `${theme.text}22`;
  ctx.lineWidth = 2;
  const gridSize = 30;
  
  for (let x = 0; x <= width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  
  for (let y = 0; y <= height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // 添加文字
  ctx.fillStyle = theme.text;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // 計算合適的字體大小
  const fontSize = Math.min(width, height) * 0.1;
  ctx.font = `bold ${fontSize}px Arial`;
  
  // 繪製主要文字
  ctx.fillText(text, width / 2, height / 2);

  // 添加尺寸資訊
  const sizeText = `${width}x${height}`;
  ctx.font = `${fontSize * 0.4}px Arial`;
  ctx.fillText(sizeText, width / 2, height * 0.75);

  // 轉換為 buffer
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });

  // 返回圖片
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
