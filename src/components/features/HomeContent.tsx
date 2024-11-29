'use client'

import dynamic from 'next/dynamic'
import { Suspense, useEffect, useState } from 'react'
import Loading, { LoadingSkeleton } from '@/components/shared/Loading'
import Link from 'next/link'
import { Event } from '@/lib/types'
import { PlusCircle } from 'lucide-react'
import { checkAuth, type UserInfo } from '@/lib/auth'

const HeroSection = dynamic(() => import('@/components/features/HeroSection'), {
  loading: () => <LoadingSkeleton height="h-[60vh] min-h-[400px]" />,
})

const EventCard = dynamic(() => import('@/components/features/EventCard'), {
  loading: () => <LoadingSkeleton />,
})

export default function HomeContent() {
  const [events, setEvents] = useState<Event[]>([]);
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    // 檢查用戶身份
    checkAuth().then(userInfo => {
      setUser(userInfo);
    });

    // 從 API 取得活動資料
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        setEvents(data);
      })
      .catch(() => {
        // 錯誤處理
      });
  }, []);

  return (
    <>
      <Suspense fallback={<LoadingSkeleton height="h-[60vh] min-h-[400px]" />}>
        <HeroSection />
      </Suspense>
      
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              近期活動
            </h2>
            {user?.role === 'admin' && (
              <Link
                href="/events/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                新增活動
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events
              .filter(event => {
                const eventDate = new Date(event.startDate)
                const now = new Date()
                return eventDate >= now
              })
              .sort((a, b) => {
                const dateA = new Date(a.startDate)
                const dateB = new Date(b.startDate)
                return dateB.getTime() - dateA.getTime()
              })
              .slice(0, 6)  // 只顯示前6個活動
              .map((event, index) => (
                <Suspense key={event.id} fallback={<LoadingSkeleton />}>
                  <EventCard event={event} priority={index === 0} />
                </Suspense>
              ))}
          </div>
        </div>
      </section>
    </>
  )
}
