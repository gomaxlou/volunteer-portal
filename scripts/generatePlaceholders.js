import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 獲取 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 確保目錄存在
const placeholderDir = path.join(__dirname, '../public/images/placeholder');
if (!fs.existsSync(placeholderDir)) {
  fs.mkdirSync(placeholderDir, { recursive: true });
}

// 定義顏色主題
const themes = {
  education: {
    background: '#4C51BF',
    text: '#FFFFFF',
    images: [
      { name: 'education-1.jpg', text: '科學實驗' },
      { name: 'education-2.jpg', text: '藝術創作' },
      { name: 'education-3.jpg', text: '團體活動' },
      { name: 'education-4.jpg', text: '戶外探索' }
    ]
  },
  environment: {
    background: '#2F855A',
    text: '#FFFFFF',
    images: [
      { name: 'environment-1.jpg', text: '清理垃圾' },
      { name: 'environment-2.jpg', text: '分類回收' },
      { name: 'environment-3.jpg', text: '生態講座' },
      { name: 'environment-4.jpg', text: '團體合照' }
    ]
  },
  elderly: {
    background: '#B7791F',
    text: '#FFFFFF',
    images: [
      { name: 'elderly-1.jpg', text: '長者關懷' }
    ]
  }
};

function generateImage(category, imageInfo, width = 800, height = 600) {
  const theme = themes[category];
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

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
  ctx.fillText(imageInfo.text, width / 2, height / 2);

  // 添加類別資訊
  const categoryText = `${category.charAt(0).toUpperCase() + category.slice(1)} 活動`;
  ctx.font = `${fontSize * 0.4}px Arial`;
  ctx.fillText(categoryText, width / 2, height * 0.75);

  // 添加尺寸資訊
  const sizeText = `${width}x${height}`;
  ctx.font = `${fontSize * 0.3}px Arial`;
  ctx.fillText(sizeText, width / 2, height * 0.85);

  // 保存圖片
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
  const filePath = path.join(placeholderDir, imageInfo.name);
  fs.writeFileSync(filePath, buffer);
  console.log(`Generated: ${imageInfo.name}`);
}

// 生成所有圖片
Object.entries(themes).forEach(([category, theme]) => {
  theme.images.forEach(imageInfo => {
    generateImage(category, imageInfo);
  });
});

console.log('All placeholder images have been generated!');
