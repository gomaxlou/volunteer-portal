import React from 'react';
import GalleryGrid from './components/GalleryGrid';
import GalleryFilter from './components/GalleryFilter';

const GalleryPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            活動相簿
          </h1>
          <p className="text-xl text-white opacity-90">
            記錄每一個溫暖的服務時刻
          </p>
        </div>
      </section>

      {/* Gallery Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="mb-8">
          <GalleryFilter />
        </div>

        {/* Gallery Grid */}
        <GalleryGrid />
      </div>
    </div>
  );
};

export default GalleryPage;
