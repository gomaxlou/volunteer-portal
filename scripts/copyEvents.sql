.open 'data/volunteer.db'
INSERT INTO events (
    title, startDate, endDate, location, description,
    image, participants, maxParticipants, registrationDeadline,
    projectManagerName, projectManagerEmail, projectManagerPhone,
    status
) VALUES 
    ('都會區淨灘環保行動', '2024-03-15 08:00', '2024-03-15 12:00', '新北市八里區觀海廣場',
    '邀請您一同參與海洋環境保護行動！活動包含專業環保講師指導、淨灘行動、垃圾分類教學，以及海洋生態介紹。',
    '/images/beach-cleanup.jpg', 0, 30, '2024-03-13 23:59',
    '李美玲', 'mei.li@eco.org.tw', '0923-456-789',
    'published'),
    
    ('偏鄉教育志工計畫', '2024-04-01 08:00', '2024-04-05 17:00', '台東縣達仁鄉',
    '五天四夜的偏鄉教育服務，包含課業輔導、藝術教學、文化交流等活動。讓我們一起為偏鄉教育盡一份心力！',
    '/images/education.jpg', 0, 15, '2024-03-20 23:59',
    '張文華', 'edu.chang@teach.org.tw', '0912-345-678',
    'published'),
    
    ('社區長者關懷計畫', '2024-03-20 09:00', '2024-03-20 16:00', '台北市萬華區',
    '一日社區服務，探訪獨居長者，提供生活關懷與陪伴。活動包含居家關懷、生活協助、健康檢測等服務。',
    '/images/elderly-care.jpg', 0, 20, '2024-03-18 23:59',
    '王小明', 'wang.sm@community.org.tw', '0934-567-890',
    'published'),
    
    ('山區步道維護工作', '2024-04-15 07:00', '2024-04-15 15:00', '新北市汐止區姜子寮步道',
    '協助維護山區步道，包含步道修繕、環境維護、指示牌更新等工作。一起為維護登山環境盡一份心力！',
    '/images/trail-maintenance.jpg', 0, 25, '2024-04-13 23:59',
    '陳大山', 'chen.ds@trail.org.tw', '0945-678-901',
    'published'),
    
    ('食物銀行物資整理', '2024-03-25 13:00', '2024-03-25 17:00', '台北市信義區',
    '協助食物銀行進行物資整理、分類、包裝等工作，幫助物資能更有效地發放給需要的家庭。',
    '/images/food-bank.jpg', 0, 15, '2024-03-23 23:59',
    '林小琪', 'lin.sq@foodbank.org.tw', '0956-789-012',
    'published');
