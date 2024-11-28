'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function HeroSection() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="relative h-[60vh] min-h-[400px] bg-gray-100" />
    )
  }

  return (
    <div className="relative">
      {/* Hero Image */}
      <div className="relative h-[60vh] min-h-[400px]">
        <Image
          src="/images/hero.jpg"
          alt="Volunteer group"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              讓愛心成就美好世界
            </h1>
            <p className="text-xl sm:text-2xl text-white mb-8">
              加入我們的志工團隊，一同創造正向改變
            </p>
            <Link
              href="/trips"
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-full font-medium hover:bg-green-700 transition-colors"
            >
              立即參與
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="relative z-10 -mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: '志工服務',
                description: '提供多元化的志工服務機會',
                image: '/images/volunteer1.jpg',
              },
              {
                title: '團隊活動',
                description: '舉辦各式團隊建立活動',
                image: '/images/feature2.jpg',
              },
              {
                title: '教育培訓',
                description: '專業的志工培訓課程',
                image: '/images/feature3.jpg',
              },
            ].map((card, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="relative h-48">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    priority={index === 0}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {card.title}
                  </h3>
                  <p className="text-gray-600">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
