import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';

// 創建一個 300x200 的測試圖片
const width = 300;
const height = 200;
const canvas = createCanvas(width, height);
const context = canvas.getContext('2d');

// 設置背景色
context.fillStyle = '#f0f0f0';
context.fillRect(0, 0, width, height);

// 畫一些圖形
context.fillStyle = '#ff0000';
context.fillRect(50, 50, 100, 100);

context.fillStyle = '#0000ff';
context.beginPath();
context.arc(200, 100, 50, 0, Math.PI * 2);
context.fill();

// 添加文字
context.fillStyle = '#000000';
context.font = '20px Arial';
context.fillText('Test Image', 100, 180);

// 將圖片保存為文件
const buffer = canvas.toBuffer('image/jpeg');
fs.writeFileSync(path.join(__dirname, 'test-image.jpg'), buffer);

console.log('測試圖片已創建：test-image.jpg');
