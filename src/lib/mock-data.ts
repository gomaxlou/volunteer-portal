export interface Event {
  id: string
  title: string
  date: string
  location: string
  participants: number
  maxParticipants: number
  image: string
  description: string
  registrationDeadline: string
  projectManager: {
    name: string
    title: string
    phone: string
    email: string
    line?: string
  }
  details: {
    schedule: string[]
    requirements: string[]
    benefits: string[]
    contact: {
      name: string
      phone: string
      email: string
    }
    meetingPoint?: string
    items?: string[]
    notes?: string[]
    transportation?: string[]
    weather?: string[]
    difficulty?: string
    category?: string
    duration?: string
    targetAudience?: string[]
  }
}

export const mockEvents: Event[] = [
  // 已結束的活動
  {
    id: 'past-1',
    title: '社區老人關懷活動',
    date: '2023-11-05',
    registrationDeadline: '2023-11-03',
    location: '台北市萬華區',
    participants: 12,
    maxParticipants: 20,
    image: '/images/volunteer1.jpg',
    description: '探訪社區獨居老人，陪伴聊天並提供生活協助。我們將與社區合作，為獨居長者送上關懷與溫暖。活動內容包括：陪伴聊天、協助整理居家環境、量血壓、代購生活用品等。透過志工的參與，不僅能讓長者感受到社會的溫暖，更能促進跨世代交流，建立社區互助網絡。我們也會提供簡單的老人照護知識，讓志工們學習如何更好地與長者互動。歡迎有愛心、耐心的您加入我們的行列！',
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
        name: '張小姐',
        phone: '02-6543-2109',
        email: 'elderly.care@volunteer.org'
      }
    }
  },
  {
    id: 'past-2',
    title: '寒冬送暖物資整理',
    date: '2023-12-15',
    registrationDeadline: '2023-12-10',
    location: '台北市信義區',
    participants: 30,
    maxParticipants: 30,
    image: '/images/feature2.jpg',
    description: '協助整理冬季物資，包括禦寒衣物、毛毯等，為弱勢族群預備溫暖的冬天。本次活動將整理來自社會各界捐贈的冬季物資，包括衣物分類、品質檢查、整理打包等工作。我們也會介紹物資分類的標準和注意事項，確保每件物資都能發揮最大的效用。這不僅是一個付出愛心的機會，更是學習物資管理的好機會。一起來為弱勢族群的冬天盡一份心力吧！',
    projectManager: {
      name: '林美玲',
      title: '物資管理組長',
      phone: '0923-456-789',
      email: 'lin.pm@volunteer.org'
    },
    details: {
      schedule: [
        '08:30 - 報到與工作說明',
        '09:00 - 物資分類開始',
        '12:00 - 午餐休息',
        '13:00 - 繼續物資整理',
        '16:00 - 場地清潔',
        '16:30 - 活動結束'
      ],
      requirements: [
        '具備基本體力',
        '能夠搬運物品',
        '細心負責',
        '願意遵守物資分類規則'
      ],
      benefits: [
        '志工服務證明',
        '提供午餐',
        '交通補助',
        '志工保險'
      ],
      contact: {
        name: '林組長',
        phone: '02-8765-4321',
        email: 'winter.donation@volunteer.org'
      }
    }
  },
  {
    id: 'past-3',
    title: '兒童課後陪伴計畫',
    date: '2023-12-20',
    registrationDeadline: '2023-12-15',
    location: '台北市文山區',
    participants: 15,
    maxParticipants: 15,
    image: '/images/feature3.jpg',
    description: '為弱勢家庭孩童提供課後陪伴與課業輔導，協助他們建立良好的讀書習慣。活動內容包括：課業指導、品格教育、才藝活動等。我們希望透過志工的陪伴，不只幫助孩子們在課業上進步，更能培養正確的價值觀和生活態度。每位孩子都應該有公平的學習機會，讓我們一起為下一代的教育盡一份心力！',
    projectManager: {
      name: '陳老師',
      title: '教育輔導組長',
      phone: '0934-567-890',
      email: 'chen.edu@volunteer.org',
      line: 'chen_edu'
    },
    details: {
      schedule: [
        '14:00 - 志工報到與行前說明',
        '14:30 - 學童到課',
        '14:45 - 課業輔導',
        '16:00 - 課間活動',
        '16:30 - 才藝課程',
        '17:30 - 整理環境',
        '18:00 - 活動結束'
      ],
      requirements: [
        '具備國高中基礎學科知識',
        '喜歡與孩子互動',
        '有耐心',
        '需完成志工培訓'
      ],
      benefits: [
        '志工服務證明',
        '教學經驗',
        '志工保險',
        '定期培訓課程'
      ],
      contact: {
        name: '陳老師',
        phone: '02-2345-6789',
        email: 'children.edu@volunteer.org'
      },
      notes: [
        '請攜帶個人文具',
        '建議穿著輕便服裝',
        '活動前須參加志工培訓'
      ]
    }
  },
  // 報名截止的活動（活動尚未開始，但已超過報名期限）
  {
    id: 'deadline-passed',
    title: '都會公園清潔日',
    date: '2024-12-10',
    registrationDeadline: '2024-11-25',
    location: '台北市大安森林公園',
    participants: 25,
    maxParticipants: 50,
    image: '/images/placeholder1.jpg',
    description: '一起維護城市綠地，清理公園環境，為市民創造更好的休憩空間。本次活動將以環境教育為主軸，除了基本的清潔工作外，也會介紹都市生態系統的重要性。志工們將學習辨識常見的公園植物、了解生物多樣性的價值，以及都市綠地對於城市永續發展的重要性。活動期間也會進行資源回收分類教學，讓志工們認識正確的垃圾分類方式。我們相信，透過親身參與，每個人都能成為環境保護的推廣者！',
    projectManager: {
      name: '李大方',
      title: '環境保護組主任',
      phone: '0923-456-789',
      email: 'lee.pm@volunteer.org',
      line: 'lee_env'
    },
    details: {
      schedule: [
        '08:30 - 集合報到',
        '09:00 - 活動說明與分組',
        '09:30 - 開始清潔活動',
        '11:30 - 午餐休息',
        '13:00 - 下午場清潔活動',
        '15:00 - 成果分享',
        '15:30 - 活動結束'
      ],
      requirements: [
        '年滿16歲',
        '穿著合適工作服裝',
        '具備基本體力',
        '能配合活動時間'
      ],
      benefits: [
        '志工服務證明',
        '午餐便當',
        '志工保險',
        '紀念T恤'
      ],
      contact: {
        name: '李先生',
        phone: '02-8765-4321',
        email: 'park.cleanup@volunteer.org'
      }
    }
  },
  // 名額已滿的活動
  {
    id: 'full',
    title: '二手物資整理活動',
    date: '2024-12-20',
    registrationDeadline: '2024-12-18',
    location: '台北市信義區',
    participants: 15,
    maxParticipants: 15,
    image: '/images/placeholder1.jpg',
    description: '協助整理和分類食物銀行的物資，幫助弱勢家庭獲得所需物資。',
    projectManager: {
      name: '張美玲',
      title: '物資管理組長',
      phone: '0934-567-890',
      email: 'chang.pm@volunteer.org',
      line: 'chang_resource'
    },
    details: {
      schedule: [
        '09:30 - 報到與活動說明',
        '10:00 - 開始物資整理',
        '12:00 - 午餐休息',
        '13:00 - 繼續物資整理',
        '15:30 - 整理場地',
        '16:00 - 活動結束'
      ],
      requirements: [
        '具備基本體力',
        '能夠搬運物品',
        '細心負責',
        '守時'
      ],
      benefits: [
        '志工時數證明',
        '午餐提供',
        '交通補助',
        '志工保險'
      ],
      contact: {
        name: '張小姐',
        phone: '02-6543-2109',
        email: 'donation.sort@volunteer.org'
      }
    }
  },
  // 報名倒數3天的活動
  {
    id: 'deadline-soon',
    title: '社區環境清潔日',
    date: '2024-12-15',
    registrationDeadline: '2024-12-12',
    location: '台北市大安區',
    participants: 15,
    maxParticipants: 30,
    image: '/images/placeholder1.jpg',
    description: '一起為社區環境盡一份心力，創造更美好的生活空間。',
    projectManager: {
      name: '陳志明',
      title: '社區營造組組長',
      phone: '0945-678-901',
      email: 'chen.pm@volunteer.org',
      line: 'chen_community'
    },
    details: {
      schedule: [
        '08:30 - 09:00 報到與簡介',
        '09:00 - 11:30 社區清潔活動',
        '11:30 - 12:00 成果分享',
        '12:00 - 13:00 午餐交流'
      ],
      requirements: [
        '年滿 15 歲',
        '具備基本體力',
        '願意配合活動規劃',
        '自備水壺及環保餐具'
      ],
      benefits: [
        '志工服務時數認證',
        '提供午餐及飲用水',
        '贈送環保紀念品',
        '活動保險'
      ],
      contact: {
        name: '王小明',
        phone: '02-2345-6789',
        email: 'cleaning@volunteer.org'
      }
    }
  },
  // 即將額滿的活動（剩餘名額少於20%）
  {
    id: 'almost-full',
    title: '長者關懷活動',
    date: '2024-12-25',
    registrationDeadline: '2024-12-23',
    location: '新北市三重區',
    participants: 17,
    maxParticipants: 20,
    image: '/images/placeholder1.jpg',
    description: '探訪社區長者，陪伴聊天，提供生活協助。',
    projectManager: {
      name: '林雅婷',
      title: '銀髮關懷組長',
      phone: '0956-789-012',
      email: 'lin.pm@volunteer.org',
      line: 'lin_elderly'
    },
    details: {
      schedule: [
        '13:30 - 14:00 志工培訓',
        '14:00 - 16:30 長者探訪',
        '16:30 - 17:00 心得分享'
      ],
      requirements: [
        '年滿 18 歲',
        '具備耐心與同理心',
        '能夠基本溝通',
        '需參加行前培訓'
      ],
      benefits: [
        '志工服務時數認證',
        '提供飲用水',
        '專業培訓證書',
        '活動保險'
      ],
      contact: {
        name: '李大華',
        phone: '02-8765-4321',
        email: 'elderly@volunteer.org'
      }
    }
  },
  // 一般活動（尚有充足名額）
  {
    id: 'normal-1',
    title: '兒童教育志工',
    date: '2024-12-28',
    registrationDeadline: '2024-12-26',
    location: '台北市信義區',
    participants: 5,
    maxParticipants: 15,
    image: '/images/placeholder1.jpg',
    description: '為弱勢家庭兒童提供課業輔導及品格教育。',
    projectManager: {
      name: '黃育德',
      title: '教育服務組長',
      phone: '0967-890-123',
      email: 'huang.pm@volunteer.org',
      line: 'huang_edu'
    },
    details: {
      schedule: [
        '14:00 - 14:30 志工說明會',
        '14:30 - 16:30 課業輔導',
        '16:30 - 17:00 團康活動',
        '17:00 - 17:30 檢討會議'
      ],
      requirements: [
        '具備教學熱忱',
        '至少高中學歷',
        '需提供良民證',
        '穩定出席至少一學期'
      ],
      benefits: [
        '志工服務時數認證',
        '教學經驗證明',
        '定期培訓課程',
        '活動保險'
      ],
      contact: {
        name: '張美玲',
        phone: '02-6666-5555',
        email: 'education@volunteer.org'
      }
    }
  },
  {
    id: 'normal-2',
    title: '山區淨山活動',
    date: '2025-01-05',
    registrationDeadline: '2025-01-03',
    location: '新北市瑞芳區',
    participants: 5,
    maxParticipants: 25,
    image: '/images/placeholder1.jpg',
    description: '為山區環境盡一份心力，維護登山步道的清潔。',
    projectManager: {
      name: '吳建志',
      title: '戶外活動組長',
      phone: '0978-901-234',
      email: 'wu.pm@volunteer.org',
      line: 'wu_outdoor'
    },
    details: {
      schedule: [
        '07:30 - 08:00 集合報到',
        '08:00 - 08:30 行前說明',
        '08:30 - 12:00 淨山活動',
        '12:00 - 13:00 午餐休息'
      ],
      requirements: [
        '年滿 16 歲',
        '具備基本體力',
        '穿著適合登山的服裝',
        '自備飲用水和環保餐具'
      ],
      benefits: [
        '志工服務時數認證',
        '提供午餐便當',
        '贈送紀念T恤',
        '活動保險'
      ],
      contact: {
        name: '陳志明',
        phone: '02-2789-1234',
        email: 'mountain@volunteer.org'
      },
      meetingPoint: '瑞芳火車站出口廣場',
      items: [
        '登山鞋或防滑運動鞋',
        '長袖衣物（防曬、防蚊）',
        '帽子',
        '防曬乳',
        '個人藥品',
        '雨具',
        '環保餐具',
        '至少1000ml飲用水'
      ],
      notes: [
        '活動將視天氣狀況調整或取消',
        '請提前10分鐘到達集合地點',
        '全程禁止吸菸',
        '請遵從領隊指示'
      ],
      transportation: [
        '搭乘火車：至瑞芳站下車',
        '自行開車：瑞芳火車站前停車場（自費）'
      ],
      weather: [
        '若下雨將視情況改期',
        '請注意天氣預報，攜帶適當裝備'
      ],
      difficulty: '中等',
      category: '環境保護',
      duration: '5.5小時',
      targetAudience: [
        '對環境保護有興趣的民眾',
        '喜歡戶外活動者',
        '想認識新朋友的社會人士'
      ]
    }
  },
  {
    id: 'normal-3',
    title: '海灘清潔日',
    date: '2025-01-12',
    registrationDeadline: '2025-01-10',
    location: '新北市萬里區',
    participants: 10,
    maxParticipants: 40,
    image: '/images/placeholder1.jpg',
    description: '守護海洋生態，清理海灘垃圾，為地球盡一份心力。',
    projectManager: {
      name: '周海清',
      title: '海洋保育組長',
      phone: '0989-012-345',
      email: 'chou.pm@volunteer.org',
      line: 'chou_ocean'
    },
    details: {
      schedule: [
        '08:30 - 09:00 報到集合',
        '09:00 - 09:30 環保教育',
        '09:30 - 11:30 海灘清潔',
        '11:30 - 12:00 成果統計',
        '12:00 - 13:00 午餐交流'
      ],
      requirements: [
        '年滿 15 歲',
        '具備基本體力',
        '自備防曬用品',
        '穿著適合海邊活動的服裝'
      ],
      benefits: [
        '志工服務時數認證',
        '提供午餐及飲用水',
        '贈送環保袋',
        '活動保險'
      ],
      contact: {
        name: '林海珊',
        phone: '02-2456-7890',
        email: 'beach@volunteer.org'
      },
      meetingPoint: '野柳地質公園遊客中心前廣場',
      items: [
        '防水型防曬乳',
        '遮陽帽',
        '防水型長袖衣物',
        '防滑拖鞋或可以濕水的包鞋',
        '毛巾',
        '個人藥品',
        '環保餐具',
        '至少1000ml飲用水'
      ],
      notes: [
        '活動將視天氣狀況調整或取消',
        '請勿在活動期間游泳',
        '請注意防曬',
        '請遵從工作人員指示'
      ],
      transportation: [
        '搭乘公車：基隆客運至野柳站下車',
        '自行開車：野柳地質公園停車場（自費）'
      ],
      weather: [
        '若遇大雨或海上颱風警報將改期',
        '請特別注意防曬及防水準備'
      ],
      difficulty: '簡單',
      category: '環境保護',
      duration: '4.5小時',
      targetAudience: [
        '對海洋保育有興趣的民眾',
        '想為環境盡一份心力的人',
        '親子同樂'
      ]
    }
  },
  {
    id: 'normal-4',
    title: '食物銀行物資整理',
    date: '2025-01-19',
    registrationDeadline: '2025-01-17',
    location: '台北市中山區',
    participants: 3,
    maxParticipants: 20,
    image: '/images/placeholder1.jpg',
    description: '協助整理和分類食物銀行的物資，幫助弱勢家庭獲得所需物資。',
    projectManager: {
      name: '劉雪琴',
      title: '食物銀行組長',
      phone: '0990-123-456',
      email: 'liu.pm@volunteer.org',
      line: 'liu_foodbank'
    },
    details: {
      schedule: [
        '09:00 - 09:30 報到與工作說明',
        '09:30 - 12:00 物資整理與分類',
        '12:00 - 13:00 午餐休息',
        '13:00 - 15:30 物資包裝',
        '15:30 - 16:00 整理環境與檢討'
      ],
      requirements: [
        '年滿 16 歲',
        '具備基本體力',
        '能配合工作時間',
        '具備團隊合作精神'
      ],
      benefits: [
        '志工服務時數認證',
        '提供午餐及飲用水',
        '專業倉儲管理經驗',
        '活動保險'
      ],
      contact: {
        name: '林小芳',
        phone: '02-2345-6789',
        email: 'foodbank@volunteer.org'
      },
      meetingPoint: '中山區救助站一樓大廳',
      items: [
        '口罩',
        '輕便服裝',
        '環保餐具',
        '個人水壺'
      ],
      notes: [
        '請準時報到',
        '建議穿著輕便好活動的衣物',
        '現場提供手套及工作圍裙'
      ],
      difficulty: '簡單',
      category: '社會服務',
      duration: '7小時',
      targetAudience: [
        '對社會服務有興趣的民眾',
        '想學習物資管理的學生',
        '企業志工團隊'
      ]
    }
  }
]
