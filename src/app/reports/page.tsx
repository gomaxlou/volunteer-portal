'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ArrowDownToLine, Search, FileText } from 'lucide-react';
import dynamic from 'next/dynamic';
import fs from 'fs/promises';
import path from 'path';

// 定義報告類型
interface Report {
  id: number;
  title: string;
  date: string;
  content: string[];
}

// 每頁顯示的行數
const LINES_PER_PAGE = 30;  // 增加每頁行數

// 報告資料
const reports: Report[] = [
  {
    id: 1,
    title: '2024年第一次團務會議',
    date: '2024-01-15',
    content: [
      '時間：2024年1月15日 14:00-17:00',
      '地點：志工服務中心會議室',
      '主席：王小明 總召集人',
      '記錄：李小華',
      '',
      '一、主席致詞',
      '    感謝各位在新的一年開始就撥冗參加團務會議，希望今年我們能夠為社會帶來更多正面的影響。',
      '',
      '二、工作報告',
      '1. 行政組：',
      '    - 完成2023年度成果報告',
      '    - 更新志工資料庫',
      '    - 建立新的線上簽到系統',
      '',
      '2. 活動組：',
      '    - 寒假服務隊籌備進度報告',
      '    - 春節關懷活動規劃',
      '    - 社區服務計畫提案',
      '',
      '3. 培訓組：',
      '    - 新進志工培訓課程規劃',
      '    - 志工進階課程安排',
      '    - 特殊訓練需求評估',
      '',
      '三、提案討論',
      '提案一：擴大招募青年志工計畫',
      '說明：因應服務需求增加，建議擴大招募青年志工。',
      '決議：通過，請培訓組規劃相關培訓課程。',
      '',
      '提案二：建立線上志工管理系統',
      '說明：為提升行政效率，建議建置線上志工管理系統。',
      '決議：通過，請行政組評估系統建置費用並提出具體規劃。',
      '',
      '四、臨時動議',
      '無',
      '',
      '五、2024年重點工作',
      '    1. 寒假服務營隊（1-2月）',
      '    2. 春節關懷活動（2月）',
      '    3. 社區服務計畫（3-6月）',
      '    4. 暑期服務營隊（7-8月）',
      '    5. 校慶系列活動（10月）',
      '    6. 歲末感恩活動（12月）'
    ]
  },
  {
    id: 2,
    title: '2024年寒假服務檢討會議',
    date: '2024-02-28',
    content: [
      '時間：2024年2月28日 10:00-12:00',
      '地點：線上會議室',
      '主席：張副召集人',
      '記錄：王小美',
      '',
      '一、服務成果報告',
      '1. 服務時數統計：',
      '    - 總服務時數：520小時',
      '    - 參與志工人數：35人',
      '    - 受服務人數：150人',
      '',
      '2. 活動內容檢討：',
      '    - 課業輔導：成效良好，學生反應積極',
      '    - 藝術課程：材料準備充足，活動順利',
      '    - 戶外活動：因天候因素有部分調整',
      '',
      '3. 經費使用狀況：',
      '    - 預算執行率：95%',
      '    - 結餘款處理方式：轉入下次活動基金',
      '',
      '二、檢討與建議',
      '1. 優點：',
      '    - 志工分組合作良好',
      '    - 活動規劃完善',
      '    - 時間掌控準確',
      '',
      '2. 待改進事項：',
      '    - 建議增加雨備方案',
      '    - 加強跨組別溝通',
      '    - 器材準備可再提前',
      '',
      '三、結論',
      '1. 修訂活動手冊，增加應變計畫',
      '2. 建立器材清單標準化程序',
      '3. 加強志工培訓課程'
    ]
  }
];

// 將內容分頁
const splitContentIntoPages = (content: string[], linesPerPage: number) => {
  const pages = [];
  let currentPage = [];
  
  for (const line of content) {
    currentPage.push(line);
    if (currentPage.length >= linesPerPage) {
      pages.push([...currentPage]);
      currentPage = [];
    }
  }
  
  if (currentPage.length > 0) {
    pages.push(currentPage);
  }
  
  return pages;
};

// PDF 下載功能
const downloadPDF = async (report: Report) => {
  try {
    // 動態引入所需模組
    const { jsPDF } = await import('jspdf');
    const html2canvas = (await import('html2canvas')).default;

    // 創建臨時 DOM 元素
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.width = '595px';  // A4 寬度
    tempDiv.style.fontFamily = '"Noto Sans TC", sans-serif';

    // 構建內容
    let htmlContent = `
      <div style="padding: 20px 30px; width: 100%;">
        <h1 style="font-size: 18px; text-align: center; margin-bottom: 12px;">${report.title}</h1>
        <p style="font-size: 14px; margin-bottom: 16px;">日期：${report.date}</p>
        <div style="font-size: 14px; line-height: 1.4;">
    `;

    // 處理內容
    report.content.forEach(line => {
      if (/^\d+\.\s/.test(line)) {
        // 標題
        htmlContent += `<h2 style="font-size: 14px; font-weight: bold; margin: 12px 0 8px 0;">${line}</h2>`;
      } else if (line.startsWith('-')) {
        // 子項目
        htmlContent += `<p style="margin: 4px 0 4px 16px;">${line}</p>`;
      } else {
        // 普通文本
        htmlContent += `<p style="margin: 4px 0;">${line}</p>`;
      }
    });

    htmlContent += '</div></div>';
    tempDiv.innerHTML = htmlContent;
    document.body.appendChild(tempDiv);

    // 將 HTML 轉換為 canvas
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      windowWidth: 595,
      windowHeight: tempDiv.offsetHeight
    });

    // 移除臨時元素
    document.body.removeChild(tempDiv);

    // 創建 PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });

    // 計算頁面數量
    const pageHeight = 842;
    const imgWidth = 595;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // 添加第一頁
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.8), 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // 添加其餘頁面
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.8), 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // 下載 PDF
    pdf.save(`${report.title}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('PDF 生成失敗，請稍後再試。');
  }
};

// 主頁面組件
export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const contentRef = useRef<HTMLDivElement>(null);

  // 搜尋功能
  const filteredReports = reports.filter(report => {
    const query = searchQuery.toLowerCase();
    return (
      report.title.toLowerCase().includes(query) ||
      report.date.toLowerCase().includes(query) ||
      report.content.some(line => line.toLowerCase().includes(query))
    );
  });

  // 計算總頁數
  const totalPages = selectedReport
    ? Math.ceil(selectedReport.content.length / LINES_PER_PAGE)
    : 0;

  // 計算當前頁面應該顯示的內容
  const startIndex = (currentPage - 1) * LINES_PER_PAGE;
  const currentContent = selectedReport
    ? selectedReport.content.slice(startIndex, startIndex + LINES_PER_PAGE)
    : [];

  // 處理頁面變更
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      contentRef.current?.scrollTo(0, 0);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">團務報告</h1>
      
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="搜尋會議記錄（標題、日期或內容）..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 左側列表 */}
        <div className="bg-white rounded-lg shadow p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <div
                key={report.id}
                className={`p-4 mb-2 rounded-lg cursor-pointer transition-colors ${
                  selectedReport?.id === report.id
                    ? 'bg-green-100 border-2 border-green-500'
                    : 'bg-gray-50 hover:bg-green-50'
                }`}
                onClick={() => {
                  setSelectedReport(report);
                  setCurrentPage(1);
                }}
              >
                <h3 className="font-semibold text-lg">{report.title}</h3>
                <p className="text-gray-600">{report.date}</p>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p>沒有找到符合的會議記錄</p>
            </div>
          )}
        </div>

        {/* 右側內容 */}
        <div className="bg-white rounded-lg shadow">
          {selectedReport ? (
            <div className="h-full flex flex-col">
              {/* 內容標題和下載按鈕 */}
              <div className="p-4 border-b flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">{selectedReport.title}</h2>
                  <p className="text-gray-600">{selectedReport.date}</p>
                </div>
                <button
                  onClick={() => downloadPDF(selectedReport)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  <ArrowDownToLine className="w-4 h-4" />
                  下載 PDF
                </button>
              </div>

              {/* 內容區域 */}
              <div 
                ref={contentRef}
                className="flex-1 p-4 overflow-y-hidden whitespace-pre-wrap max-h-[calc(100vh-350px)]"
              >
                {currentContent.map((line, index) => (
                  <div key={startIndex + index} className="mb-1">
                    {line}
                  </div>
                ))}
              </div>

              {/* 分頁控制 */}
              {totalPages > 1 && (
                <div className="p-4 border-t flex items-center justify-between bg-gray-50">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg bg-green-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
                  >
                    上一頁
                  </button>
                  <span className="text-gray-600">
                    第 {currentPage} 頁，共 {totalPages} 頁
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg bg-green-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
                  >
                    下一頁
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>請選擇一個會議記錄查看內容</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
