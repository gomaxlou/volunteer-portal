import type { Response } from 'node-fetch';
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('cross-fetch');

interface UploadResponse {
  url?: string;
  error?: string;
}

async function testImageUpload() {
  try {
    // 讀取測試圖片
    const imageBuffer = fs.readFileSync(path.join(__dirname, 'test-image.jpg'));
    
    // 創建 FormData
    const formData = new FormData();
    formData.append('file', imageBuffer, 'test-image.jpg');

    // 設置管理員 token (新生成的 token)
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMyNzk5NTAzLCJleHAiOjE3MzI4ODU5MDN9.mtFxoKH_fqo9bbM5oytT9K6jCK8uLli4cBXTImWvCgY';

    // 發送請求
    const response = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Cookie': `auth-token=${token}`
      }
    }) as Response;

    const result = await response.json() as UploadResponse;
    
    if (response.ok) {
      console.log('上傳成功！');
      console.log('圖片 URL:', result.url);
    } else {
      console.error('上傳失敗:', result.error);
    }
  } catch (error) {
    console.error('測試執行錯誤:', error);
  }
}

testImageUpload();
