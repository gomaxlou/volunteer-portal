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
        title: '社區老人關懷活動',
        startDate: '2024-02-05 09:00',
        endDate: '2024-02-05 16:00',
        location: '台北市萬華區',
        description: '探訪社區獨居老人，陪伴聊天並提供生活協助。',
        image: '/images/volunteer1.jpg',
        participants: 12,
        maxParticipants: 20,
        registrationDeadline: '2024-02-03 23:59',
        projectManager: {
          name: '王小明',
          title: '社區關懷組組長',
          phone: '0912-345-678',
          email: 'wang.pm@volunteer.org',
          line: 'wang_care'
        },
        details: {
          schedule: [
            '09:30 - 報到與活動說明',
            '10:00 - 開始探訪',
            '12:00 - 午餐休息',
            '13:00 - 繼續探訪',
            '15:30 - 回報與檢討',
            '16:00 - 活動結束'
          ],
          requirements: [
            '具備基本溝通能力',
            '有耐心且善於傾聽',
            '能全程參與活動',
            '守時'
          ],
          benefits: [
            '志工時數證明',
            '午餐提供',
            '交通補助',
            '志工保險'
          ],
          contact: {
            name: '王小明',
            phone: '0912-345-678',
            email: 'wang.pm@volunteer.org'
          },
          meetingPoint: '萬華區公所一樓大廳',
          items: [
            '個人證件',
            '環保餐具',
            '口罩',
            '健保卡'
          ],
          notes: [
            '請準時報到',
            '如有身體不適請提前告知'
          ],
          transportation: [
            '捷運：板南線龍山寺站2號出口，步行約8分鐘',
            '公車：和平院區站，步行約3分鐘'
          ],
          difficulty: '簡單',
          category: '社區服務',
          duration: '7小時',
          targetAudience: [
            '18歲以上',
            '對老人關懷有興趣者',
            '具備基本溝通能力者'
          ]
        }
      },
      {
        id: 'event-2',
        title: '淨灘環保活動',
        startDate: '2024-02-10 08:00',
        endDate: '2024-02-10 12:00',
        location: '新北市八里區觀海廣場',
        description: '一起來守護海洋生態！透過淨灘活動，我們不僅能清潔海灘，還能提升環保意識。',
        image: '/images/volunteer2.jpg',
        participants: 25,
        maxParticipants: 50,
        registrationDeadline: '2024-02-08 23:59',
        projectManager: {
          name: '李美玲',
          title: '環保行動組組長',
          phone: '0923-456-789',
          email: 'lee.ml@volunteer.org',
          line: 'lee_beach'
        },
        details: {
          schedule: [
            '08:00 - 集合報到',
            '08:30 - 活動說明與分組',
            '09:00 - 開始淨灘',
            '11:00 - 垃圾分類與統計',
            '11:30 - 經驗分享',
            '12:00 - 活動結束'
          ],
          requirements: [
            '12歲以上皆可參加',
            '穿著適合戶外活動的服裝',
            '具備基本體力'
          ],
          benefits: [
            '志工時數證明',
            '環保紀念品',
            '飲用水',
            '志工保險'
          ],
          contact: {
            name: '李美玲',
            phone: '0923-456-789',
            email: 'lee.ml@volunteer.org'
          },
          meetingPoint: '八里觀海廣場入口',
          items: [
            '防曬用品',
            '帽子',
            '環保水壺',
            '換洗衣物'
          ],
          notes: [
            '活動將視天氣狀況調整',
            '建議攜帶防曬用品'
          ],
          transportation: [
            '公車：紅13、紅22至八里觀海廣場站',
            '開車：觀海廣場停車場'
          ],
          difficulty: '中等',
          category: '環境保護',
          duration: '4小時',
          targetAudience: [
            '12歲以上',
            '對環境保護有興趣者',
            '可進行戶外活動者'
          ]
        }
      },
      {
        id: 'event-3',
        title: '兒童課後輔導',
        startDate: '2024-02-15 14:00',
        endDate: '2024-02-15 17:00',
        location: '台北市文山區興隆社區',
        description: '為弱勢家庭孩童提供課後輔導，協助完成課業並建立學習興趣。',
        image: '/images/volunteer3.jpg',
        participants: 8,
        maxParticipants: 15,
        registrationDeadline: '2024-02-13 23:59',
        projectManager: {
          name: '陳志明',
          title: '教育關懷組組長',
          phone: '0934-567-890',
          email: 'chen.zm@volunteer.org',
          line: 'chen_edu'
        },
        details: {
          schedule: [
            '14:00 - 志工報到',
            '14:15 - 今日課程說明',
            '14:30 - 開始輔導',
            '16:00 - 休息與點心時間',
            '16:15 - 繼續輔導',
            '17:00 - 活動結束'
          ],
          requirements: [
            '具備國中以上程度',
            '有耐心',
            '喜歡與孩童互動',
            '至少能配合一個月'
          ],
          benefits: [
            '志工時數證明',
            '教學經驗',
            '點心提供',
            '志工保險'
          ],
          contact: {
            name: '陳志明',
            phone: '0934-567-890',
            email: 'chen.zm@volunteer.org'
          },
          meetingPoint: '興隆社區活動中心',
          items: [
            '文具用品',
            '教材',
            '口罩'
          ],
          notes: [
            '請提前準備教材',
            '如有特殊狀況請提前告知'
          ],
          transportation: [
            '捷運：文湖線萬芳醫院站，轉搭公車',
            '公車：251、253至興隆市場站'
          ],
          difficulty: '中等',
          category: '教育服務',
          duration: '3小時',
          targetAudience: [
            '大學生以上',
            '對教育有熱忱者',
            '具備基本科目知識者'
          ]
        }
      }
    ];
    writeEvents(defaultEvents);
  }
}
