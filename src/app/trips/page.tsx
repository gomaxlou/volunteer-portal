'use client'

import { useEffect, useState } from 'react'
import { Event } from '@/lib/types'
import EventCard from '@/components/features/EventCard'
import Loading from '@/components/shared/Loading'

export default function TripsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  const futureTrips = events
    .filter(event => {
      if (!event?.startDate || !event?.id) return false
      const eventDate = new Date(event.startDate)
      const now = new Date()
      return eventDate >= now && event.id.startsWith('trip-')
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">出團活動</h1>
        {futureTrips.length === 0 ? (
          <p className="text-center text-gray-600">目前沒有計畫中的出團活動</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {futureTrips.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
