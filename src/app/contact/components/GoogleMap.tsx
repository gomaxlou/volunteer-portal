'use client';

import React from 'react';

const GoogleMap = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        我們的位置
      </h2>
      <div className="aspect-video w-full rounded-lg overflow-hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3614.7098797799156!2d121.56374931500707!3d25.033597183972473!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442abb6da80a7ad%3A0xacc4d11dc963103c!2z5Y-w5YyXMTAx!5e0!3m2!1szh-TW!2stw!4v1635000000000!5m2!1szh-TW!2stw"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="mt-4 text-center text-gray-600">
        <p>營業時間：週一至週五 9:00-18:00</p>
        <p>如需預約拜訪，請提前來電告知</p>
      </div>
    </div>
  );
};

export default GoogleMap;
