export function generatePlaceholderDataUrl(
  text: string,
  width: number = 800,
  height: number = 400,
  backgroundColor: string = '#48bb78'
): string {
  // 創建 canvas 元素
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return '';

  // 設置背景
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  // 添加紋理效果
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  for (let i = 0; i < height; i += 20) {
    ctx.fillRect(0, i, width, 10);
  }

  // 設置文字樣式
  ctx.fillStyle = 'white';
  ctx.font = 'bold 24px Microsoft JhengHei';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // 繪製文字
  ctx.fillText(text, width / 2, height / 2);

  // 返回 data URL
  return canvas.toDataURL('image/jpeg', 0.8);
}

// 預設圖片列表
export const defaultImages = {
  volunteerTraining: [
    generatePlaceholderDataUrl('志工培訓照片 1', 800, 400, '#48bb78'),
    generatePlaceholderDataUrl('志工培訓照片 2', 800, 400, '#38a169'),
    generatePlaceholderDataUrl('志工培訓照片 3', 800, 400, '#2f855a')
  ],
  ruralEducation: [
    generatePlaceholderDataUrl('偏鄉教育照片 1', 800, 400, '#4299e1'),
    generatePlaceholderDataUrl('偏鄉教育照片 2', 800, 400, '#3182ce'),
    generatePlaceholderDataUrl('偏鄉教育照片 3', 800, 400, '#2b6cb0')
  ],
  beachCleanup: [
    generatePlaceholderDataUrl('淨灘活動照片 1', 800, 400, '#ed8936'),
    generatePlaceholderDataUrl('淨灘活動照片 2', 800, 400, '#dd6b20'),
    generatePlaceholderDataUrl('淨灘活動照片 3', 800, 400, '#c05621')
  ]
};
