import fs from 'fs';
import path from 'path';

const FONT_URLS = {
  regular: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-tc@5.0.7/files/noto-sans-tc-chinese-traditional-400-normal.woff2',
  bold: 'https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-tc@5.0.7/files/noto-sans-tc-chinese-traditional-700-normal.woff2'
};

export const loadFonts = async () => {
  try {
    // 使用 fetch 載入字型檔
    const [normalFontResponse] = await Promise.all([
      fetch('/fonts/NotoSansTC-Regular.ttf')
    ]);

    if (!normalFontResponse.ok) {
      throw new Error('Failed to load fonts');
    }

    // 轉換為 ArrayBuffer
    const normalFont = await normalFontResponse.arrayBuffer();

    return {
      NotoSansTC: {
        normal: normalFont
      }
    };
  } catch (error) {
    console.error('Error loading fonts:', error);
    throw error;
  }
};
