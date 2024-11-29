import fs from 'fs';
import path from 'path';

// 讀取字型檔案並轉換為 base64
function getFontBase64(fontPath: string): string {
  const fontBuffer = fs.readFileSync(fontPath);
  return fontBuffer.toString('base64');
}

// 取得字型檔案的路徑
const fontsPath = path.join(process.cwd(), 'public', 'fonts');

// 讀取並匯出字型
export const notoSansTC = {
  regular: getFontBase64(path.join(fontsPath, 'NotoSansTC-Regular.ttf')),
  bold: getFontBase64(path.join(fontsPath, 'NotoSansTC-Bold.ttf')),
};
