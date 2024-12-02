'use client';

import React from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

const categories = [
  { id: 'all', name: '全部' },
  { id: 'education', name: '教育服務' },
  { id: 'environment', name: '環境保護' },
  { id: 'elderly', name: '長者關懷' },
  { id: 'community', name: '社區服務' },
];

const GalleryFilter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const currentCategory = searchParams.get('category') || 'all';

  const createQueryString = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category === 'all') {
      params.delete('category');
    } else {
      params.set('category', category);
    }
    return params.toString();
  };

  const handleCategoryChange = (category: string) => {
    const queryString = createQueryString(category);
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryChange(category.id)}
          className={`
            px-4 py-2 rounded-full text-sm font-medium transition-colors
            ${
              currentCategory === category.id
                ? 'bg-green-600 text-white'
                : 'bg-white text-green-600 border-2 border-green-600 hover:bg-green-50'
            }
          `}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default GalleryFilter;
