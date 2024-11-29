'use client'

import { useEffect, useState } from 'react'
import { Event } from '@/lib/types'
import EventCard from '@/components/features/EventCard'
import Loading from '@/components/shared/Loading'
import { checkAuth, type UserInfo } from '@/lib/auth'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<UserInfo | null>(null)

  useEffect(() => {
    const verifyAuth = async () => {
      const userInfo = await checkAuth();
      setUser(userInfo);
    };

    verifyAuth();
  }, []);

  useEffect(() => {
    fetch('/api/events')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then(data => {
        if (Array.isArray(data)) {
          setEvents(data)
        } else if (data?.events && Array.isArray(data.events)) {
          setEvents(data.events)
        } else {
          setError('無法取得活動資料')
          console.error('Unexpected data format:', data)
        }
        setLoading(false)
      })
      .catch(error => {
        console.error('取得活動資料失敗:', error)
        setError('無法取得活動資料')
        setLoading(false)
      })
  }, [])

  // 篩選未來的活動並按日期排序
  const futureEvents = events
    .filter(event => {
      if (!event?.startDate) return false
      const eventDate = new Date(event.startDate)
      const now = new Date()
      return eventDate >= now
    })
    .sort((a, b) => {
      const dateA = new Date(a.startDate)
      const dateB = new Date(b.startDate)
      return dateA.getTime() - dateB.getTime()
    })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Loading />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </div>
    )
  }

  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-gray-900">活動列表</h1>
            <div className="text-gray-600">
              共 {futureEvents.length} 個活動
            </div>
          </div>
          {isAdmin && (
            <Link
              href="/events/create"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              新增活動
            </Link>
          )}
        </div>

        {futureEvents.length === 0 ? (
          <p className="text-center text-gray-600 py-8">目前沒有計畫中的活動</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {futureEvents.map((event, index) => (
              <EventCard 
                key={event.id} 
                event={event} 
                isAuthenticated={!!user}
                isAdmin={isAdmin}
                priority={index === 0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
