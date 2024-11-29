const fs = require('fs');
const path = require('path');

// 讀取字型檔案
const regularFont = fs.readFileSync(path.join(process.cwd(), 'public', 'fonts', 'NotoSansTC-Regular.ttf'));
const boldFont = fs.readFileSync(path.join(process.cwd(), 'public', 'fonts', 'NotoSansTC-Bold.ttf'));

// 導出字型數據
module.exports = {
  NotoSansTC: {
    normal: regularFont,
    bold: boldFont
  }
};
