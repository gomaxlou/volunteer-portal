'use client';

import React, { useState } from 'react';
import ImageCarousel from './ImageCarousel';
import ShareButtons from '@/components/ui/ShareButtons';
import SignUpButton from '@/components/ui/SignUpButton';

interface GalleryDetailProps {
  item: {
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
  };
  pageUrl: string;
  isAuthenticated?: boolean;
}

const GalleryDetail = ({ item, pageUrl, isAuthenticated }: GalleryDetailProps) => {
  const [isImageEnlarged, setIsImageEnlarged] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const canSignUp = item.status === 'upcoming';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Image Carousel */}
      <div className="p-6">
        <ImageCarousel
          images={item.images}
          onImageClick={() => {
            setIsImageEnlarged(true);
          }}
        />
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Share Section */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-6">
          <h2 className="text-sm font-medium text-gray-500">分享活動</h2>
          <ShareButtons
            url={pageUrl}
            title={item.title}
            description={item.description}
          />
        </div>

        {/* Sign Up Section */}
        <div className="border-t border-gray-100 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-500">活動報名</h2>
            <span className={`
              px-2 py-1 text-xs font-medium rounded-full
              ${item.status === 'upcoming' ? 'bg-green-100 text-green-800' :
                item.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'}
            `}>
              {item.status === 'upcoming' ? '即將開始' :
               item.status === 'ongoing' ? '進行中' :
               '已結束'}
            </span>
          </div>
          {canSignUp ? (
            <SignUpButton
              activityId={item.id}
              title={item.title}
              date={item.date}
              maxParticipants={item.maxParticipants}
              currentParticipants={item.currentParticipants}
              isAuthenticated={isAuthenticated}
            />
          ) : (
            <button
              disabled
              className="w-full px-6 py-3 rounded-lg font-medium text-white bg-gray-400 cursor-not-allowed"
            >
              {item.status === 'ongoing' ? '活動進行中' : '活動已結束'}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 border-t border-gray-100">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-600 font-medium">活動日期</p>
            <p className="text-lg font-semibold text-gray-900">{item.date}</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-600 font-medium">活動地點</p>
            <p className="text-lg font-semibold text-gray-900">{item.location}</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-600 font-medium">參與志工</p>
            <p className="text-lg font-semibold text-gray-900">{item.participants} 人</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-600 font-medium">受惠人數</p>
            <p className="text-lg font-semibold text-gray-900">{item.beneficiaries} 人</p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">活動說明</h2>
          <p className="text-gray-600 leading-relaxed">{item.description}</p>
        </div>

        {/* Highlights */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">活動亮點</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {item.highlights.map((highlight, index) => (
              <li
                key={index}
                className="flex items-center space-x-2 text-gray-600"
              >
                <svg
                  className="w-5 h-5 text-green-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Lightbox */}
      {isImageEnlarged && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
          onClick={() => setIsImageEnlarged(false)}
        >
          <div className="relative max-w-7xl w-full h-full flex items-center justify-center p-4">
            <button
              className="absolute top-4 right-4 text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
              onClick={() => setIsImageEnlarged(false)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="relative w-full h-full">
              <img
                src={item.images[selectedImageIndex].url}
                alt={item.images[selectedImageIndex].alt}
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryDetail;
