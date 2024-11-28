'use client'

import { Event } from '@/lib/types'
import Image from 'next/image'
import { useState } from 'react'
import { CalendarDays, MapPin, Users, Clock, AlertTriangle, User } from 'lucide-react'

interface EventDetailProps {
  event: Event
}

export default function EventDetail({ event }: EventDetailProps) {
  const [isRegistering, setIsRegistering] = useState(false)
  const isFull = event.participants >= event.maxParticipants

  const handleRegister = () => {
    setIsRegistering(true)
    // 模擬註冊過程
    setTimeout(() => {
      setIsRegistering(false)
      alert('報名成功！')
    }, 1000)
  }

  const difficultyColor = {
    簡單: 'bg-green-100 text-green-800',
    中等: 'bg-yellow-100 text-yellow-800',
    困難: 'bg-red-100 text-red-800'
  }[event.details?.difficulty || '中等']

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* 活動圖片 */}
        <div className="relative h-96 w-full">
          <Image
            src={event.image || '/images/placeholder1.jpg'}
            alt={event.title}
            fill
            priority={true}
            sizes="100vw"
            className="object-cover"
            onError={(e: any) => {
              e.target.src = '/images/placeholder1.jpg'
            }}
          />
        </div>

        <div className="p-8">
          {/* 活動標題和基本資訊 */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
              <div className="flex items-center gap-4">
                {event.details?.difficulty && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColor}`}>
                    {event.details.difficulty}
                  </span>
                )}
                {event.details?.duration && (
                  <span className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-1" />
                    {event.details.duration}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
              <div className="flex items-center">
                <CalendarDays className="w-5 h-5 mr-2" />
                {event.startDate}{event.endDate ? ` ~ ${event.endDate}` : ''}
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                {event.location}
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                {event.participants}/{event.maxParticipants} 人
              </div>
              {event.details?.category && (
                <div className="flex items-center">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {event.details.category}
                  </span>
                </div>
              )}
              {event.creatorName && (
                <div className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  <span>建立者：{event.creatorName}</span>
                </div>
              )}
            </div>
          </div>

          {/* 活動描述 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">活動說明</h2>
            <p className="text-gray-600">{event.description}</p>
          </div>

          {/* 集合資訊 */}
          {event.details?.meetingPoint && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">集合資訊</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">{event.details.meetingPoint}</p>
              </div>
            </div>
          )}

          {/* 時間表 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">活動流程</h2>
            <div className="space-y-2">
              {event.details?.schedule?.map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1">
                    <span className="text-green-800 font-medium">{index + 1}</span>
                  </div>
                  <p className="text-gray-600">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 攜帶物品 */}
          {event.details?.items && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">攜帶物品</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.details.items.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 注意事項 */}
          {event.details?.notes && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">注意事項</h2>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                  <span className="text-yellow-800 font-medium">請詳閱以下事項</span>
                </div>
                <ul className="list-disc list-inside space-y-2">
                  {event.details.notes.map((note, index) => (
                    <li key={index} className="text-gray-600">{note}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* 交通資訊 */}
          {event.details?.transportation && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">交通方式</h2>
              <div className="space-y-2">
                {event.details.transportation.map((item, index) => (
                  <p key={index} className="text-gray-600">• {item}</p>
                ))}
              </div>
            </div>
          )}

          {/* 天氣資訊 */}
          {event.details?.weather && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">天氣相關</h2>
              <div className="bg-blue-50 p-4 rounded-lg">
                <ul className="list-disc list-inside space-y-2">
                  {event.details.weather.map((item, index) => (
                    <li key={index} className="text-gray-600">{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* 適合對象 */}
          {event.details?.targetAudience && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">適合對象</h2>
              <div className="flex flex-wrap gap-2">
                {event.details.targetAudience.map((audience, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    {audience}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 報名要求 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">報名要求</h2>
            <ul className="list-disc list-inside space-y-2">
              {event.details?.requirements?.map((req, index) => (
                <li key={index} className="text-gray-600">{req}</li>
              ))}
            </ul>
          </div>

          {/* 活動福利 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">活動福利</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {event.details?.benefits?.map((benefit, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-600">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 聯絡資訊 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">聯絡資訊</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 mb-2">聯絡人：{event.details?.contact?.name}</p>
              <p className="text-gray-600 mb-2">電話：{event.details?.contact?.phone}</p>
              <p className="text-gray-600">Email：{event.details?.contact?.email}</p>
            </div>
          </div>

          {/* 報名按鈕 */}
          <div className="flex justify-center">
            <button
              onClick={handleRegister}
              disabled={isFull || isRegistering}
              className={`
                px-8 py-3 rounded-lg font-medium text-white
                ${isFull 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'}
                transition-colors duration-200
              `}
            >
              {isRegistering 
                ? '報名中...' 
                : isFull 
                  ? '已額滿' 
                  : '立即報名'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
