'use client'

import { useEffect, useState } from 'react'
import { Calendar, MapPin, Users, Clock, User, Phone, Mail, ChevronDown, ChevronUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { LoadingSkeleton } from '@/components/shared/Loading'
import { Event } from '@/lib/mock-data'

interface EventCardProps extends Event {
  projectManager: {
    name: string
    title: string
    phone: string
    email: string
    line?: string
  }
}

export default function EventCard({
  id,
  title,
  date,
  location,
  participants,
  maxParticipants,
  image,
  description,
  registrationDeadline,
  projectManager,
}: EventCardProps) {
  const [isClient, setIsClient] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isPmInfoExpanded, setIsPmInfoExpanded] = useState(false)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <LoadingSkeleton />
  }

  // 計算各種狀態
  const now = new Date()
  const eventDate = new Date(date)
  const deadlineDate = new Date(registrationDeadline)
  
  const isExpired = eventDate < now
  const isRegistrationClosed = deadlineDate < now
  const daysUntilDeadline = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  const remainingSpots = maxParticipants - participants
  const isFull = remainingSpots <= 0
  const isAlmostFull = remainingSpots <= maxParticipants * 0.2 // 剩餘名額小於等於20%

  // 決定狀態標籤
  const getStatusBadge = () => {
    if (isExpired) {
      return {
        text: '活動結束',
        className: 'bg-red-500'
      }
    }
    if (isRegistrationClosed) {
      return {
        text: '報名截止',
        className: 'bg-gray-500'
      }
    }
    if (isFull) {
      return {
        text: '名額已滿',
        className: 'bg-red-500'
      }
    }
    if (daysUntilDeadline <= 3) {
      return {
        text: `報名倒數 ${daysUntilDeadline} 天`,
        className: 'bg-orange-500'
      }
    }
    if (isAlmostFull) {
      return {
        text: `剩餘 ${remainingSpots} 名額`,
        className: 'bg-yellow-500'
      }
    }
    return null
  }

  // 格式化日期顯示
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }

  const statusBadge = getStatusBadge()

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48">
        <Image 
          src={imageError ? '/placeholder-event.jpg' : image}
          alt={title} 
          fill 
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => setImageError(true)}
        />
        {statusBadge && (
          <div className={`absolute top-4 right-4 ${statusBadge.className} text-white px-3 py-1 rounded-full text-sm font-medium`}>
            {statusBadge.text}
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-4 rounded-lg mb-4 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
            </div>
            <div className="flex-grow">
              <p className={`
                text-gray-800 
                leading-relaxed 
                ${isDescriptionExpanded ? 'h-auto' : 'line-clamp-3'} 
                text-base 
                font-medium
                transition-all 
                duration-500
                ${isDescriptionExpanded ? 'mb-4' : 'mb-2'}
              `}>
                {description}
              </p>
              {description.length > 100 && (
                <div className="mt-3">
                  <button 
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)} 
                    className="inline-flex items-center text-blue-600 text-sm hover:text-blue-700 focus:outline-none font-semibold bg-white px-3 py-1 rounded-full shadow-sm hover:shadow transition-all duration-200"
                  >
                    {isDescriptionExpanded ? (
                      <>
                        收起詳情
                        <ChevronUp className="h-4 w-4 ml-1" />
                      </>
                    ) : (
                      <>
                        查看更多
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-5 w-5 mr-2" />
            <span>{formatDate(date)}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-5 w-5 mr-2" />
            <span>{location}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="h-5 w-5 mr-2" />
            <span className={isAlmostFull ? 'text-yellow-600 font-medium' : ''}>
              {participants}/{maxParticipants} 人已報名
              {isAlmostFull && !isFull && ' (即將額滿)'}
            </span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="h-5 w-5 mr-2" />
            <span className={daysUntilDeadline <= 3 && !isRegistrationClosed ? 'text-orange-600 font-medium' : ''}>
              報名截止：{formatDate(registrationDeadline)}
            </span>
          </div>
        </div>
        <div className="mt-4 border-t pt-4">
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsPmInfoExpanded(!isPmInfoExpanded)}
          >
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-500" />
              <span className="font-medium">{projectManager.name}</span>
              <span className="text-sm text-gray-500">({projectManager.title})</span>
            </div>
            {isPmInfoExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </div>
          {isPmInfoExpanded && (
            <div className="mt-3 pl-7 space-y-2 animate-fadeIn">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <a href={`tel:${projectManager.phone}`} className="text-blue-600 hover:underline text-sm">
                  {projectManager.phone}
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <a href={`mailto:${projectManager.email}`} className="text-blue-600 hover:underline text-sm">
                  {projectManager.email}
                </a>
              </div>
              {projectManager.line && (
                <div className="flex items-center space-x-2">
                  <img src="/line-icon.svg" alt="LINE" className="h-4 w-4" />
                  <span className="text-sm">{projectManager.line}</span>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="mt-8 text-center">
          {!isRegistrationClosed && !isFull ? (
            <Link
              href={`/events/${id}`}
              className={`
                inline-block px-6 py-2 rounded-full text-sm font-medium
                transition-colors duration-300
                bg-green-600 text-white hover:bg-green-700
                w-full sm:w-auto
              `}
            >
              立即參與
            </Link>
          ) : (
            <div className="text-center py-2 px-4 bg-gray-100 text-gray-500 rounded-md">
              {isFull ? '名額已滿' : '報名已截止'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
