'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { ArrowDownToLine, Search, FileText } from 'lucide-react';
import { loadFonts } from './fonts';

// 固定的 PDF 設置
const pdfSettings = {
  fontSize: {
    title: 20,
    subtitle: 14,
    content: 12
  },
  fonts: {
    NotoSansTC: {
      normal: 'NotoSansTC',
      bold: 'NotoSansTC-Bold',
    }
  }
};

// 定義 Report 類型
interface Report {
  id: number;
  title: string;
  date: string;
  content: string[];
}

// 搜尋功能
const filterReports = (reports: Report[], searchQuery: string = '') => {
  const query = searchQuery?.toLowerCase().trim() || '';
  if (!query) return reports;

  return reports.filter(report => {
    // 搜尋標題
    const titleMatch = report.title.toLowerCase().includes(query);
    
    // 搜尋日期
    const dateMatch = report.date.toLowerCase().includes(query);
    
    // 搜尋內容
    const contentMatch = report.content.some(line => 
      line.toLowerCase().includes(query)
    );

    return titleMatch || dateMatch || contentMatch;
  });
};

// PDF 下載功能
const downloadPDF = async (selectedReport: Report) => {
  try {
    // 動態引入 pdfMake
    const pdfMake = (await import('pdfmake/build/pdfmake')).default;
    
    // 載入字型
    const fonts = await loadFonts();
    
    // 設定字型定義
    const vfs = {
      'NotoSansTC.ttf': fonts.NotoSansTC.normal
    };
    
    const fontDefinitions = {
      NotoSansTC: {
        normal: 'NotoSansTC.ttf',
        bold: 'NotoSansTC.ttf',
        italics: 'NotoSansTC.ttf',
        bolditalics: 'NotoSansTC.ttf'
      }
    };

    // 創建文件定義
    const documentDefinition = {
      content: [
        { 
          text: selectedReport.title, 
          fontSize: pdfSettings.fontSize.title, 
          bold: true, 
          margin: [0, 0, 0, 10]
        },
        { 
          text: selectedReport.date, 
          fontSize: pdfSettings.fontSize.subtitle, 
          margin: [0, 0, 0, 20]
        },
        ...selectedReport.content.map(line => ({
          text: line,
          fontSize: pdfSettings.fontSize.content,
          margin: line.startsWith('    ') ? [30, 2, 0, 2] : [0, 2, 0, 2]
        }))
      ],
      defaultStyle: {
        font: 'NotoSansTC'
      }
    };

    // 生成並下載 PDF
    const pdfDocGenerator = pdfMake.createPdf(documentDefinition, undefined, fontDefinitions, vfs);
    pdfDocGenerator.getBase64((data) => {
      const source = `data:application/pdf;base64,${data}`;
      const link = document.createElement('a');
      link.href = source;
      link.download = `${selectedReport.title}.pdf`;
      link.click();
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('PDF 生成失敗，請稍後再試。');
  }
};

// 模擬團務報告資料
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
      '出席人員：各組組長、幹部共 25 人',
      '',
      '一、主席致詞',
      '    感謝各位同學在新的一年繼續參與志工服務。過去一年，我們完成了許多有意義的服務計畫，',
      '    新的一年，我們將持續擴大服務範圍，為社會貢獻更多心力。',
      '',
      '二、上次會議決議執行報告',
      '    1. 2023年度成果報告彙整完成',
      '    說明：各組皆已完成年度服務成果統整，並製作成果簡報。',
      '    執行情形：已於年度成果發表會中展示，獲得師長肯定。',
      '',
      '    2. 寒假服務隊籌備進度',
      '    說明：三個寒假服務隊之籌備工作。',
      '    執行情形：',
      '      (1) 偏鄉教育服務隊：已完成師資培訓',
      '      (2) 長者關懷服務隊：已完成機構聯繫',
      '      (3) 環境保護服務隊：已完成場地勘查',
      '',
      '三、工作報告',
      '    1. 秘書組工作報告',
      '    報告人：陳小凱 組長',
      '    重點摘要：',
      '      (1) 完成新進志工基本資料建檔，共計 50 人',
      '      (2) 更新志工服務時數統計系統',
      '      (3) 建立線上簽到退系統，預計下月上線',
      '      (4) 完成年度行事曆規劃',
      '',
      '    2. 活動組工作報告',
      '    報告人：張小美 組長',
      '    重點摘要：',
      '      (1) 完成上學期各項活動成果統計',
      '          - 社區服務：20場次，參與志工 180人次',
      '          - 校園服務：15場次，參與志工 120人次',
      '          - 特殊節日活動：5場次，參與志工 150人次',
      '      (2) 規劃寒假服務梯隊',
      '      (3) 籌備春季志工特殊訓練課程',
      '',
      '    3. 公關組工作報告',
      '    報告人：林小山 組長',
      '    重點摘要：',
      '      (1) 完成年度服務成果影片製作',
      '      (2) 社群媒體經營成效',
      '          - Facebook粉絲專頁：追蹤人數增加500人',
      '          - Instagram：貼文互動率提升30%',
      '      (3) 媒體報導：3則新聞報導、2則專題採訪',
      '',
      '四、提案討論',
      '    提案一：擴大招募範圍',
      '    提案人：王小明',
      '    說明：',
      '      1. 目前志工來源主要集中在特定科系',
      '      2. 建議擴大招募範圍至全校各科系',
      '      3. 規劃製作招募文宣及說明會',
      '    決議：通過。',
      '    執行方式：',
      '      1. 由公關組負責文宣設計及宣傳',
      '      2. 預計二月底前完成招募說明會',
      '      3. 各科系至少辦理一場宣傳活動',
      '',
      '    提案二：志工培訓制度修訂',
      '    提案人：李小華',
      '    說明：',
      '      1. 現行培訓制度已實施兩年',
      '      2. 根據志工回饋，擬進行課程調整',
      '      3. 增加實務演練的比重',
      '    決議：修正後通過。',
      '    執行方式：',
      '      1. 基礎訓練維持原課程',
      '      2. 特殊訓練增加實務操作課程',
      '      3. 導入數位學習課程',
      '',
      '    提案三：服務據點擴增計畫',
      '    提案人：陳小凱',
      '    說明：',
      '      1. 現有服務據點：8處',
      '      2. 新增合作單位邀請：3處',
      '      3. 評估服務能量及人力配置',
      '    決議：下次會議續議。',
      '    後續規劃：',
      '      1. 請活動組實地訪查新據點',
      '      2. 評估志工人力調配可行性',
      '      3. 準備細部合作計畫書',
      '',
      '五、臨時動議',
      '    提案一：建立志工獎勵機制',
      '    提案人：張小美',
      '    說明：為鼓勵志工長期投入，建議建立獎勵制度',
      '    決議：請秘書組研擬方案，下次會議討論',
      '',
      '    提案二：強化跨校合作',
      '    提案人：林小山',
      '    說明：建議與鄰近學校志工團體合作',
      '    決議：請公關組評估可行性',
      '',
      '六、散會：17:00',
      '',
      '附件一：2023年度服務成果統計表',
      '    1. 總服務時數：8,750小時',
      '    2. 受服務人次：12,500人次',
      '    3. 志工參與人次：2,800人次',
      '    4. 合作單位：25個',
      '',
      '附件二：2024年度預定活動列表',
      '    1. 寒假服務營隊（1月）',
      '    2. 春季志工特訓（3月）',
      '    3. 社區關懷系列活動（4-5月）',
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
      '時間：2024年2月28日 10:00-12:30',
      '地點：線上會議（MS Teams）',
      '主席：王小明 總召集人',
      '記錄：張小梅',
      '出席人員：各服務隊隊長及幹部共 35 人',
      '',
      '一、主席致詞',
      '    感謝大家在寒假期間的辛勤付出，三個服務隊都圓滿完成任務。',
      '    特別感謝各位在疫情後的首次大規模服務活動中展現的專業與熱忱。',
      '',
      '二、服務成果報告',
      '    1. 偏鄉教育服務隊（新竹縣）',
      '    報告人：李大文 隊長',
      '    服務成果：',
      '      (1) 服務時間：2024/01/22-01/26',
      '      (2) 服務地點：新竹縣尖石鄉某國小',
      '      (3) 參與志工：20人',
      '      (4) 服務對象：國小學童45人',
      '      (5) 課程內容：',
      '          - 課業輔導：國語、數學、英語',
      '          - 藝術課程：繪畫、手工藝',
      '          - 團康活動：益智遊戲、體育活動',
      '      (6) 特殊貢獻：',
      '          - 建立數位學習資源庫',
      '          - 捐贈文具用品及課外讀物',
      '',
      '    2. 長者關懷服務隊（台北市）',
      '    報告人：陳小玲 隊長',
      '    服務成果：',
      '      (1) 服務時間：2024/01/15-01/19',
      '      (2) 服務地點：台北市某社區照顧關懷據點',
      '      (3) 參與志工：15人',
      '      (4) 服務對象：長者60人',
      '      (5) 活動內容：',
      '          - 健康促進：體適能活動、健康講座',
      '          - 心靈關懷：團體活動、懷舊活動',
      '          - 數位教學：智慧型手機使用教學',
      '      (6) 特殊貢獻：',
      '          - 編製長者數位生活手冊',
      '          - 協助建立社區關懷網絡',
      '',
      '    3. 環境保護服務隊（基隆市）',
      '    報告人：林小青 隊長',
      '    服務成果：',
      '      (1) 服務時間：2024/01/29-02/02',
      '      (2) 服務地點：基隆市某海灘及社區',
      '      (3) 參與志工：25人',
      '      (4) 服務內容：',
      '          - 海灘清潔：清理垃圾、分類回收',
      '          - 環境教育：海洋生態講座、減塑工作坊',
      '          - 社區宣導：環保觀念推廣',
      '      (5) 成果統計：',
      '          - 清理垃圾：500公斤',
      '          - 可回收物：200公斤',
      '          - 宣導活動參與人次：300人',
      '',
      '三、檢討與建議',
      '    1. 服務時間安排',
      '    檢討：',
      '      (1) 部分活動與學校寒假起始時間重疊',
      '      (2) 天氣因素影響戶外活動進行',
      '    建議：',
      '      (1) 提前規劃，避開假期首尾',
      '      (2) 準備替代方案因應天候',
      '',
      '    2. 人力資源配置',
      '    檢討：',
      '      (1) 部分時段人力不足',
      '      (2) 專業志工需求未能完全滿足',
      '    建議：',
      '      (1) 建立機動志工支援機制',
      '      (2) 加強跨校合作，引入專業人力',
      '',
      '    3. 物資準備',
      '    檢討：',
      '      (1) 部分教材準備不足',
      '      (2) 緊急醫療用品需要更新',
      '    建議：',
      '      (1) 建立標準物資清單',
      '      (2) 提前一週確認物資',
      '',
      '四、經費使用報告',
      '    1. 總經費支出：NT$ 150,000',
      '    明細：',
      '      (1) 交通費：45,000',
      '      (2) 材料費：35,000',
      '      (3) 餐費：30,000',
      '      (4) 保險費：25,000',
      '      (5) 雜支：15,000',
      '',
      '五、下次服務規劃',
      '    1. 時間：清明節前後',
      '    2. 初步規劃：',
      '      (1) 社區關懷服務',
      '      (2) 環境保護行動',
      '    3. 準備工作：',
      '      (1) 場勘與需求評估',
      '      (2) 志工招募與培訓',
      '      (3) 經費預算編列',
      '',
      '六、臨時動議',
      '    1. 建議增設服務心得分享平台',
      '    提案人：李大文',
      '    說明：方便志工交流服務經驗',
      '    決議：請資訊組評估建置可能性',
      '',
      '    2. 建議製作服務隊制服',
      '    提案人：陳小玲',
      '    說明：增加團隊識別度',
      '    決議：請總務組詢價並提出方案',
      '',
      '七、散會：12:30',
      '',
      '附件一：各隊服務照片連結',
      '附件二：滿意度調查結果',
      '附件三：經費收支明細表'
    ]
  },
  {
    id: 3,
    title: '2024年第二次團務會議',
    date: '2024-03-15',
    content: [
      '時間：2024年3月15日 15:00-17:00',
      '地點：志工服務中心會議室',
      '',
      '一、主席致詞',
      '    春季服務計畫即將開始，請大家做好準備。',
      '',
      '二、工作報告',
      '    1. 新進志工培訓成果',
      '    2. 服務時數統計',
      '    3. 經費使用狀況',
      '',
      '三、討論事項',
      '    提案一：增設線上服務項目',
      '    決議：通過。將規劃線上課輔服務。',
      '',
      '    提案二：志工獎勵制度修訂',
      '    決議：修正後通過。',
      '',
      '四、臨時動議',
      '    建議：增加跨校合作機會',
      '    結論：將進行評估。',
      '',
      '五、散會：17:00'
    ]
  },
  {
    id: 4,
    title: '2024年清明節服務籌備會議',
    date: '2024-03-15',
    content: [
      '時間：2024年3月15日 14:00-16:30',
      '地點：志工服務中心會議室',
      '主席：王小明 總召集人',
      '記錄：林小山',
      '出席人員：各組組長及幹部共 28 人',
      '',
      '一、主席致詞',
      '    春季是我們重要的服務季節，希望能延續寒假服務的成功經驗，',
      '    為社區帶來更多正面影響。',
      '',
      '二、服務計畫報告',
      '    1. 社區關懷服務計畫',
      '    報告人：張小美 活動組長',
      '    計畫內容：',
      '      (1) 服務時間：2024/04/01-04/05',
      '      (2) 服務地點：',
      '          - 台北市某社區活動中心',
      '          - 新北市某安養中心',
      '      (3) 服務對象：',
      '          - 獨居長者：約 50 位',
      '          - 安養院住民：約 80 位',
      '      (4) 活動規劃：',
      '          - 居家關懷訪視',
      '          - 節慶活動籌辦',
      '          - 健康促進課程',
      '          - 生活協助服務',
      '      (5) 人力需求：',
      '          - 關懷訪視組：20人',
      '          - 活動策劃組：15人',
      '          - 行政支援組：10人',
      '',
      '    2. 環境保護行動計畫',
      '    報告人：陳小凱 執行長',
      '    計畫內容：',
      '      (1) 活動時間：2024/04/03-04/04',
      '      (2) 活動地點：大安森林公園',
      '      (3) 活動主題：「綠色清明」環保掃墓推廣',
      '      (4) 具體項目：',
      '          - 環保祭拜宣導',
      '          - 可分解祭品發放',
      '          - 環境清潔維護',
      '      (5) 所需人力：',
      '          - 宣導組：12人',
      '          - 發放組：8人',
      '          - 清潔組：15人',
      '',
      '三、前置作業進度',
      '    1. 行政組報告',
      '    報告人：李小華',
      '    工作進度：',
      '      (1) 已完成：',
      '          - 場地租借申請',
      '          - 保險投保作業',
      '          - 物資清單制定',
      '      (2) 進行中：',
      '          - 志工招募報名',
      '          - 餐點廠商詢價',
      '      (3) 待辦事項：',
      '          - 製作工作手冊',
      '          - 安排志工培訓',
      '',
      '    2. 公關組報告',
      '    報告人：林小山',
      '    工作進度：',
      '      (1) 已完成：',
      '          - 活動海報設計',
      '          - 文宣品製作',
      '      (2) 進行中：',
      '          - 媒體聯繫',
      '          - 社群宣傳',
      '',
      '四、預算規劃',
      '    1. 總預算：NT$ 200,000',
      '    預算分配：',
      '      (1) 活動物資：80,000',
      '      (2) 餐費：40,000',
      '      (3) 交通費：30,000',
      '      (4) 保險費：25,000',
      '      (5) 文宣印刷：15,000',
      '      (6) 雜支：10,000',
      '',
      '五、風險評估',
      '    1. 天候因素',
      '    因應方案：',
      '      (1) 準備雨備方案',
      '      (2) 建立活動調整機制',
      '',
      '    2. 人力調配',
      '    因應方案：',
      '      (1) 建立後補志工機制',
      '      (2) 跨組支援計畫',
      '',
      '六、下一步工作重點',
      '    1. 3/20前完成志工招募',
      '    2. 3/25前完成物資採購',
      '    3. 3/30前完成培訓課程',
      '    4. 4/1前完成場佈規劃',
      '',
      '七、臨時動議',
      '    1. 建議增加志工保險額度',
      '    提案人：張小美',
      '    決議：通過，請行政組評估費用',
      '',
      '    2. 建議製作活動紀錄影片',
      '    提案人：林小山',
      '    決議：通過，請公關組負責',
      '',
      '八、散會：16:30',
      '',
      '附件一：活動企劃書',
      '附件二：預算細項表',
      '附件三：人力配置表'
    ]
  },
  {
    id: 5,
    title: '2024年度志工培訓規劃會議',
    date: '2024-03-20',
    content: [
      '時間：2024年3月20日 09:30-12:00',
      '地點：志工服務中心教室',
      '主席：李小華 培訓組長',
      '記錄：王小青',
      '出席人員：培訓組成員及各組代表共 20 人',
      '',
      '一、主席致詞',
      '    為提升志工服務品質，今年將強化培訓課程的實務導向，',
      '    並加入更多元的學習方式。',
      '',
      '二、年度培訓計畫',
      '    1. 基礎培訓課程',
      '    規劃人：陳小玲',
      '    課程內容：',
      '      (1) 志工服務精神與倫理',
      '      (2) 志願服務法規介紹',
      '      (3) 服務禮儀與態度',
      '      (4) 團隊合作與溝通',
      '    時數：12小時',
      '',
      '    2. 特殊訓練課程',
      '    規劃人：張小梅',
      '    課程內容：',
      '      (1) 長者關懷技巧',
      '          - 溝通技巧',
      '          - 緊急狀況處理',
      '          - 照顧注意事項',
      '      (2) 兒童教育服務',
      '          - 課程設計原則',
      '          - 班級經營技巧',
      '          - 教具製作工作坊',
      '      (3) 環境保護實務',
      '          - 垃圾分類知識',
      '          - 環保議題介紹',
      '          - 永續行動方案',
      '    時數：24小時',
      '',
      '三、培訓方式創新',
      '    1. 實體課程',
      '    負責人：王小青',
      '    規劃重點：',
      '      (1) 採分組討論形式',
      '      (2) 增加實務演練',
      '      (3) 加入角色扮演',
      '',
      '    2. 線上課程',
      '    負責人：林小方',
      '    規劃重點：',
      '      (1) 製作數位課程',
      '      (2) 建立線上測驗',
      '      (3) 討論區互動',
      '',
      '四、講師邀請規劃',
      '    1. 校內講師：',
      '      (1) 社工系教授：3位',
      '      (2) 心理系教授：2位',
      '      (3) 資深志工：5位',
      '',
      '    2. 外聘講師：',
      '      (1) 社福機構主管：2位',
      '      (2) 環保團體代表：2位',
      '      (3) 教育專家：2位',
      '',
      '五、培訓預算',
      '    1. 總預算：NT$ 180,000',
      '    明細：',
      '      (1) 講師費：80,000',
      '      (2) 教材製作：40,000',
      '      (3) 場地費用：25,000',
      '      (4) 餐費：20,000',
      '      (5) 雜支：15,000',
      '',
      '六、培訓時程規劃',
      '    1. 第一梯次（4-5月）',
      '      (1) 基礎訓練：4/15-4/16',
      '      (2) 特殊訓練：4/22-5/13',
      '',
      '    2. 第二梯次（7-8月）',
      '      (1) 基礎訓練：7/10-7/11',
      '      (2) 特殊訓練：7/17-8/7',
      '',
      '七、成效評估方式',
      '    1. 課前評估：',
      '      (1) 需求調查',
      '      (2) 能力檢測',
      '',
      '    2. 課中評估：',
      '      (1) 出席率統計',
      '      (2) 課堂參與度',
      '      (3) 作業完成度',
      '',
      '    3. 課後評估：',
      '      (1) 滿意度調查',
      '      (2) 學習成效測驗',
      '      (3) 實務應用追蹤',
      '',
      '八、臨時動議',
      '    1. 建議增設進階培訓課程',
      '    提案人：陳小玲',
      '    決議：下半年規劃試辦',
      '',
      '    2. 建議製作培訓手冊',
      '    提案人：張小梅',
      '    決議：請培訓組負責編撰',
      '',
      '九、散會：12:00',
      '',
      '附件一：課程大綱',
      '附件二：講師資料',
      '附件三：預算表'
    ]
  }
];

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // 計算每頁顯示的行數
  const calculateLinesPerPage = () => {
    if (!contentRef.current) return 30; // 預設值
    const lineHeight = 24; // 預設行高
    return Math.floor(contentRef.current.clientHeight / lineHeight);
  };

  // 監聽容器高度變化
  useEffect(() => {
    const updateHeight = () => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.clientHeight);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // 過濾後的報告列表
  const filteredReports = filterReports(reports, searchQuery);

  // 分頁邏輯
  const linesPerPage = calculateLinesPerPage();
  const selectedContent = selectedReport?.content || [];
  const totalPages = Math.ceil(selectedContent.length / linesPerPage);
  const startIndex = (currentPage - 1) * linesPerPage;
  const endIndex = startIndex + linesPerPage;
  const currentContent = selectedContent.slice(startIndex, endIndex);

  // 頁面導航
  const handlePageChange = (newPage: number) => {
    setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="搜尋會議記錄（標題、日期或內容）..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
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
                  setCurrentPage(1); // 重置頁碼
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
              {/* 內容標題 */}
              <div className="p-4 border-b">
                <h2 className="text-xl font-bold">{selectedReport.title}</h2>
                <p className="text-gray-600">{selectedReport.date}</p>
              </div>

              {/* 內容區域 */}
              <div 
                ref={contentRef}
                className="flex-1 p-4 overflow-y-auto whitespace-pre-wrap max-h-[calc(100vh-350px)]"
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

              {/* PDF下載按鈕 */}
              <div className="p-4 border-t">
                <button
                  onClick={() => downloadPDF(selectedReport)}
                  className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowDownToLine className="w-4 h-4" />
                  下載 PDF
                </button>
              </div>
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
