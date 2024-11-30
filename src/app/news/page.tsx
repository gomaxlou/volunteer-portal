"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { defaultImages, generatePlaceholderDataUrl } from '@/utils/generatePlaceholderImage';

interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  images: string[];
}

const mockNews: NewsItem[] = [
  {
    id: '1',
    title: '2024年度志工培訓計畫開始報名',
    category: '活動資訊',
    date: '2024-01-15',
    excerpt: '為了提升志工服務品質，本團將於2024年2月舉辦年度志工培訓計畫，歡迎有興趣的朋友報名參加...',
    images: []  // 將在組件內初始化
  },
  {
    id: '2',
    title: '偏鄉教育服務成果分享',
    category: '服務成果',
    date: '2024-01-10',
    excerpt: '本團2023年偏鄉教育服務計畫已圓滿結束，在此與大家分享這一年來的服務成果與感動時刻...',
    images: []  // 將在組件內初始化
  },
  {
    id: '3',
    title: '環保淨灘活動回顧',
    category: '活動回顧',
    date: '2024-01-05',
    excerpt: '上週末在新北市金山海灘舉辦的淨灘活動，共有超過200位志工參與，總計清理了約500公斤的海洋垃圾...',
    images: []  // 將在組件內初始化
  }
];

function NewsCard({ news }: { news: NewsItem }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    // 根據新聞類型設置對應的預設圖片
    let defaultImageSet: string[] = [];
    switch (news.id) {
      case '1':
        defaultImageSet = defaultImages.volunteerTraining;
        break;
      case '2':
        defaultImageSet = defaultImages.ruralEducation;
        break;
      case '3':
        defaultImageSet = defaultImages.beachCleanup;
        break;
      default:
        defaultImageSet = [
          generatePlaceholderDataUrl('預設圖片', 800, 400, '#48bb78')
        ];
    }
    setImages(defaultImageSet);
  }, [news.id]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  if (images.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 group">
        {/* 使用 next/image 的 blurDataURL 屬性來提供載入時的模糊效果 */}
        <Image
          src={images[currentImageIndex]}
          alt={`${news.title} - 圖片 ${currentImageIndex + 1}`}
          fill
          className="object-cover"
          blurDataURL={images[currentImageIndex]}
          placeholder="blur"
        />
        
        {/* 照片導航指示器 */}
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
          {images.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentImageIndex
                  ? 'bg-white scale-125'
                  : 'bg-white/60 hover:bg-white/80'
              }`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>

        {/* 左右箭頭 */}
        <div className="absolute inset-0 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.preventDefault();
              prevImage();
            }}
            className="p-2 m-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="上一張照片"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              nextImage();
            }}
            className="p-2 m-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="下一張照片"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
            {news.category}
          </span>
          <time className="text-gray-500 text-sm">{news.date}</time>
        </div>
        <h2 className="text-xl font-bold mb-3 text-gray-900">
          {news.title}
        </h2>
        <p className="text-gray-600 mb-4">{news.excerpt}</p>
        <Link
          href={`/news/${news.id}`}
          className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
        >
          閱讀更多
          <svg
            className="ml-2 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </article>
  );
}

export default function NewsPage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4 text-center">最新消息</h1>
          <p className="text-xl text-center max-w-3xl mx-auto">
            了解寶島志工服務團的最新動態、活動資訊與服務成果
          </p>
        </div>
      </section>

      {/* News List Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockNews.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-12 flex justify-center gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            上一頁
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            1
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            2
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            3
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
            下一頁
          </button>
        </div>
      </section>
    </main>
  );
}
