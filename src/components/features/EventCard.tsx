'use client'

import { useEffect, useState } from 'react'
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  ChevronDown, 
  ChevronUp, 
  Edit, 
  Trash2 
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { LoadingSkeleton } from '@/components/shared/Loading'
import { Event } from '@/lib/types'
import { checkAuth, type UserInfo } from '@/lib/auth'
import { useRouter } from 'next/navigation'

interface EventCardProps {
  event: Event
  isAuthenticated?: boolean
  isAdmin?: boolean
  priority?: boolean
}

export default function EventCard({ event, isAuthenticated, isAdmin, priority }: EventCardProps) {
  const router = useRouter()
  
  if (!event) {
    return <LoadingSkeleton />
  }

  const {
    id,
    title,
    startDate,
    endDate,
    location,
    participants,
    maxParticipants,
    image,
    description,
    registrationDeadline,
    projectManager,
    creatorName,
  } = event

  const [isClient, setIsClient] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isPmInfoExpanded, setIsPmInfoExpanded] = useState(false)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleDelete = async () => {
    if (!isAdmin) return;
    
    if (window.confirm('確定要刪除這個活動嗎？')) {
      setIsDeleting(true);
      try {
        const response = await fetch(`/api/events/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (response.ok) {
          router.refresh();
        } else {
          const error = await response.json();
          alert(error.message || '刪除活動失敗');
        }
      } catch (error) {
        console.error('Delete event error:', error);
        alert('刪除活動失敗');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* 活動圖片 */}
      <div className="relative h-48">
        <Image
          src={!imageError ? (image || '/images/placeholder1.jpg') : '/images/placeholder1.jpg'}
          alt={title}
          fill
          priority={priority}
          className="object-cover"
          onError={() => setImageError(true)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {isAdmin && (
          <div className="absolute top-2 right-2 flex space-x-2">
            <Link
              href={`/events/${id}/edit`}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
            >
              <Edit className="h-4 w-4 text-gray-600" />
            </Link>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </button>
          </div>
        )}
      </div>

      {/* 活動內容 */}
      <div className="p-4">
        <Link href={`/events/${id}`} className="block">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        </Link>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{startDate}{endDate ? ` ~ ${endDate}` : ''}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{location}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            <span>
              {participants}/{maxParticipants} 人
              {maxParticipants === participants && (
                <span className="ml-2 text-red-600">（已額滿）</span>
              )}
            </span>
          </div>
          {registrationDeadline && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>報名截止：{registrationDeadline}</span>
            </div>
          )}
          {creatorName && (
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span>建立者：{creatorName}</span>
            </div>
          )}
        </div>

        {/* 活動描述 */}
        <div className="mt-4">
          <div className={`text-gray-600 text-sm ${!isDescriptionExpanded ? 'line-clamp-2' : ''}`}>
            {description}
          </div>
          {description && description.length > 100 && (
            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="text-green-600 text-sm mt-1 flex items-center hover:text-green-700"
            >
              {isDescriptionExpanded ? (
                <>
                  收起
                  <ChevronUp className="h-4 w-4 ml-1" />
                </>
              ) : (
                <>
                  展開
                  <ChevronDown className="h-4 w-4 ml-1" />
                </>
              )}
            </button>
          )}
        </div>

        {/* 負責人資訊 */}
        {projectManager && (
          <div className="mt-4 pt-4 border-t">
            <button
              onClick={() => setIsPmInfoExpanded(!isPmInfoExpanded)}
              className="flex items-center justify-between w-full text-sm text-gray-600 hover:text-gray-900"
            >
              <span className="font-medium">負責人資訊</span>
              {isPmInfoExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            
            {isPmInfoExpanded && (
              <div className="mt-2 space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>{projectManager.name}</span>
                  {projectManager.title && (
                    <span className="ml-2 text-gray-500">（{projectManager.title}）</span>
                  )}
                </div>
                {projectManager.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>{projectManager.phone}</span>
                  </div>
                )}
                {projectManager.email && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>{projectManager.email}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
