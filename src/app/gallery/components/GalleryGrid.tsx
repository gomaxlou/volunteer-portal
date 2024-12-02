'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// 模擬圖片數據
const galleryItems = [
  {
    id: 1,
    title: '偏鄉教育服務',
    category: 'education',
    date: '2023/10/15',
    images: [
      {
        url: '/images/placeholder/education-1.jpg',
        alt: '偏鄉教育服務 - 科學實驗'
      }
    ]
  },
  {
    id: 2,
    title: '淨灘活動',
    category: 'environment',
    date: '2023/09/20',
    images: [
      {
        url: '/images/placeholder/environment-1.jpg',
        alt: '淨灘活動 - 清理垃圾'
      }
    ]
  },
  {
    id: 3,
    title: '長者關懷活動',
    category: 'elderly',
    date: '2023/08/30',
    images: [
      {
        url: '/images/placeholder/elderly-1.jpg',
        alt: '長者關懷活動'
      }
    ]
  }
  // 可以添加更多圖片
];

const GalleryGrid = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = React.useState(false);

  const currentCategory = searchParams.get('category') || 'all';

  const filteredItems = currentCategory === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === currentCategory);

  const handleItemClick = (id: number) => {
    setLoading(true);
    router.push(`/gallery/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <LoadingSpinner size={15} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredItems.map((item) => (
        <div
          key={item.id}
          className="group relative aspect-square rounded-lg overflow-hidden bg-gray-200 cursor-pointer"
          onClick={() => handleItemClick(item.id)}
        >
          <div className="relative w-full h-full">
            <Image
              src={item.images[0].url}
              alt={item.images[0].alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm opacity-90">{item.date}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GalleryGrid;
