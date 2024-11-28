import fs from 'fs';
import path from 'path';
import { Event } from '@/lib/mock-data';

// 使用絕對路徑
const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'events.json');

// 確保資料目錄存在
const dataDir = path.dirname(DATA_FILE_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 確保資料文件存在
if (!fs.existsSync(DATA_FILE_PATH)) {
  fs.writeFileSync(DATA_FILE_PATH, JSON.stringify({ events: [] }, null, 2), 'utf8');
}

export function readEvents(): Event[] {
  try {
    const rawData = fs.readFileSync(DATA_FILE_PATH, 'utf8');
    const data = JSON.parse(rawData);
    return data.events;
  } catch (error) {
    console.error('Error reading events:', error);
    return [];
  }
}

export function writeEvents(events: Event[]): void {
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify({ events }, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing events:', error);
  }
}

// 初始化預設資料
export function initializeDefaultData() {
  const events = readEvents();
  if (events.length === 0) {
    const defaultEvents = [
      {
        id: 'event-1',
        title: '都會區淨灘環保行動',
        startDate: '2024-03-15 08:00',
        endDate: '2024-03-15 12:00',
        location: '新北市八里區觀海廣場',
        description: '邀請您一同參與海洋環境保護行動！活動包含專業環保講師指導、淨灘行動、垃圾分類教學，以及海洋生態介紹。',
        image: '/images/beach-cleanup.jpg',
        participants: 0,
        maxParticipants: 30,
        registrationDeadline: '2024-03-13 23:59',
        projectManagerName: '李美玲',
        projectManagerTitle: '環保行動組組長',
        projectManagerEmail: 'mei.li@eco.org.tw',
        projectManagerPhone: '0923-456-789',
        projectManagerLine: 'eco_mei',
        category: '環境保護',
        difficulty: '簡單',
        requirements: JSON.stringify([
          '年滿15歲',
          '身體狀況良好',
          '具備環保意識'
        ]),
        benefits: JSON.stringify([
          '環保講師專業指導',
          '環保行動證書',
          '保險',
          '飲用水'
        ]),
        items: JSON.stringify([
          '防曬用品',
          '帽子',
          '環保餐具',
          '換洗衣物'
        ]),
        notes: JSON.stringify([
          '請穿著輕便服裝',
          '建議攜帶防曬用品',
          '活動將依天候調整'
        ]),
        transportation: JSON.stringify([
          '捷運：淡水線至淡水站轉乘紅13公車',
          '開車：國道一號五股交流道下轉省道台15線'
        ]),
        meetingPoint: '八里區觀海廣場入口',
        schedule: JSON.stringify([
          '08:00 - 報到集合',
          '08:15 - 活動說明',
          '08:30 - 環保講師專題',
          '09:00 - 開始淨灘',
          '10:30 - 休息時間',
          '11:00 - 垃圾分類教學',
          '11:30 - 成果分享',
          '12:00 - 活動結束'
        ]),
        status: 'published'
      },
      {
        id: 'event-2',
        title: '偏鄉教育志工計畫',
        startDate: '2024-04-01 08:00',
        endDate: '2024-04-05 17:00',
        location: '台東縣達仁鄉',
        description: '五天四夜的偏鄉教育服務，包含課業輔導、藝術教學、文化交流等活動。讓我們一起為偏鄉教育盡一份心力！',
        image: '/images/education.jpg',
        participants: 0,
        maxParticipants: 15,
        registrationDeadline: '2024-03-20 23:59',
        projectManagerName: '張文華',
        projectManagerTitle: '教育計畫主任',
        projectManagerEmail: 'edu.chang@teach.org.tw',
        projectManagerPhone: '0912-345-678',
        projectManagerLine: 'edu_chang',
        category: '教育服務',
        difficulty: '中等',
        requirements: JSON.stringify([
          '年滿18歲',
          '具教學熱忱',
          '能配合全程時間',
          '具備基本課業輔導能力'
        ]),
        benefits: JSON.stringify([
          '志工服務證書',
          '住宿安排',
          '保險',
          '三餐提供'
        ]),
        items: JSON.stringify([
          '個人盥洗用品',
          '換洗衣物',
          '教材教具',
          '筆電（選配）'
        ]),
        notes: JSON.stringify([
          '請攜帶個人藥品',
          '尊重當地文化',
          '保持良好服務態度'
        ]),
        transportation: JSON.stringify([
          '統一從台北火車站集合出發',
          '搭乘專車前往目的地'
        ]),
        meetingPoint: '台北火車站東三門',
        schedule: JSON.stringify([
          '第一天',
          '08:00 - 台北集合出發',
          '15:00 - 抵達安置',
          '16:00 - 環境介紹',
          '17:00 - 教學準備',
          '第二天至第四天',
          '08:00 - 晨間會議',
          '09:00 - 上午課程',
          '12:00 - 午餐休息',
          '14:00 - 下午課程',
          '16:00 - 課後活動',
          '第五天',
          '08:00 - 收拾整理',
          '09:00 - 歡送會',
          '10:00 - 啟程返回',
          '17:00 - 抵達台北'
        ]),
        status: 'published'
      },
      {
        id: 'event-3',
        title: '社區長者關懷計畫',
        startDate: '2024-03-20 09:00',
        endDate: '2024-03-20 16:00',
        location: '台北市萬華區',
        description: '一日社區服務，探訪獨居長者，提供生活關懷與陪伴。活動包含居家關懷、生活協助、健康檢測等服務。',
        image: '/images/elderly-care.jpg',
        participants: 0,
        maxParticipants: 20,
        registrationDeadline: '2024-03-18 23:59',
        projectManagerName: '王小明',
        projectManagerTitle: '社區服務組長',
        projectManagerEmail: 'wang.sm@community.org.tw',
        projectManagerPhone: '0934-567-890',
        projectManagerLine: 'wang_care',
        category: '社區服務',
        difficulty: '簡單',
        requirements: JSON.stringify([
          '年滿16歲',
          '具備基本溝通能力',
          '有耐心及同理心'
        ]),
        benefits: JSON.stringify([
          '志工服務證書',
          '午餐提供',
          '保險'
        ]),
        items: JSON.stringify([
          '口罩',
          '防疫用品',
          '服務手冊'
        ]),
        notes: JSON.stringify([
          '請準時報到',
          '注意個人衛生',
          '保持親切服務態度'
        ]),
        transportation: JSON.stringify([
          '捷運：板南線龍山寺站',
          '公車：251、49路'
        ]),
        meetingPoint: '萬華區老人服務中心',
        schedule: JSON.stringify([
          '09:00 - 報到與講習',
          '10:00 - 分組與行前說明',
          '10:30 - 開始訪視服務',
          '12:00 - 午餐休息',
          '13:30 - 下午場訪視',
          '15:30 - 心得分享',
          '16:00 - 活動結束'
        ]),
        status: 'published'
      },
      {
        id: 'event-4',
        title: '山區步道維護工作',
        startDate: '2024-04-15 07:00',
        endDate: '2024-04-15 15:00',
        location: '新北市汐止區姜子寮步道',
        description: '協助維護山區步道，包含步道修繕、環境維護、指示牌更新等工作。一起為維護登山環境盡一份心力！',
        image: '/images/trail-maintenance.jpg',
        participants: 0,
        maxParticipants: 25,
        registrationDeadline: '2024-04-13 23:59',
        projectManagerName: '陳大山',
        projectManagerTitle: '步道維護專員',
        projectManagerEmail: 'chen.ds@trail.org.tw',
        projectManagerPhone: '0945-678-901',
        projectManagerLine: 'trail_chen',
        category: '環境維護',
        difficulty: '中等',
        requirements: JSON.stringify([
          '年滿18歲',
          '具備基本體能',
          '能適應戶外工作'
        ]),
        benefits: JSON.stringify([
          '志工服務證書',
          '工作手套',
          '午餐便當',
          '保險'
        ]),
        items: JSON.stringify([
          '登山鞋',
          '防曬用品',
          '雨具',
          '水壺'
        ]),
        notes: JSON.stringify([
          '請穿著適合戶外活動的服裝',
          '活動會依天候調整',
          '請評估自身體能狀況'
        ]),
        transportation: JSON.stringify([
          '搭乘公車：藍25至姜子寮站',
          '自行開車：汐止區公所停車場集合'
        ]),
        meetingPoint: '汐止區公所停車場',
        schedule: JSON.stringify([
          '07:00 - 集合報到',
          '07:30 - 工具發放與說明',
          '08:00 - 上山開始工作',
          '10:00 - 休息補水',
          '12:00 - 午餐時間',
          '13:00 - 下午場工作',
          '14:30 - 整理收拾',
          '15:00 - 賦歸'
        ]),
        status: 'published'
      },
      {
        id: 'event-5',
        title: '食物銀行物資整理',
        startDate: '2024-03-25 13:00',
        endDate: '2024-03-25 17:00',
        location: '台北市信義區',
        description: '協助食物銀行進行物資整理、分類、包裝等工作，幫助物資能更有效地發放給需要的家庭。',
        image: '/images/food-bank.jpg',
        participants: 0,
        maxParticipants: 15,
        registrationDeadline: '2024-03-23 23:59',
        projectManagerName: '林小琪',
        projectManagerTitle: '物資管理組長',
        projectManagerEmail: 'lin.sq@foodbank.org.tw',
        projectManagerPhone: '0956-789-012',
        projectManagerLine: 'foodbank_lin',
        category: '物資服務',
        difficulty: '簡單',
        requirements: JSON.stringify([
          '年滿16歲',
          '能搬運物品',
          '細心負責'
        ]),
        benefits: JSON.stringify([
          '志工服務證書',
          '飲料點心',
          '保險'
        ]),
        items: JSON.stringify([
          '口罩',
          '好穿的鞋子',
          '環保杯'
        ]),
        notes: JSON.stringify([
          '請穿著輕便服裝',
          '避免配戴飾品',
          '注意個人衛生'
        ]),
        transportation: JSON.stringify([
          '捷運：板南線市政府站',
          '公車：1、20、37路'
        ]),
        meetingPoint: '信義區食物銀行',
        schedule: JSON.stringify([
          '13:00 - 報到',
          '13:15 - 工作說明',
          '13:30 - 開始物資整理',
          '15:00 - 休息時間',
          '15:15 - 繼續整理工作',
          '16:45 - 環境整理',
          '17:00 - 活動結束'
        ]),
        status: 'published'
      }
    ];

    writeEvents(defaultEvents);
  }
}
