'use client';

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LoadingSkeleton } from '@/components/shared/Loading'
import EventCard from '@/components/features/EventCard'
import type { Event } from '@/lib/types'
import { checkAuth } from '@/lib/auth'

export default function HomePage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false);
  const [allEvents, setAllEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    setMounted(true);
    const verifyAuth = async () => {
      const userInfo = await checkAuth();
      setIsAuthenticated(!!userInfo);
    };

    verifyAuth();
  }, []);

  // 從 API 獲取事件
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events')
        if (!response.ok) {
          throw new Error('Failed to fetch events')
        }
        const data = await response.json()
        if (Array.isArray(data)) {
          setAllEvents(data)
        } else {
          console.error('Invalid events data format:', data)
          setError('數據格式錯誤')
        }
        setLoading(false)
      } catch (err) {
        console.error('Failed to fetch events:', err)
        setError('獲取活動資料失敗')
        setLoading(false)
      }
    }

    if (mounted) {
      fetchEvents()
    }
  }, [mounted])

  if (!mounted || loading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-500">錯誤: {error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">活動列表</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allEvents && allEvents.length > 0 ? (
          allEvents.map((event, index) => (
            <EventCard 
              key={event.id} 
              event={event}
              isAuthenticated={isAuthenticated}
              priority={index === 0}
            />
          ))
        ) : (
          <div className="col-span-3 text-center text-gray-500 py-8">
            目前沒有活動
          </div>
        )}
      </div>
    </div>
  )
}
