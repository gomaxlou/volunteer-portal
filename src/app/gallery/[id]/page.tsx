import React from 'react';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import GalleryDetail from '../components/GalleryDetail';
import BackButton from '../components/BackButton';

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  date: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  maxParticipants: number;
  currentParticipants: number;
  images: {
    url: string;
    alt: string;
  }[];
  description: string;
  location: string;
  participants: number;
  beneficiaries: number;
  highlights: string[];
}

// 模擬數據
const galleryItems: GalleryItem[] = [
  {
    id: 1,
    title: '偏鄉教育服務',
    category: 'education',
    date: '2023/10/15',
    status: 'upcoming',
    maxParticipants: 30,
    currentParticipants: 15,
    images: [
      {
        url: '/images/placeholder/education-1.jpg',
        alt: '偏鄉教育服務 - 科學實驗'
      },
      {
        url: '/images/placeholder/education-2.jpg',
        alt: '偏鄉教育服務 - 藝術創作'
      }
    ],
    description: '為偏鄉地區的孩子們提供教育資源和學習機會',
    location: '新北市石碇區',
    participants: 20,
    beneficiaries: 50,
    highlights: [
      '提供科學實驗課程',
      '藝術創作工作坊',
      '戶外探索活動'
    ]
  },
  {
    id: 2,
    title: '淨灘活動',
    category: 'environment',
    date: '2023/09/20',
    status: 'completed',
    maxParticipants: 50,
    currentParticipants: 30,
    images: [
      {
        url: '/images/placeholder/environment-1.jpg',
        alt: '淨灘活動 - 清理垃圾'
      }
    ],
    description: '共同維護海洋環境，清理海灘垃圾',
    location: '新北市金山區',
    participants: 30,
    beneficiaries: 100,
    highlights: [
      '海洋生態講座',
      '垃圾分類教學',
      '淨灘行動'
    ]
  },
  {
    id: 3,
    title: '長者關懷活動',
    category: 'elderly',
    date: '2023/08/30',
    status: 'ongoing',
    maxParticipants: 20,
    currentParticipants: 15,
    images: [
      {
        url: '/images/placeholder/elderly-1.jpg',
        alt: '長者關懷活動'
      }
    ],
    description: '陪伴長者聊天、進行簡單的健康檢查',
    location: '台北市大同區',
    participants: 15,
    beneficiaries: 30,
    highlights: [
      '健康檢查服務',
      '團康活動',
      '心靈陪伴'
    ]
  }
];

interface PageProps {
  params: {
    id: string;
  };
}

async function getGalleryItem(id: number): Promise<GalleryItem | undefined> {
  return galleryItems.find(item => item.id === id);
}

export default async function GalleryItemPage({ params }: PageProps) {
  // 等待 params
  const { id: paramId } = await Promise.resolve(params);
  const id = parseInt(paramId);
  
  const item = await getGalleryItem(id);
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const fullUrl = `${protocol}://${host}/gallery/${id}`;

  if (!item) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BackButton />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-white mb-4">
              {item.title}
            </h1>
            <p className="text-lg text-white opacity-80">
              日期：{item.date}
            </p>
            <p className="text-lg text-white opacity-80">
              地點：{item.location}
            </p>
            <p className="text-lg text-white opacity-80">
              狀態：{item.status === 'upcoming' ? '即將開始' : item.status === 'ongoing' ? '進行中' : '已完成'}
            </p>
            <p className="text-lg text-white opacity-80">
              報名人數：{item.currentParticipants}/{item.maxParticipants}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <GalleryDetail
          item={item}
          pageUrl={fullUrl}
          isAuthenticated={false} // TODO: 從 session 中獲取
        />
      </div>
    </div>
  );
}
