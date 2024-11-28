"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockEvents = void 0;
exports.addEvent = addEvent;
exports.getAllEvents = getAllEvents;
exports.mockEvents = [
    {
        id: "event-1",
        title: "社區老人關懷活動",
        startDate: "2024-02-05 09:00",
        endDate: "2024-02-05 16:00",
        location: "台北市萬華區和平西路三段120號",
        description: "我們將與社區合作，為獨居長者送上關懷與溫暖。活動內容包括：陪伴聊天、協助整理居家環境、量血壓、代購生活用品等。透過志工的參與，不僅能讓長者感受到社會的溫暖，更能促進跨世代交流，建立社區互助網絡。",
        image: "/images/volunteer1.jpg",
        participants: 12,
        maxParticipants: 20,
        registrationDeadline: "2024-02-03 23:59",
        projectManager: {
            name: "王小明",
            title: "社區關懷組組長",
            contact: {
                phone: "0912-345-678",
                email: "wang.pm@volunteer.org",
                line: "wang_care"
            }
        },
        details: {
            schedule: [
                {
                    day: "活動當日",
                    activities: [
                        { time: "09:30", activity: "報到與活動說明" },
                        { time: "10:00", activity: "開始探訪" },
                        { time: "12:00", activity: "午餐休息" },
                        { time: "13:00", activity: "繼續探訪" },
                        { time: "15:30", activity: "回報與檢討" },
                        { time: "16:00", activity: "活動結束" }
                    ]
                }
            ],
            requirements: {
                age: "18歲以上",
                skills: [
                    "具備基本溝通能力",
                    "有耐心且善於傾聽"
                ],
                physical: [
                    "能全程參與活動",
                    "無傳染性疾病"
                ]
            },
            benefits: {
                certificates: ["志工時數證明"],
                supplies: ["午餐"],
                insurance: ["志工保險"],
                others: ["交通補助"]
            },
            contact: {
                primary: {
                    name: "王小明",
                    phone: "0912-345-678",
                    email: "wang.pm@volunteer.org"
                }
            },
            meetingPoint: {
                location: "萬華區公所一樓大廳",
                time: "09:30",
                notes: [
                    "請提前10分鐘到達",
                    "請配戴口罩"
                ]
            },
            items: {
                required: [
                    "個人證件",
                    "口罩",
                    "健保卡"
                ],
                optional: [
                    "環保餐具",
                    "保溫水壺"
                ]
            },
            notes: {
                general: [
                    "請準時報到",
                    "遵守防疫規定"
                ],
                safety: [
                    "注意個人安全",
                    "遵守交通規則"
                ],
                weather: [
                    "請注意天氣變化",
                    "攜帶雨具"
                ]
            },
            transportation: {
                public: [
                    "搭乘捷運至龍山寺站",
                    "轉乘公車235至和平醫院站"
                ],
                private: [
                    "備有免費停車場"
                ]
            },
            activityInfo: {
                difficulty: "簡單",
                category: "社區服務",
                duration: "7小時",
                targetAudience: [
                    "一般民眾",
                    "學生"
                ]
            }
        }
    }
];
// 新增活動到 mock 資料
function addEvent(event) {
    exports.mockEvents.push(event);
}
// 取得所有活動
function getAllEvents() {
    return exports.mockEvents;
}
