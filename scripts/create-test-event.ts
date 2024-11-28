import { eventOperations } from '../src/lib/eventOperations';

// 取得下個月的日期
const today = new Date();
const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
const nextMonthEnd = new Date(nextMonth);
nextMonthEnd.setDate(nextMonthEnd.getDate() + 3); // 活動持續3天

// 報名截止日期設為活動開始前7天
const registrationDeadline = new Date(nextMonth);
registrationDeadline.setDate(registrationDeadline.getDate() - 7);

// 創建測試活動資料
const testEvent = {
  title: '台北市立動物園志工服務',
  startDate: nextMonth.toISOString().split('T')[0],
  endDate: nextMonthEnd.toISOString().split('T')[0],
  location: '台北市立動物園',
  description: `
    邀請您加入台北市立動物園志工行列！
    
    活動內容：
    - 協助園區環境維護
    - 引導遊客參觀
    - 支援動物保育教育活動
    - 協助園區活動進行
    
    志工們將有機會：
    - 近距離了解動物習性
    - 參與保育工作
    - 獲得專業培訓
    - 結識志同道合的夥伴
  `.trim(),
  maxParticipants: 30,
  registrationDeadline: registrationDeadline.toISOString().split('T')[0],
  image: '/images/default-event.jpg',
  projectManager: {
    name: '王大明',
    email: 'wang.daming@zoo.gov.tw',
    phone: '02-2938-2300'
  },
  details: {
    requirements: [
      '年滿18歲',
      '具備良好溝通能力',
      '能配合活動時間',
      '對動物保育有興趣',
      '願意戶外工作'
    ],
    notes: [
      '請穿著輕便服裝與運動鞋',
      '活動將提供午餐與飲用水',
      '完成服務後將發放志工服務證明',
      '請務必準時報到',
      '如遇雨天活動照常進行，請自備雨具'
    ]
  },
  createdBy: 1 // 假設是由 ID 為 1 的管理員建立
};

try {
  const eventId = eventOperations.create(testEvent);
  console.log('測試活動創建成功！活動 ID:', eventId);
} catch (error) {
  console.error('創建測試活動失敗:', error);
}
