import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_FILE_PATH = join(dirname(__dirname), 'src', 'data', 'events.json');

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
      meetingPoint: '八里區觀海廣場入口',
      items: [
        '防曬用品',
        '帽子',
        '手套',
        '環保餐具',
        '個人證件'
      ],
      notes: [
        '請穿著輕便服裝',
        '建議攜帶防曬用品',
        '如遇雨天將改期舉行'
      ],
      transportation: [
        '公車：台北市-八里線，觀海廣場站下車',
        '開車：有附近停車場可停放'
      ],
      difficulty: '中等',
      category: '環境保護',
      duration: '4小時',
      targetAudience: [
        '12歲以上',
        '對環境保護有興趣者',
        '能進行戶外活動者'
      ]
    }
  },
  {
    id: 'trip-1',
    title: '合歡山淨山健行活動',
    startDate: '2024-03-15 06:00',
    endDate: '2024-03-16 18:00',
    location: '南投縣合歡山',
    description: '兩天一夜的淨山健行活動，一邊欣賞高山美景，一邊為環境盡一份心力。',
    image: '/images/trip1.jpg',
    participants: 8,
    maxParticipants: 20,
    registrationDeadline: '2024-03-01 23:59',
    projectManager: {
      name: '陳大山',
      title: '山林保育組組長',
      phone: '0934-567-890',
      email: 'chen.ds@volunteer.org',
      line: 'mountain_keeper'
    },
    details: {
      schedule: [
        '第一天',
        '06:00 - 台北集合出發',
        '10:00 - 抵達合歡山遊客中心',
        '10:30 - 行前說明與裝備檢查',
        '11:00 - 開始淨山健行活動',
        '12:30 - 午餐休息',
        '13:30 - 繼續淨山與生態導覽',
        '16:30 - 入住山莊',
        '18:00 - 晚餐',
        '19:00 - 星空觀賞（若天氣許可）',
        '第二天',
        '05:00 - 觀賞日出',
        '07:00 - 早餐',
        '08:00 - 繼續淨山活動',
        '12:00 - 午餐',
        '13:00 - 環境教育分享',
        '14:00 - 打包準備下山',
        '18:00 - 返回台北'
      ],
      requirements: [
        '18歲以上',
        '具備基本體能',
        '能適應高海拔環境',
        '需有登山經驗',
        '無重大疾病'
      ],
      benefits: [
        '志工服務時數證明',
        '交通接送',
        '保險',
        '三餐提供',
        '住宿安排',
        '紀念T恤'
      ],
      contact: {
        name: '陳大山',
        phone: '0934-567-890',
        email: 'chen.ds@volunteer.org'
      },
      meetingPoint: '台北車站東三門',
      items: [
        '個人證件',
        '保暖衣物',
        '雨具',
        '手套',
        '頭燈',
        '水壺',
        '防曬用品',
        '個人藥品'
      ],
      notes: [
        '請務必攜帶保暖衣物',
        '活動依天氣狀況調整',
        '若身體不適請立即告知領隊',
        '請遵從領隊指示行動'
      ],
      transportation: [
        '統一由台北車站集合出發',
        '搭乘保險合格遊覽車'
      ],
      difficulty: '中高級',
      category: '環境保護',
      duration: '2天1夜',
      targetAudience: [
        '對山林保育有興趣者',
        '具備登山經驗者',
        '身體狀況良好者'
      ]
    }
  },
  {
    id: 'trip-2',
    title: '蘭嶼海洋生態探索之旅',
    startDate: '2024-04-20 08:00',
    endDate: '2024-04-22 17:00',
    location: '台東縣蘭嶼',
    description: '三天兩夜的海洋生態探索，了解當地文化，協助海洋環境調查與保育。',
    image: '/images/trip2.jpg',
    participants: 5,
    maxParticipants: 15,
    registrationDeadline: '2024-04-05 23:59',
    projectManager: {
      name: '林海洋',
      title: '海洋保育專員',
      phone: '0945-678-901',
      email: 'lin.hy@volunteer.org',
      line: 'ocean_guardian'
    },
    details: {
      schedule: [
        '第一天',
        '08:00 - 台東機場集合',
        '09:00 - 搭乘飛機前往蘭嶼',
        '10:00 - 抵達蘭嶼，前往住宿地點放置行李',
        '11:00 - 環境介紹與注意事項說明',
        '12:00 - 午餐',
        '14:00 - 部落文化介紹',
        '16:00 - 海洋生態調查訓練',
        '18:00 - 晚餐',
        '19:30 - 夜間觀星',
        '第二天',
        '06:00 - 晨間浮潛觀察',
        '08:00 - 早餐',
        '09:30 - 海洋廢棄物調查',
        '12:00 - 午餐',
        '14:00 - 珊瑚礁生態調查',
        '17:00 - 資料整理與討論',
        '18:30 - 晚餐',
        '20:00 - 夜間生態觀察',
        '第三天',
        '08:00 - 早餐',
        '09:00 - 環境教育推廣活動',
        '12:00 - 午餐',
        '14:00 - 整理行李',
        '15:00 - 搭機返回台東',
        '17:00 - 賦歸'
      ],
      requirements: [
        '18歲以上',
        '具備基本游泳能力',
        '能適應海上活動',
        '身體狀況良好'
      ],
      benefits: [
        '志工服務時數證明',
        '機票補助',
        '保險',
        '三餐提供',
        '住宿安排',
        '浮潛裝備租借'
      ],
      contact: {
        name: '林海洋',
        phone: '0945-678-901',
        email: 'lin.hy@volunteer.org'
      },
      meetingPoint: '台東豐年機場候機室',
      items: [
        '個人證件',
        '防水相機（選配）',
        '防曬用品',
        '個人藥品',
        '輕便衣物',
        '防水袋',
        '帽子',
        '水壺'
      ],
      notes: [
        '請注意天氣預報',
        '行程可能因天候調整',
        '請遵從指導員指示',
        '若身體不適請立即告知'
      ],
      transportation: [
        '台東-蘭嶼來回機票',
        '島上交通安排'
      ],
      difficulty: '中級',
      category: '海洋保育',
      duration: '3天2夜',
      targetAudience: [
        '對海洋生態有興趣者',
        '具備游泳能力者',
        '對環境調查有熱忱者'
      ]
    }
  }
];

try {
  // 確保目錄存在
  const dataDir = dirname(DATA_FILE_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // 寫入預設資料
  fs.writeFileSync(DATA_FILE_PATH, JSON.stringify({ events: defaultEvents }, null, 2), 'utf8');
  console.log('Events data initialized successfully!');
} catch (error) {
  console.error('Error initializing events data:', error);
}
