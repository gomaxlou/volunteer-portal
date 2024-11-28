export interface Event {
  // 基本資訊
  id: string;
  title: string;
  startDate: string;       // YYYY-MM-DD HH:mm
  endDate: string;         // YYYY-MM-DD HH:mm
  location: {
    name: string;          // 地點名稱
    address: string;       // 詳細地址
    coordinates?: {        // 選填：GPS座標
      lat: number;
      lng: number;
    };
  };
  
  // 活動內容
  description: {
    summary: string;       // 簡短描述
    details: string;       // 詳細說明
    highlights: string[];  // 活動特色
  };
  
  // 活動狀態
  status: {
    isOpen: boolean;      // 是否開放報名
    participants: number;  // 目前報名人數
    maxParticipants: number; // 報名人數上限
    registrationDeadline: string; // YYYY-MM-DD HH:mm
  };
  
  // 活動圖片
  images: {
    main: string;         // 主要圖片
    gallery?: string[];   // 選填：其他圖片
  };
  
  // 負責人資訊
  projectManager: {
    name: string;
    title?: string;
    contact: {
      phone: string;
      email?: string;
      line?: string;
    };
  };
  
  // 活動詳細資訊
  details: {
    // 活動時程
    schedule: {
      day: string;        // 第幾天
      activities: {
        time: string;     // HH:mm
        activity: string; // 活動內容
      }[];
    }[];
    
    // 參與要求
    requirements: {
      age: string;        // 年齡要求
      skills: string[];   // 所需技能
      physical: string[]; // 體能要求
    };
    
    // 福利與補助
    benefits: {
      certificates: string[]; // 證書
      supplies: string[];    // 提供物資
      insurance: string[];   // 保險
      others: string[];      // 其他福利
    };
    
    // 聯絡資訊
    contact: {
      primary: {          // 主要聯絡人
        name: string;
        phone: string;
        email: string;
      };
      emergency?: {       // 選填：緊急聯絡人
        name: string;
        phone: string;
      };
    };
    
    // 集合資訊
    meetingPoint: {
      location: string;   // 集合地點
      time: string;       // 集合時間
      notes: string[];    // 注意事項
    };
    
    // 攜帶物品
    items: {
      required: string[]; // 必備物品
      optional: string[]; // 選配物品
    };
    
    // 注意事項
    notes: {
      general: string[];  // 一般注意事項
      safety: string[];   // 安全注意事項
      weather: string[];  // 天氣相關
    };
    
    // 交通資訊
    transportation: {
      public: string[];   // 大眾運輸
      private: string[];  // 自行開車
      shuttle?: string[]; // 選填：接駁服務
    };
    
    // 活動資訊
    activityInfo: {
      difficulty: string;    // 難度等級
      category: string;      // 活動類別
      duration: string;      // 活動時長
      targetAudience: string[]; // 適合對象
    };
  };
}
